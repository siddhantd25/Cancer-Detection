import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    """Connect to MongoDB Atlas on startup."""
    global client, db
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client["cancerdetect"]
    print("✅ Connected to MongoDB Atlas")

    # Create indexes for performance
    await db.users.create_index("email", unique=True)
    await db.predictions.create_index("user_id")
    await db.predictions.create_index("timestamp")
    print("✅ Database indexes ensured")


async def close_db():
    """Close MongoDB connection on shutdown."""
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


def get_db():
    """Return the database instance."""
    return db
