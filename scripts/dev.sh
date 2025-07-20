#!/bin/bash
echo "🚀 Starting Rooms Development Environment..."

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Copying backend environment variables..."
    cp backend/.env.example backend/.env
    echo "✅ Please update backend/.env with your database credentials"
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Copying frontend environment variables..."
    cp frontend/.env.example frontend/.env.local
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migration
echo "🗄️ Running database migration..."
cd backend && npm run migrate

# Start both services
echo "🌟 Starting backend and frontend..."
cd .. && npm run dev
