"""
Run this ONCE locally to convert the heavy .keras model to a lightweight .tflite file.
Usage: backend\venv\Scripts\python.exe convert_to_tflite.py
"""
import tensorflow as tf
import os

KERAS_PATH = os.path.join("backend", "multi_cancer_mobilenetv3_model.keras")
TFLITE_PATH = os.path.join("backend", "model.tflite")

print(f"Loading {KERAS_PATH} ...")
model = tf.keras.models.load_model(KERAS_PATH)

print("Converting to TFLite ...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

with open(TFLITE_PATH, "wb") as f:
    f.write(tflite_model)

size_mb = os.path.getsize(TFLITE_PATH) / (1024 * 1024)
print(f"✅  Saved {TFLITE_PATH}  ({size_mb:.1f} MB)")
