#!/bin/bash

echo "========================================"
echo "  AI Underwater Image Enhancement"
echo "  Production Deployment Script"
echo "  SIH 2025 - Maritime Security System"
echo "========================================"
echo

echo "Building and deploying production system..."
echo

echo "[1/4] Building Docker images..."
docker-compose build --no-cache

echo
echo "[2/4] Starting database services..."
docker-compose up -d mongodb redis

echo
echo "[3/4] Starting backend services..."
docker-compose up -d backend

echo
echo "[4/4] Starting frontend services..."
docker-compose up -d frontend nginx

echo
echo "========================================"
echo "  Production System Deployed!"
echo "========================================"
echo
echo "Services:"
echo "  Frontend:    http://localhost:80"
echo "  Backend:     http://localhost:8000"
echo "  API Docs:    http://localhost:8000/docs"
echo "  MongoDB:     localhost:27017"
echo "  Redis:       localhost:6379"
echo "  Mongo Express: http://localhost:8081"
echo
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
echo "========================================"
echo
echo "Press Enter to view system status..."
read

echo
echo "System Status:"
docker-compose ps

echo
echo "Press Enter to close..."
read
