#!/bin/bash

# E-Water Gate Backend Docker Runner Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Function to check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found!"
        print_status "Creating .env.example template..."
        cat > .env.example << EOF
# Server Configuration
NODE_ENV=development
PORT=4000

# Database Configuration
MONGODB_URL=mongodb://mongo:27017/e-water-gate

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXP=24h

# Email Configuration (Gmail)
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASS=your-gmail-app-password
EOF
        print_error "Please create a .env file with your configuration and try again."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev     - Run in development mode with hot reload"
    echo "  prod    - Run in production mode"
    echo "  build   - Build the Docker image"
    echo "  stop    - Stop all containers"
    echo "  clean   - Stop and remove all containers and volumes"
    echo "  logs    - Show logs from running containers"
    echo "  shell   - Open shell in the app container"
    echo "  help    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev     # Start development environment"
    echo "  $0 prod    # Start production environment"
    echo "  $0 stop    # Stop all containers"
}

# Main script logic
case "$1" in
    "dev")
        print_status "Starting development environment..."
        check_env_file
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    "prod")
        print_status "Starting production environment..."
        check_env_file
        docker-compose -f docker-compose.prod.yml up --build -d
        print_status "Production environment started in background"
        print_status "Check logs with: $0 logs"
        ;;
    "build")
        print_status "Building Docker image..."
        docker-compose build
        ;;
    "stop")
        print_status "Stopping all containers..."
        docker-compose down
        ;;
    "clean")
        print_warning "This will remove all containers and volumes (data will be lost)"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Cleaning up..."
            docker-compose down -v
            docker system prune -f
            print_status "Cleanup completed"
        else
            print_status "Cleanup cancelled"
        fi
        ;;
    "logs")
        print_status "Showing logs..."
        docker-compose logs -f
        ;;
    "shell")
        print_status "Opening shell in app container..."
        docker-compose exec app sh
        ;;
    "help"|"--help"|"-h"|"")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac 