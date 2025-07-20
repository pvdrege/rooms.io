#!/bin/bash
echo "🚀 Deploying Rooms to Production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Deployment aborted."
    exit 1
fi

# Build frontend
echo "🏗️ Building frontend..."
cd frontend && npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed. Deployment aborted."
    exit 1
fi

# Build backend (if needed)
cd ../backend
echo "📦 Backend build..."
npm run build

echo "✅ Deployment preparation complete!"
echo "🌐 Frontend built at: frontend/out/"
echo "🔧 Backend ready for production"
echo ""
echo "Next steps:"
echo "1. Set up production database"
echo "2. Configure environment variables"
echo "3. Run database migrations: npm run migrate"
echo "4. Deploy to your hosting service (Render, Vercel, etc.)"
