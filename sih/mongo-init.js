// MongoDB initialization script
db = db.getSiblingDB('underwater_security');

// Create collections
db.createCollection('processed_images');
db.createCollection('threat_detections');
db.createCollection('analytics');
db.createCollection('system_logs');

// Create indexes for better performance
db.processed_images.createIndex({ "timestamp": 1 });
db.processed_images.createIndex({ "user_id": 1 });
db.processed_images.createIndex({ "processing_status": 1 });

db.threat_detections.createIndex({ "timestamp": 1 });
db.threat_detections.createIndex({ "confidence_score": -1 });
db.threat_detections.createIndex({ "threat_type": 1 });

db.analytics.createIndex({ "date": 1 });
db.analytics.createIndex({ "metric_type": 1 });

db.system_logs.createIndex({ "timestamp": 1 });
db.system_logs.createIndex({ "level": 1 });

// Insert sample data for demonstration
db.processed_images.insertOne({
    "image_id": "sample_001",
    "original_filename": "underwater_sample.jpg",
    "processing_status": "completed",
    "enhancement_applied": true,
    "threat_detection_completed": true,
    "timestamp": new Date(),
    "metadata": {
        "width": 1920,
        "height": 1080,
        "file_size": 2048000,
        "enhancement_method": "gan_based"
    }
});

db.threat_detections.insertOne({
    "detection_id": "det_001",
    "image_id": "sample_001",
    "threat_type": "submarine",
    "confidence_score": 0.85,
    "bounding_box": {
        "x": 245,
        "y": 180,
        "width": 120,
        "height": 80
    },
    "timestamp": new Date(),
    "verified": false
});

db.analytics.insertMany([
    {
        "metric_type": "images_processed",
        "value": 150,
        "date": new Date(),
        "timestamp": new Date()
    },
    {
        "metric_type": "threats_detected",
        "value": 12,
        "date": new Date(),
        "timestamp": new Date()
    },
    {
        "metric_type": "average_processing_time",
        "value": 2.5,
        "date": new Date(),
        "timestamp": new Date()
    }
]);

print('Database initialized successfully with sample data');