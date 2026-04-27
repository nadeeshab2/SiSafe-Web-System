from flask import Blueprint, request, jsonify
import os
import uuid
import threading
import joblib
import cv2
from scipy.sparse import hstack

import pytesseract
from PIL import Image

upload_bp = Blueprint("upload", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "ml")
TEMP_DIR = os.path.join(BASE_DIR, "temp")

os.makedirs(TEMP_DIR, exist_ok=True)

# ---------- Shared resources ----------
_model = None
_word_vectorizer = None
_char_vectorizer = None
_resource_lock = threading.Lock()
_predict_lock = threading.Lock()

# 🔥 TESSERACT PATH
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# 🔥 UPDATED BAD WORDS LIST
bad_words = [
    "මෝඩ", "ගොනා", "පලයන්", "හොරා",
    "පිස්සෙක්", "බුරුව", "බල්ල",
    "උබ"
]


# ---------- LOAD MODEL ----------
def load_resources():
    global _model, _word_vectorizer, _char_vectorizer

    with _resource_lock:
        if _model is None:
            _model = joblib.load(os.path.join(MODELS_DIR, "model.pkl"))

        if _word_vectorizer is None:
            _word_vectorizer = joblib.load(
                os.path.join(MODELS_DIR, "word_vectorizer.pkl")
            )

        if _char_vectorizer is None:
            _char_vectorizer = joblib.load(
                os.path.join(MODELS_DIR, "char_vectorizer.pkl")
            )

    return _model, _word_vectorizer, _char_vectorizer


# ---------- IMAGE PREPROCESS ----------
def preprocess_image(input_path: str, output_path: str) -> None:
    img = cv2.imread(input_path)

    if img is None:
        raise ValueError("Could not read uploaded image")

    img = cv2.resize(img, None, fx=2.5, fy=2.5, interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 🔥 contrast boost
    gray = cv2.convertScaleAbs(gray, alpha=1.5, beta=20)

    # 🔥 threshold (clean text)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    cv2.imwrite(output_path, thresh)


# ---------- OCR FIX ----------
def fix_common_ocr_errors(text):
    corrections = {
        "CD": "උබ",
        "C D": "උබ",
        "0": "ඔ",
        "8": "බ"
    }

    for wrong, correct in corrections.items():
        text = text.replace(wrong, correct)

    return text


# ---------- TEXT EXTRACT ----------
def extract_text(processed_path: str, original_path: str) -> str:
    try:
        img = Image.open(processed_path)

        text = pytesseract.image_to_string(
            img,
            lang='sin+eng',
            config='--oem 3 --psm 6'
        )

        # fallback
        if not text or len(text.strip()) < 3:
            img = Image.open(original_path)
            text = pytesseract.image_to_string(
                img,
                lang='sin+eng',
                config='--oem 3 --psm 6'
            )

        text = text.replace("\n", " ").strip()

        # 🔥 FIX OCR ERRORS
        text = fix_common_ocr_errors(text)

        return text

    except Exception as e:
        print("OCR ERROR:", e)
        return ""


# ---------- BAD WORD FIND ----------
def find_highlighted_words(text: str) -> list[str]:
    words = text.split()
    highlighted = []

    for w in words:
        clean = w.strip(".,!?()[]{}'\"")
        if clean in bad_words and clean not in highlighted:
            highlighted.append(clean)

    return highlighted


# ---------- MAIN ROUTE ----------
@upload_bp.route("/upload-detect", methods=["POST"])
def upload_detect():
    upload_path = None
    processed_path = None

    try:
        model, word_vectorizer, char_vectorizer = load_resources()

        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "Empty file"}), 400

        unique_id = str(uuid.uuid4())

        upload_path = os.path.join(TEMP_DIR, f"{unique_id}_upload.png")
        processed_path = os.path.join(TEMP_DIR, f"{unique_id}_processed.png")

        file.save(upload_path)

        preprocess_image(upload_path, processed_path)

        with _predict_lock:
            text = extract_text(processed_path, upload_path)

            print("🔥 FINAL TEXT:", text)

            if not text or len(text.strip()) < 2:
                return jsonify({
                    "text": "",
                    "prediction": "No text detected",
                    "confidence": 0,
                    "highlighted_words": []
                }), 200

            try:
                word_features = word_vectorizer.transform([text])
                char_features = char_vectorizer.transform([text])
                features = hstack([word_features, char_features])

                prediction = model.predict(features)[0]

            except Exception as model_error:
                print("MODEL ERROR:", model_error)
                return jsonify({
                    "text": text,
                    "prediction": "Error in prediction",
                    "confidence": 0,
                    "highlighted_words": []
                }), 200

            highlighted = find_highlighted_words(text)

        return jsonify({
            "text": text,
            "prediction": "Hate Speech" if prediction == 1 else "Safe",
            "confidence": 90,
            "highlighted_words": highlighted
        }), 200

    except Exception as e:
        print("❌ upload_detect ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        for path in [upload_path, processed_path]:
            try:
                if path and os.path.exists(path):
                    os.remove(path)
            except Exception as cleanup_error:
                print("Cleanup error:", cleanup_error)