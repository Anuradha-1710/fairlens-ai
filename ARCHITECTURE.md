# Project Structure Overview

```
fairlens-ai/
│
├── 📁 client/                           # React Frontend (Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/               # React Components
│   │   │   ├── Navbar.jsx               # Navigation bar
│   │   │   ├── Hero.jsx                 # Landing page hero
│   │   │   ├── BiasUploader.jsx         # Data upload interface
│   │   │   ├── BiasResultCard.jsx       # Fairness score display
│   │   │   ├── FairnessChart.jsx        # Recharts visualizations
│   │   │   ├── RecommendationPanel.jsx  # Debiasing recommendations
│   │   │   ├── AuditReportModal.jsx     # Report generation modal
│   │   │   ├── DomainSelector.jsx       # Domain selection cards
│   │   │   ├── LoadingSpinner.jsx       # Loading state
│   │   │   ├── Toast.jsx                # Notifications
│   │   │   └── ProtectedRoute.jsx       # Auth guard
│   │   ├── 📁 pages/                    # Page components
│   │   │   ├── Home.jsx                 # Landing page
│   │   │   ├── Login.jsx                # Login page
│   │   │   ├── Register.jsx             # Registration page
│   │   │   ├── Analyze.jsx              # Main analysis page
│   │   │   ├── Dashboard.jsx            # User dashboard
│   │   │   └── Report.jsx               # Report view page
│   │   ├── 📁 context/
│   │   │   └── AuthContext.jsx          # Auth state management
│   │   ├── 📁 utils/
│   │   │   ├── api.js                   # Axios API instance
│   │   │   └── biasHelpers.js           # Utility functions
│   │   ├── 📁 styles/                   # CSS modules
│   │   │   ├── Navbar.css
│   │   │   ├── Auth.css
│   │   │   ├── Home.css
│   │   │   ├── Analyze.css
│   │   │   ├── Dashboard.css
│   │   │   └── Components.css
│   │   ├── App.jsx                      # Root component
│   │   ├── App.css
│   │   ├── main.jsx                     # Entry point
│   │   └── index.css                    # Global styles
│   ├── index.html                       # HTML template
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env                             # Environment variables
│   └── .gitignore
│
├── 📁 server/                           # Express Backend
│   ├── 📁 controllers/                  # Request handlers
│   │   ├── authController.js            # Auth logic
│   │   ├── analysisController.js        # Bias analysis logic
│   │   ├── geminiController.js          # Gemini AI calls
│   │   └── reportController.js          # Report generation
│   ├── 📁 models/                       # Mongoose schemas
│   │   ├── User.js                      # User model
│   │   ├── Analysis.js                  # Analysis results model
│   │   └── Report.js                    # Report model
│   ├── 📁 routes/                       # API routes
│   │   ├── authRoutes.js                # /api/v1/auth
│   │   ├── analysisRoutes.js            # /api/v1/analysis
│   │   ├── geminiRoutes.js              # /api/v1/gemini
│   │   └── reportRoutes.js              # /api/v1/reports
│   ├── 📁 middleware/                   # Express middleware
│   │   ├── authMiddleware.js            # JWT authentication
│   │   ├── errorHandler.js              # Error handling
│   │   └── validateInput.js             # Input validation
│   ├── 📁 config/                       # Configuration
│   │   ├── db.js                        # MongoDB connection
│   │   └── gemini.js                    # Gemini AI setup
│   ├── 📁 utils/                        # Utility functions
│   │   ├── biasCalculator.js            # Bias calculation logic
│   │   └── promptBuilder.js             # Gemini prompt generation
│   ├── server.js                        # Express server entry
│   ├── package.json
│   ├── .env                             # Environment variables
│   └── .gitignore
│
├── 📁 deployment/                       # Cloud deployment configs
│   ├── vercel.json                      # Vercel frontend config
│   └── render.yaml                      # Render backend config
│
├── README.md                            # Main documentation
├── QUICKSTART.md                        # Quick setup guide
├── ENV_GUIDE.md                         # Environment guide
├── ARCHITECTURE.md                      # Architecture overview
├── .gitignore                           # Global gitignore
├── package.json                         # Root package.json
└── LICENSE                              # MIT License

```

## 📊 Key Files Summary

### Frontend Entry Points
- `client/index.html` - HTML template
- `client/src/main.jsx` - React entry point
- `client/src/App.jsx` - Root component

### Backend Entry Points
- `server/server.js` - Express server
- `server/config/db.js` - MongoDB setup
- `server/config/gemini.js` - Gemini AI setup

### Configuration Files
- `client/vite.config.js` - Vite bundler config
- `client/tailwind.config.js` - Tailwind CSS
- `server/package.json` - Dependencies
- `client/package.json` - Dependencies

### Environment Files
- `server/.env` - Backend env vars
- `client/.env` - Frontend env vars

### Documentation
- `README.md` - Full documentation
- `QUICKSTART.md` - 5-minute setup
- `ENV_GUIDE.md` - Environment setup
- `ARCHITECTURE.md` - Technical architecture

## 🔄 Data Flow

```
User Browser
    ↓
Client (React)
    ↓
API (Express)
    ↓
Database (MongoDB)
    ↓
AI Engine (Gemini)
    ↓
Response & Visualization
```

## 📦 Dependencies

### Frontend (React)
- react-router-dom - Routing
- axios - API calls
- recharts - Charting
- react-hot-toast - Notifications
- papaparse - CSV parsing

### Backend (Node.js)
- express - Web framework
- mongoose - MongoDB ODM
- @google/generative-ai - Gemini API
- jsonwebtoken - Auth tokens
- bcryptjs - Password hashing
- jspdf - PDF generation
- multer - File uploads

## 🎯 API Architecture

```
/api/v1/
├── /auth (authentication)
├── /analysis (bias analysis)
├── /gemini (AI features)
├── /reports (audit reports)
└── /samples (sample datasets)
```

## 🔐 Authentication Flow

1. User registers → Password hashed → User created
2. User logs in → Password verified → JWT token issued
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Server validates token → Grant access

## 📈 Analysis Flow

1. User uploads/pastes dataset
2. Backend parses data
3. Sensitive fields detected
4. Bias metrics calculated
5. Gemini API called
6. Results stored in database
7. Frontend displays visualization
8. User can generate reports

## 🚀 Deployment Architecture

```
Vercel (Frontend)
    ↓ (API calls to)
Render (Backend)
    ↓ (Connects to)
MongoDB Atlas (Database)
    ↓ (Calls)
Google Gemini API
```
