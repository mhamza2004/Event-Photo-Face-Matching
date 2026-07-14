import os
import cv2
import insightface

from insightface.app import FaceAnalysis

MODEL_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../models"))


class FaceEngine:

    def __init__(self):
        print("Loading InsightFace model...")

        self.app = FaceAnalysis(
            name="buffalo_l",
            root=MODEL_ROOT,
            providers=["CPUExecutionProvider"],
        )
        # Downloads model automatically if missing
        self.app.prepare(
            ctx_id=-1,
            det_size=(640, 640),
        )

        print("✅ InsightFace loaded successfully!")

    def detect_faces(
        self,
        image_path: str,
    ):

        image = cv2.imread(image_path)

        if image is None:
            raise Exception(
                f"Could not load image: {image_path}"
            )

        return self.app.get(image)

    def get_embedding(
        self,
        image_path: str,
    ):

        faces = self.detect_faces(
            image_path
        )

        if len(faces) == 0:
            raise Exception(
                "No face detected."
            )

        if len(faces) > 1:
            raise Exception(
                "Please upload an image containing only one face."
            )

        return faces[0].embedding


face_engine = FaceEngine()