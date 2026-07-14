import cv2

from app.ai.face_engine import face_engine

IMAGE_PATH = "uploads/events/3/12xy6456tgrtgx454.png"

image = cv2.imread(IMAGE_PATH)

if image is None:
    print("❌ Could not load image.")
    exit()

faces = face_engine.detect_faces(image)

print("=" * 40)
print(f"Faces Detected: {len(faces)}")
print("=" * 40)

for index, face in enumerate(faces, start=1):

    bbox = face.bbox.astype(int)
    embedding = face.embedding

    print()
    print("=" * 50)
    print(f"Embedding Length : {len(embedding)}")
    print("First 10 Values :")
    print(embedding[:10])
    print("=" * 50)

    x1, y1, x2, y2 = bbox

    cv2.rectangle(
        image,
        (x1, y1),
        (x2, y2),
        (0, 255, 0),
        2,
    )

    cv2.putText(
        image,
        f"Face {index}",
        (x1, y1 - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (0, 255, 0),
        2,
    )

    print(f"Face #{index}")
    print("Bounding Box:", bbox)
    print("Confidence :", face.det_score)

OUTPUT_PATH = "output_detected.jpg"

cv2.imwrite(
    OUTPUT_PATH,
    image,
)

print()
print(f"✅ Output saved as: {OUTPUT_PATH}")