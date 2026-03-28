from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = None

try:
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

# only if connected
if client:
    db = client["sisafe_db"]

    users_collection = db["users"]
    detections_collection = db["detections"]
    reports_collection = db["reports"]   # ✅ NEW LINE ADDED

else:
    db = None
    users_collection = None
    detections_collection = None
    reports_collection = None   # ✅ ALSO ADD THIS