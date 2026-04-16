from flask import Blueprint, request, jsonify
import os
import joblib
from PIL import Image
import pytesseract
from scipy.sparse import hstack

upload_bp = Blueprint("upload", __name__)

# 🔥 Windows path fix (VERY IMPORTANT)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "ml")

model = joblib.load(os.path.join(MODELS_DIR, "model.pkl"))
word_vectorizer = joblib.load(os.path.join(MODELS_DIR, "word_vectorizer.pkl"))
char_vectorizer = joblib.load(os.path.join(MODELS_DIR, "char_vectorizer.pkl"))

# 🔥 simple bad words list (later improve)
bad_words = ["මෝඩ", "ගොනා", "පලයන්", "හොරා"]

@upload_bp.route("/upload-detect", methods=["POST"])
def upload_detect():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "Empty file"}), 400

        # 🔥 save temp file
        filepath = os.path.join(BASE_DIR, "temp.png")
        file.save(filepath)

        # 🔥 OCR extract text
        text = pytesseract.image_to_string(Image.open(filepath), lang="eng")

        # 🔥 vectorize
        word_features = word_vectorizer.transform([text])
        char_features = char_vectorizer.transform([text])
        features = hstack([word_features, char_features])

        prediction = model.predict(features)[0]

        # 🔥 highlight words
        words = text.split()
        highlighted = []

        for w in words:
            if w in bad_words:
                highlighted.append(w)

        return jsonify({
            "text": text,
            "prediction": "Hate Speech" if prediction == 1 else "Safe",
            "highlighted_words": highlighted,
            "confidence": 90
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500