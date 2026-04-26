# FairLens AI - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Prerequisites
```bash
# Check Node.js version (needs 16+)
node --version

# Check npm
npm --version
```

### Step 2: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend (in new terminal)
cd client
npm install
```

### Step 3: Set Up Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://fairlens:fairlens123@cluster.mongodb.net/fairlens
JWT_SECRET=fairlens_super_secret_jwt_key_2024
GEMINI_API_KEY=your_key_from_aistudio_google_com
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=FairLens AI
```

### Step 4: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### Step 5: Test the App

1. Open http://localhost:5173
2. Click "Sign Up" and create an account
3. Go to "Analyze" page
4. Click on "Hiring Dataset" sample button
5. Watch the bias detection in action!

## 🔑 Getting Your API Keys

### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Create database user
4. Copy connection string
5. Paste to `MONGODB_URI` in .env

### Google Gemini API
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste to `GEMINI_API_KEY` in .env

## 📝 First Run

### Test with Sample Data
- **Hiring**: Pre-loaded with 50 hiring records showing gender bias
- **Loan**: Pre-loaded with 50 loan records showing zip-code bias
- **Medical**: Pre-loaded with 50 medical records showing treatment bias

### Expected Output
- Fairness score: 20-45/100 (shows significant bias)
- Severity: "High" or "Critical"
- Recommendations: 5-7 actionable debiasing steps
- Charts: Visual breakdown of bias by attribute

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check MONGODB_URI in .env
- Verify whitelist IP in MongoDB Atlas
- Ensure MongoDB connection is active

### "Gemini API error"
- Check GEMINI_API_KEY is correct
- Verify API key is active in Google Cloud
- Check remaining quota at aistudio.google.com

### "Port already in use"
- Change PORT in server/.env to different port (e.g., 5001)
- Or kill existing process: `lsof -ti:5000 | xargs kill -9`

### Vite not rebuilding
- Check all imports are correct
- Clear .vite cache: `rm -rf client/.vite`
- Restart dev server

## 📦 Build for Production

### Frontend
```bash
cd client
npm run build
# Creates optimized dist/ folder
```

### Backend
```bash
# No build needed for Node.js
# Just ensure all dependencies installed:
npm install --production
```

## 🚀 Deploy

### Vercel (Frontend)
```bash
npm install -g vercel
cd client
vercel
# Follow prompts
```

### Render (Backend)
1. Push to GitHub
2. Create new web service on render.com
3. Connect your repo
4. Set environment variables
5. Deploy

## 📚 API Examples

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Analyze Dataset
```bash
curl -X POST http://localhost:5000/api/v1/analysis/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "domain":"hiring",
    "datasetName":"Test",
    "dataset":[{"gender":"F","hired":"No"},{"gender":"M","hired":"Yes"}]
  }'
```

## 📖 Documentation

See main README.md for:
- Full feature list
- API endpoint documentation
- Architecture explanation
- Contribution guidelines

## ✅ Verification Checklist

- [ ] Node.js 16+ installed
- [ ] MongoDB Atlas account created
- [ ] Gemini API key obtained
- [ ] Backend running on :5000
- [ ] Frontend running on :5173
- [ ] Can access http://localhost:5173
- [ ] Can sign up and create account
- [ ] Can load sample dataset
- [ ] Bias analysis completes
- [ ] Dashboard shows results

## 🎉 You're Ready!

Your FairLens AI platform is now live locally. Start analyzing data for bias!

For help:
1. Check README.md
2. Review API documentation
3. Check console for error messages
4. Verify .env files are correct
