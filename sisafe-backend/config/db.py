from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = None

try:
    if not MONGO_URI:
        raise Exception("MONGO_URI not found in .env file")

    client = MongoClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=30000
    )

    # test connection
    client.server_info()
    print("✅ MongoDB connected successfully")

except Exception as e:
    print("❌ MongoDB connection failed")
    print(e)

# collections setup
if client:
    db = client["sisafe_db"]

    users_collection = db["users"]
    detections_collection = db["detections"]
    reports_collection = db["reports"]

    # 🔥 INDEXES (VERY IMPORTANT FOR PERFORMANCE)
    users_collection.create_index("email", unique=True)
    detections_collection.create_index("user_id")
    detections_collection.create_index("created_at")

else:
    db = None
    users_collection = None
    detections_collection = None
    reports_collection = None