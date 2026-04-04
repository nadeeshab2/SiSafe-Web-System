from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# 🔥 Import routes
from routes.auth_routes import auth_bp, init_oauth
from routes.predict_routes import predict_bp
from routes.report_routes import report_bp
from routes.plugin_routes import plugin_bp

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SECURE"] = False  # local development only

CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}},
    supports_credentials=True,
)

# OAuth init
init_oauth(app)

# 🔥 Register routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(predict_bp, url_prefix="/api")
app.register_blueprint(report_bp, url_prefix="/api")
app.register_blueprint(plugin_bp, url_prefix="/api")


@app.route("/")
def home():
    return {"message": "SiSafe backend is running"}


if __name__ == "__main__":
    app.run(debug=True)