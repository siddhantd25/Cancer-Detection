import io
import time
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input

# ── Class labels (must match training order) ─────────────────────────────────
CLASS_NAMES = [
    "ALL",
    "Brain Cancer",
    "Breast Cancer",
    "Cervical Cancer",
    "Kidney Cancer",
    "Lung and Colon Cancer",
    "Lymphoma",
    "Oral Cancer",
]

MODEL_PATH = "multi_cancer_mobilenetv3_model.keras"
model = None


def load_cancer_model():
    """Load the Keras model once at startup."""
    global model
    print("⏳ Loading MobileNetV3Large cancer detection model...")
    model = load_model(MODEL_PATH)
    print("✅ Model loaded successfully")
    return model


def preprocess_image(file_bytes: bytes) -> np.ndarray:
    """
    Preprocess image bytes for MobileNetV3Large inference.
    - Convert to RGB
    - Resize to (224, 224)
    - Apply MobileNetV3 preprocess_input (NOT /255)
    - Add batch dimension
    """
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB").resize((224, 224))
    arr = np.array(img, dtype=np.float32)
    arr = preprocess_input(arr)          # Scales to [-1, 1] internally
    return np.expand_dims(arr, axis=0)  # Shape: (1, 224, 224, 3)


def run_prediction(file_bytes: bytes) -> dict:
    """
    Run inference and return structured prediction result.
    Returns top prediction, confidence, top-3 results, and processing time.
    """
    if model is None:
        raise RuntimeError("Model not loaded. Call load_cancer_model() first.")

    start_time = time.time()

    img_array = preprocess_image(file_bytes)
    predictions = model.predict(img_array, verbose=0)[0]  # Shape: (8,)

    processing_time_ms = int((time.time() - start_time) * 1000)

    # Build sorted top-3 list
    indexed = sorted(
        enumerate(predictions), key=lambda x: x[1], reverse=True
    )
    top_3 = [
        {
            "class": CLASS_NAMES[i],
            "confidence": round(float(conf) * 100, 2),
        }
        for i, conf in indexed[:3]
    ]

    return {
        "predicted_class": top_3[0]["class"],
        "confidence": top_3[0]["confidence"],
        "top_3": top_3,
        "processing_time_ms": processing_time_ms,
    }
