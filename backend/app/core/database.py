"""
Database connection and initialization for MongoDB
"""

import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import logging
from .config import settings

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

# Global database instance
db = Database()

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db.database

async def init_db():
    """Initialize database connection"""
    try:
        db.client = AsyncIOMotorClient(settings.MONGODB_URL)
        db.database = db.client[settings.DATABASE_NAME]
        
        # Test connection
        await db.client.admin.command('ping')
        logger.info(f"Connected to MongoDB: {settings.DATABASE_NAME}")
        
        # Create collections and indexes
        await create_collections()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        # For development, continue without database
        logger.warning("Running without database connection")

async def close_db():
    """Close database connection"""
    if db.client:
        db.client.close()

async def create_collections():
    """Create necessary collections and indexes"""
    try:
        # Processing Results Collection
        processing_collection = db.database.processing_results
        await processing_collection.create_index("timestamp")
        await processing_collection.create_index("filename")
        
        # Metrics Collection
        metrics_collection = db.database.metrics
        await metrics_collection.create_index("timestamp")
        await metrics_collection.create_index("image_id")
        
        # Detections Collection
        detections_collection = db.database.detections
        await detections_collection.create_index("timestamp")
        await detections_collection.create_index("image_id")
        await detections_collection.create_index("threat_type")
        
        logger.info("Database collections created successfully")
        
    except Exception as e:
        logger.warning(f"Error creating collections: {e}")