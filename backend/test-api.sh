#!/bin/bash

# ======================================
# Flipbook API Test Script
# ======================================
# Run this after starting the server: npm run dev

BASE_URL="http://localhost:5000/api"

echo "🧪 Testing Flipbook API"
echo "========================"
echo ""

# 1. Health Check
echo "1️⃣  Health Check"
curl -s "$BASE_URL/health" | jq .
echo ""

# 2. List Magazines (should be empty initially)
echo "2️⃣  List Magazines"
curl -s "$BASE_URL/magazines" | jq .
echo ""

# 3. Upload PDF (replace with your test PDF path)
echo "3️⃣  Upload PDF"
echo "   Use this command with your PDF file:"
echo ""
echo "   curl -X POST $BASE_URL/magazines/upload \\"
echo "     -F \"pdf=@/path/to/your/file.pdf\""
echo ""

# 4. Get Magazine by ID
echo "4️⃣  Get Magazine by ID"
echo "   curl -s \"$BASE_URL/magazines/MAGAZINE_ID\" | jq ."
echo ""

# 5. Get Magazine by Share ID
echo "5️⃣  Get Magazine by Share ID (for public viewing)"
echo "   curl -s \"$BASE_URL/magazines/share/SHARE_ID\" | jq ."
echo ""

# 6. Update Magazine
echo "6️⃣  Update Magazine"
echo "   curl -X PUT \"$BASE_URL/magazines/MAGAZINE_ID\" \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"name\": \"New Name\", \"config\": {\"flipSpeed\": 800}}'"
echo ""

# 7. Delete Magazine
echo "7️⃣  Delete Magazine"
echo "   curl -X DELETE \"$BASE_URL/magazines/MAGAZINE_ID\""
echo ""

echo "========================"
echo "✅ API endpoints ready!"
