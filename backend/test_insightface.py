from insightface.app import FaceAnalysis
import os

MODEL_ROOT = os.path.abspath("models")

print("Model Root:", MODEL_ROOT)

app = FaceAnalysis(
    name="buffalo_l",
    root=MODEL_ROOT,
    providers=["CPUExecutionProvider"],
)

print("Loading model...")

app.prepare(
    ctx_id=-1,
    det_size=(640, 640),
)

print("✅ InsightFace loaded successfully!")