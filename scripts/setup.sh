#!/bin/bash

# GigaEats Project Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up GigaEats development environment..."

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker and try again."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    
    echo "✅ All requirements are met!"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
}

# Setup environment variables
setup_env() {
    echo "🔧 Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "✅ Environment file created from template"
        echo "⚠️  Please edit .env file with your configuration before starting services"
    else
        echo "✅ Environment file already exists"
    fi
}

# Build shared libraries
build_libs() {
    echo "🔨 Building shared libraries..."
    cd libs/shared && npm run build && cd ../..
    echo "✅ Shared libraries built!"
}

# Start development environment
start_dev() {
    echo "🐳 Starting development environment..."
    docker-compose up -d postgres redis
    echo "✅ Database and cache services started!"
    echo "⏳ Waiting for services to be ready..."
    sleep 10
}

# Run database migrations
setup_database() {
    echo "🗄️  Setting up database..."
    echo "✅ Database schema will be initialized automatically when containers start"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your configuration"
    echo "2. Start all services: npm run docker:dev"
    echo "3. Access API documentation: http://localhost:3000/api/docs"
    echo "4. Check health: curl http://localhost:3000/api/v1/health"
    echo ""
    echo "Available commands:"
    echo "- npm run dev          # Start all services in development mode"
    echo "- npm run docker:dev   # Start with Docker Compose"
    echo "- npm run docker:down  # Stop all services"
    echo "- npm run docker:logs  # View logs"
    echo "- npm run test         # Run tests"
    echo "- npm run lint         # Run linting"
    echo "- npm run build        # Build all services"
    echo ""
    echo "For more information, see README.md"
}

# Main setup flow
main() {
    check_requirements
    install_dependencies
    setup_env
    build_libs
    start_dev
    setup_database
    show_next_steps
}

# Run main function
main "$@"
