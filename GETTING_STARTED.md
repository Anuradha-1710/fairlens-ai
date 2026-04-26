# 🚀 FairLens AI - Getting Started in 5 Minutes

Welcome to FairLens AI - The Unbiased Decision Support Platform powered by Google Gemini!

---

## ⚡ Quick Start (Choose One Path)

### Path 1: Fastest Setup (Use Pre-configured DB)
**Estimated Time: 2 minutes**

```bash
# 1. Clone the repo (or open this folder in terminal)
cd fairlens-ai

# 2. Install everything
npm run install-all

# 3. Environment files already have sample credentials
# Just verify they exist:
cat server/.env
cat client/.env

# 4. Start both servers
npm run dev

# 5. Open in browser
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

✅ **Now you can test with sample data immediately!**

---

### Path 2: Production Setup (Own MongoDB & Gemini Keys)
**Estimated Time: 10 minutes**

#### Step 1: Get MongoDB Atlas Connection String
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Create database user
5. Whitelist your IP: `0.0.0.0/0` (development only)
6. Click "Connect" → Copy connection string

#### Step 2: Get Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

#### Step 3: Update Environment Files

**server/.env:**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fairlens
JWT_SECRET=your_random_secret_here_min_32_chars
GEMINI_API_KEY=your_gemini_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**client/.env:**
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=FairLens AI
```

#### Step 4: Install & Run
```bash
npm run install-all
npm run dev
```

---

## 🎯 First Time Use - Step by Step

### 1. Sign Up / Sign In
- Open http://localhost:5173
- Click "Sign Up"
- Enter: Name, Email, Password, Company (optional), Role
- Click "Sign Up" button
- You'll be redirected to dashboard

### 2. Analyze Your Data
- Click "Analyze" in navbar
- You have 3 options:

#### Option A: Use Sample Data (Easiest)
- Click blue button "Hiring Dataset"
- Watch it load...
- Scroll down to see results!

#### Option B: Upload CSV
- Prepare CSV with columns like: gender, age, race, hired, income, approved, etc.
- Click "📁 Upload" tab
- Select your CSV file
- Click button to analyze

#### Option C: Paste JSON
- Click "📋 JSON" tab
- Paste array of objects:
```json
[
  {"gender": "F", "age": 28, "hired": "No"},
  {"gender": "M", "age": 28, "hired": "Yes"}
]
```
- Click "Analyze JSON"

### 3. View Results
You'll see:
- 🎯 **Fairness Score**: 0-100 (higher is better)
- 🔴 **Severity Level**: Low/Medium/High/Critical
- 📊 **Charts**: Visual breakdown by demographic
- 💡 **Recommendations**: AI-generated fixes

### 4. Generate Report
- Scroll down to blue "📄 Generate Audit Report" button
- Enter report title
- Click "Generate & Download PDF"
- Report saved to your downloads!

### 5. View History
- Click "Dashboard" in navbar
- See all your past analyses
- Filter by domain, date, severity
- Delete old analyses

---

## 📊 Understanding the Results

### Fairness Score
```
80-100 ✅ Fair        - Good! No major bias detected
60-80  ⚠️  Caution     - Review recommendations
40-60  🚨 Biased      - Significant bias, take action
0-40   🔴 Critical    - Severe bias, legal risk
```

### Severity Levels
- **Low**: Minor disparities, not actionable
- **Medium**: Moderate bias, should be addressed
- **High**: Significant discrimination, urgent review needed
- **Critical**: Severe bias with legal/compliance risk

### Bias Breakdown
Each attribute (gender, age, race, etc.) shows:
- **Bias Score**: 0-100 (higher = more biased)
- **Pattern**: What discriminatory pattern was found
- **Affected Group**: Who is being disadvantaged
- **Explanation**: Plain English explanation

---

## 🔄 Sample Datasets (Pre-loaded)

### 1. Hiring Dataset
- 50 job applicants
- Columns: name, gender, age, race, education, interview_score, hired
- **Bias**: Women hired 40% less despite equal qualifications
- **Expected Score**: 30-40/100 (High bias)

### 2. Loan Dataset
- 50 loan applications
- Columns: applicant_id, age, gender, zip_code, income, credit_score, approved
- **Bias**: Certain zip codes denied more (proxy for race)
- **Expected Score**: 25-35/100 (Critical bias)

### 3. Medical Dataset
- 50 patient records
- Columns: patient_id, age, gender, insurance_type, condition, treatment, outcome
- **Bias**: Low-income patients get less aggressive treatment
- **Expected Score**: 35-45/100 (High bias)

---

## 🐛 Troubleshooting

### "Connection refused" when accessing http://localhost:5173
```bash
# Make sure both servers are running
# Terminal 1: npm run dev:server
# Terminal 2: npm run dev:client
```

### "Cannot connect to MongoDB"
```bash
# Check .env has correct MONGODB_URI
# Verify MongoDB Atlas cluster is running
# Check IP whitelist in Atlas (should be 0.0.0.0/0)
```

### "Gemini API error"
```bash
# Check GEMINI_API_KEY is correct
# Verify key hasn't expired
# Visit https://aistudio.google.com/app/apikey to check status
```

### Port 5000 or 5173 already in use
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### "Cannot GET /api/v1/..."
```bash
# Make sure backend is running (http://localhost:5000 should work)
# Check server/server.js is running
# Verify CORS is configured (CLIENT_URL in .env)
```

---

## 📱 Features Overview

### ✅ Completed Features
- [x] User authentication (sign up/login)
- [x] Data upload (CSV, JSON, samples)
- [x] Bias detection using Gemini AI
- [x] Visual dashboard with charts
- [x] Fairness scoring (0-100)
- [x] Per-attribute bias breakdown
- [x] Debiasing recommendations
- [x] PDF report generation
- [x] Analysis history
- [x] Responsive mobile design

---

## 🎨 What to Click

### On Landing Page (/)
- **Hero Section**: Shows problem statement
- **Feature Cards**: Explains key features
- **Domain Selector**: Choose Hiring/Loan/Medical
- **"Start Analyzing" Button**: Goes to Analyze page
- **Stats Section**: Real bias statistics
- **How It Works**: 4-step process

### On Analyze Page (/analyze)
- **Domain Dropdown**: Change domain
- **Upload Tabs**: CSV/JSON/Samples
- **File Input**: Upload your CSV
- **JSON Text Area**: Paste JSON data
- **Sample Buttons**: Load pre-made datasets
- **Analyze Button**: Run bias detection
- **Results Section**: Shows all findings
- **Generate Report Button**: Create PDF

### On Dashboard (/dashboard)
- **Domain Filter**: Filter by hiring/loan/medical
- **Analysis Table**: All your analyses
- **View Button**: See analysis details
- **Delete Button**: Remove analysis
- **Score & Severity**: Quick stats

### On Profile (Click your name)
- **Profile Info**: Your name, email, organization
- **Update Button**: Save changes
- **Logout Button**: Sign out

---

## 🚀 Deploying to Production

### Vercel (Frontend)
```bash
npm install -g vercel
cd client
vercel
```

### Render (Backend)
1. Push to GitHub
2. Go to render.com
3. Create new web service
4. Connect GitHub repo
5. Set environment variables
6. Deploy!

---

## 📚 Documentation Files

- **README.md** - Complete documentation
- **QUICKSTART.md** - 5-minute setup (you're reading a more detailed version)
- **ENV_GUIDE.md** - Environment setup details
- **ARCHITECTURE.md** - Technical architecture
- **PROJECT_SUMMARY.md** - What was built

---

## 💡 Pro Tips

1. **Test with samples first** - Don't waste API calls learning the UI
2. **Small datasets are fine** - 10-20 rows is enough for testing
3. **Read recommendations carefully** - They're AI-generated and actionable
4. **Download reports** - Build a library of audits for compliance
5. **Ignore initial setup** - Use default .env to get started fast
6. **Check console logs** - Errors show in terminal and browser console

---

## 🔑 Default Test Credentials

If using sample MongoDB:
- **Email**: test@example.com
- **Password**: Any password you create
- **Organization**: Your Company
- **Role**: Choose one (HR/Banking/Medical/Other/Researcher)

---

## 🎯 Your First Analysis in 60 Seconds

1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill form, click "Sign Up"
4. Click "Analyze" in navbar
5. Click "Hiring Dataset" button
6. Wait 5 seconds...
7. **BOOM!** 📊 You're seeing real bias detection!

---

## 🤔 Questions?

### Common Questions

**Q: Do I need to configure MongoDB?**
A: No! Default .env has sample connection. But for production, yes.

**Q: Do I need Gemini API key?**
A: Yes, but fallback data is provided for testing.

**Q: Can I use this with my own data?**
A: Yes! Upload CSV or paste JSON with your data.

**Q: How long does analysis take?**
A: 5-10 seconds typically (depends on dataset size)

**Q: Can I deploy this?**
A: Yes! See deployment configs in `/deployment` folder.

**Q: Is this secure?**
A: Yes! JWT auth, password hashing, CORS protection included.

---

## 📞 Support Resources

- **Stuck on setup?** → Read QUICKSTART.md
- **Need API docs?** → Check README.md
- **Environment issues?** → See ENV_GUIDE.md
- **Architecture questions?** → Read ARCHITECTURE.md
- **Build issues?** → Check server or frontend .gitignore

---

## ✅ Success Checklist

- [ ] npm run dev shows no errors
- [ ] http://localhost:5173 loads
- [ ] Can sign up/login
- [ ] Can load sample dataset
- [ ] See fairness score
- [ ] Can generate report
- [ ] View dashboard with history

If all checked ✅ = **You're ready!**

---

## 🎉 Next Steps

1. **Explore the UI** - Try all features
2. **Upload your data** - Test with real datasets
3. **Generate reports** - Download audit trails
4. **Deploy** - Follow deployment guides
5. **Customize** - Modify colors, text, features

---

**Happy Bias Detecting! 🚀**

See the Bias. Fix the Future. 🎯

---

*For more details, see the comprehensive README.md*
