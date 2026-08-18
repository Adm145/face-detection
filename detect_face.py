import cv2
from mtcnn import MTCNN

IMAGE_PATH = "data/raw/test.jpg"
OUTPUT_PATH = "data/cropped_face.jpg"

# reads the image as a grid of numbers representing pixel colors by BGR order
image_bgr = cv2.imread(IMAGE_PATH)
print("IMAGE_BGR:", image_bgr);
# mtcnn can only accepts RGB so we flip that
image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

detector = MTCNN()
results = detector.detect_faces(image_rgb)

if not results:
    print("No face found.")
else:
    face = results[0]
    x, y, w, h = face["box"]
    # returns the bigger value of 0 or x/y respectively to prevent negative values -> out of bounds values
    x, y = max(0, x), max(0, y)

    print(f"Found face with confidence {face['confidence']:.3f} at box ({x}, {y}, {w}, {h})")

    cropped_rgb = image_rgb[y:y + h, x:x + w]
    cropped_bgr = cv2.cvtColor(cropped_rgb, cv2.COLOR_RGB2BGR)
    cv2.imwrite(OUTPUT_PATH, cropped_bgr)

    print(f"Saved cropped face to {OUTPUT_PATH}")
