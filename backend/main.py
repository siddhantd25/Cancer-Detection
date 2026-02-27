import os
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from dotenv import load_dotenv

from database import connect_db, close_db, get_db
from auth import (
    RegisterRequest,
    LoginRequest,
    get_current_user,
    register_user,
    login_user,
)
from model import load_cancer_model, run_prediction
from cloudinary_utils import upload_image

load_dotenv()

# ── App init ──────────────────────────────────────────────────────────────────

app = FastAPI(
    title="CancerDetect API",
    description="Medical image cancer classification powered by MobileNetV3Large",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://cancer-detection-web.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


import asyncio

# ── Lifecycle events ──────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    await connect_db()
    # Run the sync model loader in a thread so it doesn't block uvicorn's
    # event loop — this lets the port bind before model loading completes
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, load_cancer_model)


@app.on_event("shutdown")
async def shutdown():
    await close_db()


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "CancerDetect is running"}


# ── Auth routes ───────────────────────────────────────────────────────────────

@app.post("/auth/register", tags=["Auth"])
async def register(data: RegisterRequest):
    return await register_user(data)


@app.post("/auth/login", tags=["Auth"])
async def login(data: LoginRequest):
    return await login_user(data)


@app.get("/auth/me", tags=["Auth"])
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "created_at": current_user["created_at"],
    }


# ── Predict route ─────────────────────────────────────────────────────────────

@app.post("/predict", tags=["Prediction"])
async def predict(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are accepted",
        )

    file_bytes = await file.read()
    user_id = str(current_user["_id"])

    # 1. Upload image to Cloudinary
    image_url = upload_image(file_bytes, user_id)

    # 2. Run model inference
    result = run_prediction(file_bytes)

    # 3. Save prediction to MongoDB
    db = get_db()
    timestamp = datetime.utcnow()

    prediction_doc = {
        "user_id": user_id,
        "timestamp": timestamp,
        "image_url": image_url,
        "predicted_class": result["predicted_class"],
        "confidence": result["confidence"],
        "top_3": result["top_3"],
        "processing_time_ms": result["processing_time_ms"],
    }

    inserted = await db.predictions.insert_one(prediction_doc)

    return {
        "prediction": result["predicted_class"],
        "confidence": result["confidence"],
        "top_3": result["top_3"],
        "image_url": image_url,
        "record_id": str(inserted.inserted_id),
        "timestamp": timestamp.isoformat() + "Z",
        "processing_time_ms": result["processing_time_ms"],
    }


# ── Batch predict route ───────────────────────────────────────────────────────

from typing import List

@app.post("/predict/batch", tags=["Prediction"])
async def predict_batch(
    files: List[UploadFile] = File(...),
    current_user: dict = Depends(get_current_user),
):
    if len(files) < 1:
        raise HTTPException(status_code=400, detail="At least 1 image is required")
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 images allowed per batch")

    user_id = str(current_user["_id"])
    db = get_db()
    results = []

    for idx, file in enumerate(files):
        if not file.content_type.startswith("image/"):
            results.append({
                "index": idx,
                "filename": file.filename,
                "status": "error",
                "error": "Not a valid image file",
            })
            continue

        try:
            file_bytes = await file.read()
            image_url  = upload_image(file_bytes, user_id)
            result     = run_prediction(file_bytes)
            timestamp  = datetime.utcnow()

            prediction_doc = {
                "user_id": user_id,
                "timestamp": timestamp,
                "image_url": image_url,
                "predicted_class": result["predicted_class"],
                "confidence": result["confidence"],
                "top_3": result["top_3"],
                "processing_time_ms": result["processing_time_ms"],
            }
            inserted = await db.predictions.insert_one(prediction_doc)

            results.append({
                "index": idx,
                "filename": file.filename,
                "status": "success",
                "prediction": result["predicted_class"],
                "confidence": result["confidence"],
                "top_3": result["top_3"],
                "image_url": image_url,
                "record_id": str(inserted.inserted_id),
                "timestamp": timestamp.isoformat() + "Z",
                "processing_time_ms": result["processing_time_ms"],
            })
        except Exception as e:
            results.append({
                "index": idx,
                "filename": file.filename,
                "status": "error",
                "error": str(e),
            })

    return {
        "total": len(files),
        "successful": sum(1 for r in results if r["status"] == "success"),
        "results": results,
    }


# ── History routes ────────────────────────────────────────────────────────────

def serialize_prediction(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    return {
        "id": str(doc["_id"]),
        "user_id": doc["user_id"],
        "timestamp": doc["timestamp"].isoformat() + "Z",
        "image_url": doc["image_url"],
        "predicted_class": doc["predicted_class"],
        "confidence": doc["confidence"],
        "top_3": doc["top_3"],
        "processing_time_ms": doc.get("processing_time_ms", 0),
    }


@app.get("/history", tags=["History"])
async def get_history(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])

    cursor = db.predictions.find(
        {"user_id": user_id}
    ).sort("timestamp", -1)

    predictions = []
    async for doc in cursor:
        predictions.append(serialize_prediction(doc))

    return {"predictions": predictions, "total": len(predictions)}


@app.get("/history/{record_id}", tags=["History"])
async def get_history_item(
    record_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    user_id = str(current_user["_id"])

    try:
        obj_id = ObjectId(record_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid record ID")

    doc = await db.predictions.find_one(
        {"_id": obj_id, "user_id": user_id}
    )

    if not doc:
        raise HTTPException(status_code=404, detail="Prediction not found")

    return serialize_prediction(doc)


@app.delete("/history/{record_id}", tags=["History"])
async def delete_history_item(
    record_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    user_id = str(current_user["_id"])

    try:
        obj_id = ObjectId(record_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid record ID")

    result = await db.predictions.delete_one(
        {"_id": obj_id, "user_id": user_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found or not authorized",
        )

    return {"message": "Prediction deleted successfully"}
