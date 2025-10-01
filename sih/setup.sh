#!/bin/bash

# Underwater Image Enhancement System - Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

echo "🌊 AI-Based Underwater Image Enhancement System Setup"
echo "======================================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Docker is installed and running
check_docker() {
    print_header "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed."
        exit 1
    fi

    print_status "Docker and Docker Compose are ready!"
}

# Check if Git is installed
check_git() {
    print_header "Checking Git installation..."
    
    if ! command -v git &> /dev/null; then
        print_warning "Git is not installed. Some features may not work."
    else
        print_status "Git is available!"
    fi
}

# Create necessary directories
create_directories() {
    print_header "Creating necessary directories..."
    
    mkdir -p models
    mkdir -p uploads
    mkdir -p logs
    mkdir -p test-images
    mkdir -p backups
    
    print_status "Directories created successfully!"
}

# Create environment file
create_env_file() {
    print_header "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cat > .env << EOL
# Database Configuration
MONGODB_URL=mongodb://admin:underwater_admin_2024@mongodb:27017/underwater_security?authSource=admin
REDIS_URL=redis://redis:6379

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
MAX_FILE_SIZE=52428800
WORKERS=4

# Model Configuration
MODEL_PATH=/app/models
UPLOAD_PATH=/app/uploads
ENHANCEMENT_MODEL=underwater_gan_v2.h5
DETECTION_MODEL=yolo_underwater_v11.pt

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_MAX_FILE_SIZE=52428800

# Security
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# Edge Deployment
TENSORRT_ENABLED=false
QUANTIZATION_ENABLED=true
EDGE_BATCH_SIZE=1
EOL
        print_status "Environment file created: .env"
    else
        print_status "Environment file already exists: .env"
    fi
}

# Download sample test images
download_test_images() {
    print_header "Setting up test images..."
    
    # Create placeholder test images info
    cat > test-images/README.md << EOL
# Test Images for Underwater Enhancement System

Place your test images in this directory for testing the system.

## Recommended Test Images:
- **underwater_clear.jpg**: Clear underwater scene for enhancement testing
- **underwater_murky.jpg**: Low visibility image for challenging enhancement
- **submarine_test.jpg**: Image containing submarine for threat detection
- **underwater_debris.jpg**: Scene with debris for object detection

## Image Requirements:
- Format: JPG, PNG, BMP, TIFF
- Max size: 50MB
- Resolution: Any (will be processed accordingly)
- Color: RGB color images preferred

## Testing Process:
1. Upload images through the web interface at http://localhost
2. Check enhancement results in the Image Enhancement page
3. Verify threat detection in the Threat Detection page
4. Monitor processing metrics in the Analytics dashboard
EOL
    
    print_status "Test images directory setup complete!"
}

# Pull Docker images
pull_docker_images() {
    print_header "Pulling required Docker images..."
    
    docker-compose pull
    
    print_status "Docker images pulled successfully!"
}

# Build the application
build_application() {
    print_header "Building the application..."
    
    # Build the Docker containers
    docker-compose build --no-cache
    
    print_status "Application built successfully!"
}

# Start the services
start_services() {
    print_header "Starting all services..."
    
    # Start all services in detached mode
    docker-compose up -d
    
    print_status "Services are starting up..."
    
    # Wait for services to be ready
    print_status "Waiting for services to initialize..."
    sleep 30
    
    # Check service health
    check_service_health
}

# Check service health
check_service_health() {
    print_header "Checking service health..."
    
    # Check backend health
    for i in {1..10}; do
        if curl -f http://localhost:8000/health &> /dev/null; then
            print_status "Backend service is healthy!"
            break
        else
            if [ $i -eq 10 ]; then
                print_error "Backend service failed to start properly"
                show_logs
                exit 1
            fi
            print_status "Waiting for backend service... ($i/10)"
            sleep 5
        fi
    done
    
    # Check frontend
    if curl -f http://localhost &> /dev/null; then
        print_status "Frontend service is healthy!"
    else
        print_warning "Frontend service may still be starting up"
    fi
    
    # Check database
    if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        print_status "Database service is healthy!"
    else
        print_warning "Database service may still be starting up"
    fi
}

# Show service logs
show_logs() {
    print_header "Recent service logs:"
    docker-compose logs --tail=20
}

# Display final information
show_final_info() {
    print_header "🎉 Setup Complete!"
    echo ""
    echo "Your AI-Based Underwater Image Enhancement System is ready!"
    echo ""
    echo "📍 Access Points:"
    echo "  🖥️  Web Dashboard:     http://localhost"
    echo "  📚 API Documentation: http://localhost:8000/docs"
    echo "  🔧 Database Admin:    http://localhost:8081 (admin/admin)"
    echo ""
    echo "🔍 Service Status:"
    docker-compose ps
    echo ""
    echo "📝 Useful Commands:"
    echo "  View logs:      docker-compose logs -f [service]"
    echo "  Stop services:  docker-compose down"
    echo "  Restart:        docker-compose restart [service]"
    echo "  Update:         docker-compose pull && docker-compose up -d"
    echo ""
    echo "🚀 Ready to enhance underwater images and detect maritime threats!"
    echo ""
    print_warning "Note: The system may take a few minutes to fully initialize all AI models."
}

# Main setup process
main() {
    echo ""
    print_status "Starting setup process..."
    echo ""
    
    check_docker
    check_git
    create_directories
    create_env_file
    download_test_images
    
    read -p "Do you want to start the services now? [Y/n]: " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        pull_docker_images
        build_application
        start_services
        show_final_info
    else
        print_status "Setup complete! Run 'docker-compose up -d' when ready to start."
    fi
}

# Handle script interruption
trap 'print_error "Setup interrupted by user."; exit 1' INT TERM

# Run main function
main "$@"