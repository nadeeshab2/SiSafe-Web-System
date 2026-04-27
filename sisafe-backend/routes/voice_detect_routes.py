from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
from scipy.sparse import hstack
import os
import joblib
import tempfile

load_dotenv()

voice_bp = Blueprint("voice", __name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, "ml")

model = joblib.load(os.path.join(ML_DIR, "model.pkl"))
word_vectorizer = joblib.load(os.path.join(ML_DIR, "word_vectorizer.pkl"))
char_vectorizer = joblib.load(os.path.join(ML_DIR, "char_vectorizer.pkl"))

bad_words = ["මෝඩ", "ගොනා", "පලයන්", "හොරා", "වේසි", "පකයා"]

ALLOWED_AUDIO_EXTENSIONS = {"mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm"}


def allowed_audio(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_AUDIO_EXTENSIONS


def predict_text(text):
    word_features = word_vectorizer.transform([text])
    char_features = char_vectorizer.transform([text])
    features = hstack([word_features, char_features])

    prediction = model.predict(features)[0]

    if prediction == 1:
        return "Hate Speech", 90
    return "Safe", 85


def find_highlighted_words(text):
    found = []
    for word in bad_words:
        if word in text:
            found.append(word)
    return found


@voice_bp.route("/voice-detect", methods=["POST"])
def voice_detect():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file uploaded"}), 400

        audio_file = request.files["audio"]

        if audio_file.filename == "":
            return jsonify({"error": "No selected audio file"}), 400

        if not allowed_audio(audio_file.filename):
            return jsonify({
                "error": "Invalid audio format. Use mp3, mp4, m4a, wav, or webm."
            }), 400

        suffix = "." + audio_file.filename.rsplit(".", 1)[1].lower()

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_audio:
            audio_file.save(temp_audio.name)
            temp_path = temp_audio.name

        try:
            with open(temp_path, "rb") as audio:
                transcript = client.audio.transcriptions.create(
                    model="gpt-4o-mini-transcribe",
                    file=audio,
                    response_format="json",
                    language="si"
                )

            transcribed_text = transcript.text.strip()
            print("🎙️ Transcribed text:", transcribed_text)

        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

        if not transcribed_text:
            return jsonify({
                "error": "Could not transcribe audio. Please try clearer audio."
            }), 400

        prediction, confidence = predict_text(transcribed_text)
        highlighted_words = find_highlighted_words(transcribed_text)

        return jsonify({
            "transcribed_text": transcribed_text,
            "prediction": prediction,
            "confidence": confidence,
            "highlighted_words": highlighted_words,
            "message": "Voice detection successful"
        }), 200

    except Exception as e:
        print("❌ Voice detection error:", str(e))
        return jsonify({"error": str(e)}), 500