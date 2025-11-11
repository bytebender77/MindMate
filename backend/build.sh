#!/bin/bash
# Build script for Render deployment

echo "🔨 Building MindMate Backend..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Verify installation
echo "✅ Dependencies installed"

# Run database migrations (if any)
echo "🗄️ Setting up database..."
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

echo "✅ Build complete!"

