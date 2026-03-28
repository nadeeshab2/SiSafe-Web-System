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
app.secret_key = os.getenv("SECRET_KEY")

# CORS enable
CORS(app, supports_credentials=True)

# OAuth init
init_oauth(app)

# 🔥 Register routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(predict_bp, url_prefix="/api")
app.register_blueprint(report_bp, url_prefix="/api")
app.register_blueprint(plugin_bp, url_prefix="/api")


@app.route("/")
def home():
    return "SiSafe Backend Running"


if __name__ == "__main__":
    app.run(debug=True)