import io
import os
import time
import numpy as np
from PIL import Image

try:
    # Lightweight runtime — this is what Render (Linux) will use
    import tflite_runtime.interpreter as tflite
except ImportError:
    # Fallback for local dev where full TensorFlow is already installed
    import tensorflow.lite as tflite

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

# Absolute path so the file is found regardless of working directory
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model.tflite")

interpreter = None
input_details = None
output_details = None


def load_cancer_model():
    """Load the TFLite model once at startup."""
    global interpreter, input_details, output_details
    print(f"⏳ Loading TFLite model from {MODEL_PATH} ...")
    interpreter = tflite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    print("✅ TFLite model loaded successfully")
    return interpreter


def preprocess_image(file_bytes: bytes) -> np.ndarray:
    """
    Preprocess image bytes for MobileNetV3Large TFLite inference.
    - Convert to RGB and resize to 224×224
    - Scale to [0, 255] float32 (TFLite model handles normalisation internally)
    - Add batch dimension → shape (1, 224, 224, 3)
    """
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB").resize((224, 224))
    arr = np.array(img, dtype=np.float32)
    return np.expand_dims(arr, axis=0)


def run_prediction(file_bytes: bytes) -> dict:
    """
    Run inference and return structured prediction result.
    Returns top prediction, confidence, top-3 results, and processing time.
    """
    if interpreter is None:
        raise RuntimeError("Model not loaded. Call load_cancer_model() first.")

    start_time = time.time()

    img_array = preprocess_image(file_bytes)

    interpreter.set_tensor(input_details[0]["index"], img_array)
    interpreter.invoke()
    predictions = interpreter.get_tensor(output_details[0]["index"])[0]  # shape (8,)

    processing_time_ms = int((time.time() - start_time) * 1000)

    # Sort descending and take top 3
    indexed = sorted(enumerate(predictions), key=lambda x: x[1], reverse=True)
    top_3 = [
        {"class": CLASS_NAMES[i], "confidence": round(float(conf) * 100, 2)}
        for i, conf in indexed[:3]
    ]

    return {
        "predicted_class": top_3[0]["class"],
        "confidence": top_3[0]["confidence"],
        "top_3": top_3,
        "processing_time_ms": processing_time_ms,
    }
