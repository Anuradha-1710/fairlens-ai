# FairLens AI - Unbiased Decision Support Platform

An AI-powered platform that detects bias in automated decision-making systems across hiring, loans, and healthcare domains using Google Gemini 1.5 Flash.

## 🎯 Problem Statement

AI/ML systems trained on biased historical data perpetuate discrimination at scale:
- **73%** of HR systems show gender bias in hiring
- **80%** of loan algorithms show racial bias in lending
- **60%** of medical AI systems show socioeconomic bias in treatment

These silent failures destroy lives while remaining invisible.

## ✅ Solution

FairLens AI is a production-ready platform that:

1. **Ingests** decision datasets (CSV, JSON, or samples)
2. **Detects** bias using AI-powered analysis (Google Gemini)
3. **Visualizes** fairness metrics with interactive dashboards
4. **Recommends** actionable debiasing strategies
5. **Generates** downloadable fairness audit reports
6. **Tracks** fairness improvements over time

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React.js (Vite), Tailwind CSS, Recharts, shadcn/ui |
| **Backend** | Node.js, Express.js, MongoDB with Mongoose ODM |
| **AI Engine** | Google Gemini 1.5 Flash API |
| **Database** | MongoDB Atlas (cloud) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 📁 Project Structure

```
fairlens-ai/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page routes
│   │   ├── context/             # Auth context
│   │   ├── utils/               # API & helpers
│   │   ├── styles/              # CSS modules
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/                      # Express Backend
│   ├── controllers/             # Business logic
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth, validation
│   ├── config/                  # DB, Gemini setup
│   ├── utils/                   # Bias calculations
│   ├── server.js
│   └── package.json
└── deployment/                  # Cloud configs
    ├── vercel.json
    └── render.yaml
```

## 🚀 Features

### 1. Smart Data Ingestion
- Upload CSV files or paste JSON data
- Pre-loaded sample datasets for quick testing
- Auto-detection of sensitive attributes (gender, age, race, religion)
- Data validation before analysis

### 2. Gemini AI Bias Detection (CORE)
- Real-time analysis using Google Gemini 1.5 Flash
- Detects discriminatory patterns automatically
- Calculates per-attribute bias scores
- Provides plain English explanations
- Assesses legal/compliance risk

### 3. Visual Fairness Dashboard
- Circular fairness meter (0-100 scale)
- Bar charts showing bias by demographic
- Radar chart for multi-dimensional fairness
- Color-coded severity levels (Green → Yellow → Red)
- Industry benchmark comparisons

### 4. AI Debiasing Recommendations
- 5-7 specific, actionable recommendations per analysis
- Domain-specific guidance (hiring/loan/medical)
- Step-by-step implementation instructions
- Expected fairness improvement metrics

### 5. Audit Reports
- Generate PDF audit reports
- Share reports via secure links
- Track report views and downloads
- Store reports in secure database

### 6. User Dashboard
- JWT-based authentication
- Analysis history with filtering
- User statistics and trends
- Organization-level access control

## 🛠️ Local Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas account)
- Google Gemini API key
- npm or yarn

### Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

npm run dev  # Starts on http://localhost:5000
```

### Frontend Setup

```bash
cd client
npm install

# Create .env file
cp .env.example .env

npm run dev  # Starts on http://localhost:5173
```

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user and password
4. Whitelist your IP
5. Copy connection string to `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fairlens
   ```

### Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to `server/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

## 📊 API Endpoints

### Authentication
```
POST   /api/v1/auth/register     - Create account
POST   /api/v1/auth/login        - Sign in
GET    /api/v1/auth/me           - Get profile
PUT    /api/v1/auth/me           - Update profile
```

### Analysis
```
POST   /api/v1/analysis/analyze  - Run bias detection
GET    /api/v1/analysis/history  - Get user's analyses
GET    /api/v1/analysis/:id      - Get single analysis
DELETE /api/v1/analysis/:id      - Delete analysis
```

### Gemini AI
```
POST   /api/v1/gemini/debias     - Get debiasing guide
POST   /api/v1/gemini/explain    - Explain pattern
POST   /api/v1/gemini/insights   - Generate insights
```

### Reports
```
POST   /api/v1/reports/generate  - Create audit report
GET    /api/v1/reports/          - Get user's reports
GET    /api/v1/reports/:link     - Public report view
DELETE /api/v1/reports/:id       - Delete report
```

### Sample Data
```
GET    /api/v1/samples/hiring    - Hiring dataset
GET    /api/v1/samples/loan      - Loan dataset
GET    /api/v1/samples/medical   - Medical dataset
```

## 🌐 Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy automatically

### Backend → Render

1. Push code to GitHub
2. Create new web service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables
6. Deploy

### Database → MongoDB Atlas

- Already set up, just ensure connection string is correct
- Automatic backups included with Atlas

## 📈 Usage Flow

1. **Register/Login** → Create account or sign in
2. **Choose Domain** → Hiring, Loan, or Medical
3. **Upload Data** → CSV, JSON, or sample dataset
4. **View Results** → Fairness score, bias breakdown, visual charts
5. **Read Recommendations** → AI-generated debiasing strategies
6. **Generate Report** → Download PDF or share publicly
7. **Track Progress** → Monitor improvements in dashboard

## 🎨 Color Scheme

| State | Color | Usage |
|-------|-------|-------|
| Primary | `#6366F1` (Indigo) | Primary actions, links |
| Success | `#10B981` (Green) | Fair/low bias (80-100) |
| Warning | `#F59E0B` (Amber) | Caution (60-80) |
| Danger | `#EF4444` (Red) | High bias (0-40) |
| Dark | `#0F172A` | Background |
| Card | `#1E293B` | Component backgrounds |

## 📋 Sample Datasets Included

### Hiring Dataset
- 50 records with candidate info
- Bias: Women hired 40% less despite equal qualifications
- Fields: gender, age, race, education, interview_score, hired

### Loan Dataset
- 50 records with applicant info
- Bias: Certain zip codes denied more (proxy for race)
- Fields: age, gender, zip_code, income, credit_score, approved

### Medical Dataset
- 50 records with patient info
- Bias: Low-income patients receive less aggressive treatment
- Fields: age, gender, insurance_type, condition, treatment, outcome

## 🔐 Security Features

- JWT authentication with 30-day expiration
- Password hashing with bcryptjs
- Environment variable protection
- MongoDB Atlas encryption at rest
- CORS protection
- Input validation on all endpoints
- Rate limiting (ready to implement)

## 📊 Bias Detection Algorithm

1. **Column Analysis**: Detect sensitive attributes
2. **Group Statistics**: Calculate approval rates per demographic group
3. **Disparity Calculation**: Compute disparity ratios
4. **Severity Assessment**: Map to Low/Medium/High/Critical
5. **Gemini Enhancement**: Get detailed AI-powered analysis
6. **Recommendations**: Generate domain-specific fixes

## 🎯 Fairness Metrics

- **Demographic Parity**: Equal approval rates across groups
- **Equal Opportunity**: Equal true positive rates
- **Disparate Impact**: Less than 80% rule violation check
- **Calibration**: Prediction accuracy consistency

## 🚀 Performance

- Frontend: Vite bundled (~300KB gzipped)
- Backend: Serverless-ready
- Database: Indexed queries for sub-second response
- Gemini API: 60 requests/min quota included

## 📞 Support

For issues or questions:
1. Check documentation in README
2. Review API endpoint details above
3. Check Gemini API status (aistudio.google.com)
4. Verify MongoDB connection

## 📄 License

MIT License - Feel free to use for personal and commercial projects

## 🙏 Contributing

Contributions welcome! Areas for enhancement:
- Additional fairness metrics (Theil index, etc.)
- Multi-model analysis
- Real-time monitoring dashboards
- Advanced data visualization
- Mobile app version

---

**FairLens AI** - *See the Bias. Fix the Future.*

Built with ❤️ to create fairer AI systems
