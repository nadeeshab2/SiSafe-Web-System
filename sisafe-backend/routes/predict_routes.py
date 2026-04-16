from flask import Blueprint, request, jsonify
from datetime import datetime
import joblib
import os
from scipy.sparse import hstack
from werkzeug.utils import secure_filename
from io import BytesIO
import docx
from PyPDF2 import PdfReader
import jwt
from dotenv import load_dotenv

from config.db import detections_collection

load_dotenv()

predict_bp = Blueprint("predict", __name__)

# Load model + vectorizers
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, "ml")

model = joblib.load(os.path.join(ML_DIR, "model.pkl"))
word_vectorizer = joblib.load(os.path.join(ML_DIR, "word_vectorizer.pkl"))
char_vectorizer = joblib.load(os.path.join(ML_DIR, "char_vectorizer.pkl"))

# Strong offensive words
strong_hate_keywords = [
    "පලයන්", "හුත්තො", "වේසී", "පකයා"
]

# Context dependent words
context_hate_keywords = [
    "මෝඩ", "මෝඩයා", "මෝඩයෙක්",
    "ගොන්", "ගොනා", "ගොනෙක්",
    "පිස්සු", "හරක", "නරක"
]

# Target words
target_words = [
    "ඔයා", "ඔබ", "උබ", "තෝ", "නුඹ", "තමුසේ"
]

ALLOWED_EXTENSIONS = {"txt", "pdf", "docx"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def normalize_text(text):
    return (
        text.strip()
        .lower()
        .replace(",", " ")
        .replace(".", " ")
        .replace("!", " ")
        .replace("?", " ")
    )

def extract_text_from_txt(file_storage):
    return file_storage.read().decode("utf-8")

def extract_text_from_pdf(file_storage):
    pdf = PdfReader(BytesIO(file_storage.read()))
    text = ""

    for page in pdf.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"

    return text.strip()

def extract_text_from_docx(file_storage):
    document = docx.Document(BytesIO(file_storage.read()))
    text = "\n".join([para.text for para in document.paragraphs])
    return text.strip()

def get_current_user_from_token():
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            os.getenv("SECRET_KEY"),
            algorithms=["HS256"]
        )

        return {
            "user_id": payload.get("user_id") or payload.get("_id"),
            "email": payload.get("email"),
            "name": payload.get("name"),
            "provider": payload.get("provider", "local")
        }
    except Exception:
        return None

def detect_text_content(text):
    clean_text = normalize_text(text)

    matched_strong = next((w for w in strong_hate_keywords if w in clean_text), None)
    matched_context = next((w for w in context_hate_keywords if w in clean_text), None)
    matched_target = next((w for w in target_words if w in clean_text), None)

    if matched_strong:
        result = "Hate Speech"
        confidence = 95

    elif matched_context and matched_target:
        result = "Hate Speech"
        confidence = 93

    else:
        word_features = word_vectorizer.transform([text])
        char_features = char_vectorizer.transform([text])
        features = hstack([word_features, char_features])

        prediction = model.predict(features)[0]

        if prediction == 1:
            result = "Hate Speech"
            confidence = 90
        else:
            result = "Safe"
            confidence = 85

    return result, confidence

@predict_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "Text is required"}), 400

        result, confidence = detect_text_content(text)
        current_user = get_current_user_from_token()

        detection_doc = {
            "user_id": current_user["user_id"] if current_user else None,
            "email": current_user["email"] if current_user else None,
            "text": text,
            "mode": "text",
            "prediction": result,
            "confidence": confidence,
            "created_at": datetime.utcnow()
        }

        detections_collection.insert_one(detection_doc)

        return jsonify({
            "prediction": result,
            "confidence": confidence,
            "message": "Prediction successful"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@predict_bp.route("/file-predict", methods=["POST"])
def file_predict():
    try:
        current_user = get_current_user_from_token()
        if not current_user:
            return jsonify({"error": "Login required for file detection"}), 401

        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        uploaded_file = request.files["file"]

        if uploaded_file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        if not allowed_file(uploaded_file.filename):
            return jsonify({"error": "Only TXT, PDF, and DOCX files are allowed"}), 400

        filename = secure_filename(uploaded_file.filename)
        extension = filename.rsplit(".", 1)[1].lower()

        extracted_text = ""

        if extension == "txt":
            extracted_text = extract_text_from_txt(uploaded_file)
        elif extension == "pdf":
            extracted_text = extract_text_from_pdf(uploaded_file)
        elif extension == "docx":
            extracted_text = extract_text_from_docx(uploaded_file)

        if not extracted_text.strip():
            return jsonify({"error": "Could not extract text from file"}), 400

        result, confidence = detect_text_content(extracted_text)

        detection_doc = {
            "user_id": current_user["user_id"],
            "email": current_user["email"],
            "text": extracted_text,
            "mode": "file",
            "filename": filename,
            "prediction": result,
            "confidence": confidence,
            "created_at": datetime.utcnow()
        }

        detections_collection.insert_one(detection_doc)

        return jsonify({
            "filename": filename,
            "prediction": result,
            "confidence": confidence,
            "message": "File prediction successful"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500