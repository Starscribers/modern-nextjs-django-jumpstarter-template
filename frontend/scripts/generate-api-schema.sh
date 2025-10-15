#!/bin/bash

# example_project API Schema Generator
# This script fetches the latest API schema from the backend and updates the frontend types

set -e

echo "🚀 Regenerating example_project API Schema..."

# Check if backend server is running
if ! curl -s http://localhost:8000/health/ > /dev/null; then
    echo "❌ Backend server is not running on localhost:8000"
    echo "Please start the backend server first:"
    echo "  cd backend && python manage.py runserver 8000"
    exit 1
fi

echo "✅ Backend server is running"

# Fetch the API schema
echo "📥 Fetching API schema..."
curl -H "Accept: application/json" \
     -s \
     http://localhost:8000/swagger.json > api-schema.json

if [ $? -eq 0 ]; then
    echo "✅ API schema saved to api-schema.json"
else
    echo "❌ Failed to fetch API schema"
    exit 1
fi

# Check if the schema is valid JSON
if ! cat api-schema.json | python -m json.tool > /dev/null 2>&1; then
    echo "❌ Invalid JSON in API schema"
    exit 1
fi

echo "✅ API schema is valid JSON"

# Get schema info
TITLE=$(cat api-schema.json | python -c "import sys, json; data=json.load(sys.stdin); print(data['info']['title'])" 2>/dev/null || echo "Unknown")
VERSION=$(cat api-schema.json | python -c "import sys, json; data=json.load(sys.stdin); print(data['info']['version'])" 2>/dev/null || echo "Unknown")

echo "📊 Schema Info:"
echo "   Title: $TITLE"
echo "   Version: $VERSION"

# Count endpoints
ENDPOINT_COUNT=$(cat api-schema.json | python -c "import sys, json; data=json.load(sys.stdin); print(len(data['paths']))" 2>/dev/null || echo "Unknown")
echo "   Endpoints: $ENDPOINT_COUNT"

echo ""
echo "🎉 API schema generation complete!"
echo ""
echo "📁 Files generated:"
echo "   • api-schema.json - OpenAPI specification"
echo "   • src/types/api.ts - TypeScript types"
echo ""
echo "📖 View documentation at:"
echo "   • Swagger UI: http://localhost:8000/swagger/"
echo "   • ReDoc: http://localhost:8000/redoc/"
echo "   • Local docs: ./API_DOCUMENTATION.md"
echo ""
echo "💡 Next steps:"
echo "   1. Review the generated types in src/types/api.ts"
echo "   2. Update your API client to use the new types"
echo "   3. Test your frontend integration"
