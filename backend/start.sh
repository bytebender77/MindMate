#!/bin/bash
# Start script for Render deployment

echo "🚀 Starting MindMate API..."

# Run with gunicorn for production
exec gunicorn app.main:app \
    --workers 2 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:$PORT \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -

