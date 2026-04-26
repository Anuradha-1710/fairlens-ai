#!/bin/bash
# FairLens AI - Installation & Dependency Check

echo "=================================="
echo "FairLens AI - Verification Script"
echo "=================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js version..."
node --version

# Check npm
echo "✓ Checking npm version..."
npm --version

echo ""
echo "=================================="
echo "Backend Dependencies"
echo "=================================="
cd server

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✓ Backend dependencies installed"
    echo ""
    echo "Backend packages:"
    npm list --depth=0 | grep -E "(express|mongoose|@google|jsonwebtoken|bcryptjs)"
else
    echo "⚠ Backend dependencies not installed"
    echo "  Run: cd server && npm install"
fi

cd ..

echo ""
echo "=================================="
echo "Frontend Dependencies"
echo "=================================="
cd client

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✓ Frontend dependencies installed"
    echo ""
    echo "Frontend packages:"
    npm list --depth=0 | grep -E "(react|vite|axios|recharts)"
else
    echo "⚠ Frontend dependencies not installed"
    echo "  Run: cd client && npm install"
fi

cd ..

echo ""
echo "=================================="
echo "Environment Configuration"
echo "=================================="

# Check server .env
if [ -f "server/.env" ]; then
    echo "✓ Server .env file exists"
    if grep -q "MONGODB_URI" server/.env; then
        echo "  ✓ MONGODB_URI configured"
    else
        echo "  ⚠ MONGODB_URI missing"
    fi
    if grep -q "GEMINI_API_KEY" server/.env; then
        echo "  ✓ GEMINI_API_KEY configured"
    else
        echo "  ⚠ GEMINI_API_KEY missing"
    fi
else
    echo "⚠ Server .env file not found"
    echo "  Create: server/.env (see ENV_GUIDE.md)"
fi

# Check client .env
if [ -f "client/.env" ]; then
    echo "✓ Client .env file exists"
    if grep -q "VITE_API_URL" client/.env; then
        echo "  ✓ VITE_API_URL configured"
    else
        echo "  ⚠ VITE_API_URL missing"
    fi
else
    echo "⚠ Client .env file not found"
    echo "  Create: client/.env (see ENV_GUIDE.md)"
fi

echo ""
echo "=================================="
echo "Project Files Verification"
echo "=================================="

# Count files
BACKEND_FILES=$(find server -name "*.js" | wc -l)
FRONTEND_FILES=$(find client/src -name "*.jsx" -o -name "*.js" | wc -l)
CSS_FILES=$(find client/src/styles -name "*.css" | wc -l)

echo "Backend JS files: $BACKEND_FILES"
echo "Frontend JSX/JS files: $FRONTEND_FILES"
echo "CSS files: $CSS_FILES"

echo ""
echo "Key files check:"

# Backend files
[ -f "server/server.js" ] && echo "✓ server/server.js" || echo "✗ server/server.js"
[ -f "server/config/db.js" ] && echo "✓ server/config/db.js" || echo "✗ server/config/db.js"
[ -f "server/config/gemini.js" ] && echo "✓ server/config/gemini.js" || echo "✗ server/config/gemini.js"
[ -f "server/controllers/authController.js" ] && echo "✓ server/controllers/authController.js" || echo "✗ server/controllers/authController.js"
[ -f "server/controllers/analysisController.js" ] && echo "✓ server/controllers/analysisController.js" || echo "✗ server/controllers/analysisController.js"
[ -f "server/controllers/geminiController.js" ] && echo "✓ server/controllers/geminiController.js" || echo "✗ server/controllers/geminiController.js"
[ -f "server/models/User.js" ] && echo "✓ server/models/User.js" || echo "✗ server/models/User.js"
[ -f "server/models/Analysis.js" ] && echo "✓ server/models/Analysis.js" || echo "✗ server/models/Analysis.js"

# Frontend files
[ -f "client/src/App.jsx" ] && echo "✓ client/src/App.jsx" || echo "✗ client/src/App.jsx"
[ -f "client/src/pages/Home.jsx" ] && echo "✓ client/src/pages/Home.jsx" || echo "✗ client/src/pages/Home.jsx"
[ -f "client/src/pages/Analyze.jsx" ] && echo "✓ client/src/pages/Analyze.jsx" || echo "✗ client/src/pages/Analyze.jsx"
[ -f "client/src/components/BiasUploader.jsx" ] && echo "✓ client/src/components/BiasUploader.jsx" || echo "✗ client/src/components/BiasUploader.jsx"
[ -f "client/src/context/AuthContext.jsx" ] && echo "✓ client/src/context/AuthContext.jsx" || echo "✗ client/src/context/AuthContext.jsx"

echo ""
echo "=================================="
echo "Documentation"
echo "=================================="

[ -f "README.md" ] && echo "✓ README.md" || echo "✗ README.md"
[ -f "QUICKSTART.md" ] && echo "✓ QUICKSTART.md" || echo "✗ QUICKSTART.md"
[ -f "ENV_GUIDE.md" ] && echo "✓ ENV_GUIDE.md" || echo "✗ ENV_GUIDE.md"
[ -f "ARCHITECTURE.md" ] && echo "✓ ARCHITECTURE.md" || echo "✗ ARCHITECTURE.md"
[ -f "PROJECT_SUMMARY.md" ] && echo "✓ PROJECT_SUMMARY.md" || echo "✗ PROJECT_SUMMARY.md"

echo ""
echo "=================================="
echo "Deployment Configs"
echo "=================================="

[ -f "deployment/vercel.json" ] && echo "✓ deployment/vercel.json" || echo "✗ deployment/vercel.json"
[ -f "deployment/render.yaml" ] && echo "✓ deployment/render.yaml" || echo "✗ deployment/render.yaml"

echo ""
echo "=================================="
echo "Next Steps"
echo "=================================="
echo ""
echo "1. Install dependencies (if needed):"
echo "   npm run install-all"
echo ""
echo "2. Configure environment variables:"
echo "   - Create MongoDB Atlas cluster"
echo "   - Get Gemini API key from aistudio.google.com"
echo "   - Update server/.env and client/.env"
echo ""
echo "3. Start development servers:"
echo "   npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "=================================="
echo "For detailed setup, see QUICKSTART.md"
echo "=================================="
