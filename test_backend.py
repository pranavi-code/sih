#!/usr/bin/env python3
"""
Quick test script to verify backend works
"""

import sys
import os

# Add backend to path
sys.path.append('backend')

try:
    print("Testing backend imports...")
    from backend.app.core.database import init_db
    print("✅ Database import successful")
    
    from backend.app.services.enhancement_service import ImageEnhancementService
    print("✅ Enhancement service import successful")
    
    from backend.app.services.threat_detection_service import ThreatDetectionService
    print("✅ Detection service import successful")
    
    print("\n🎉 All imports successful! Backend is ready.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
