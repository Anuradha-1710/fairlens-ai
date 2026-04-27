// FairLens AI v4 - CORS Fix
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { initGemini } = require('./config/gemini');

// Import routes
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const geminiRoutes = require('./routes/geminiRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Initialize Gemini
initGemini();

// ✅ CORS — All Vercel URLs allowed
app.use(cors({
  origin: function(origin, callback) {
    // Allow all origins in production for hackathon
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight
app.options('*', cors());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/analysis', analysisRoutes);
app.use('/api/v1/gemini', geminiRoutes);
app.use('/api/v1/reports', reportRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'FairLens AI backend is running' });
});

// Sample data endpoints
app.get('/api/v1/samples/hiring', (req, res) => {
  const data = [
    { name: 'Alice Johnson', gender: 'F', age: 28, race: 'Asian', years_exp: 5, education: 'BS', interview_score: 92, hired: 'No' },
    { name: 'Bob Smith', gender: 'M', age: 28, race: 'White', years_exp: 5, education: 'BS', interview_score: 88, hired: 'Yes' },
    { name: 'Carol Davis', gender: 'F', age: 32, race: 'Black', years_exp: 8, education: 'MS', interview_score: 95, hired: 'No' },
    { name: 'David Wilson', gender: 'M', age: 32, race: 'White', years_exp: 8, education: 'MS', interview_score: 90, hired: 'Yes' },
    { name: 'Emma Brown', gender: 'F', age: 26, race: 'Hispanic', years_exp: 3, education: 'BS', interview_score: 85, hired: 'No' },
    { name: 'Frank Miller', gender: 'M', age: 26, race: 'White', years_exp: 3, education: 'BS', interview_score: 82, hired: 'Yes' },
    { name: 'Grace Lee', gender: 'F', age: 35, race: 'Asian', years_exp: 10, education: 'PhD', interview_score: 98, hired: 'No' },
    { name: 'Henry Taylor', gender: 'M', age: 35, race: 'White', years_exp: 10, education: 'PhD', interview_score: 94, hired: 'Yes' },
    { name: 'Iris Martinez', gender: 'F', age: 30, race: 'Hispanic', years_exp: 6, education: 'MS', interview_score: 89, hired: 'No' },
    { name: 'Jack Anderson', gender: 'M', age: 30, race: 'Black', years_exp: 6, education: 'MS', interview_score: 86, hired: 'Yes' },
    { name: 'Karen Thomas', gender: 'F', age: 29, race: 'White', years_exp: 5, education: 'BS', interview_score: 88, hired: 'No' },
    { name: 'Leo Jackson', gender: 'M', age: 29, race: 'Black', years_exp: 5, education: 'BS', interview_score: 91, hired: 'Yes' },
    { name: 'Maya Patel', gender: 'F', age: 27, race: 'Asian', years_exp: 4, education: 'BS', interview_score: 93, hired: 'No' },
    { name: 'Noah White', gender: 'M', age: 27, race: 'White', years_exp: 4, education: 'BS', interview_score: 87, hired: 'Yes' },
    { name: 'Olivia Harris', gender: 'F', age: 33, race: 'Black', years_exp: 9, education: 'MS', interview_score: 96, hired: 'No' },
    { name: 'Peter Clark', gender: 'M', age: 33, race: 'White', years_exp: 9, education: 'MS', interview_score: 92, hired: 'Yes' },
    { name: 'Quinn Rodriguez', gender: 'F', age: 25, race: 'Hispanic', years_exp: 2, education: 'BS', interview_score: 84, hired: 'No' },
    { name: 'Ryan Lewis', gender: 'M', age: 25, race: 'White', years_exp: 2, education: 'BS', interview_score: 83, hired: 'Yes' },
    { name: 'Sophia Kim', gender: 'F', age: 31, race: 'Asian', years_exp: 7, education: 'MS', interview_score: 94, hired: 'No' },
    { name: 'Thomas Walker', gender: 'M', age: 31, race: 'White', years_exp: 7, education: 'MS', interview_score: 89, hired: 'Yes' }
  ];
  res.json({ data, description: 'Biased hiring dataset - Women hired less despite equal/better qualifications' });
});

app.get('/api/v1/samples/loan', (req, res) => {
  const data = [
    { applicant_id: 1, age: 35, gender: 'M', zip_code: '10001', income: 75000, credit_score: 750, approved: 'Yes' },
    { applicant_id: 2, age: 35, gender: 'F', zip_code: '10002', income: 75000, credit_score: 750, approved: 'No' },
    { applicant_id: 3, age: 28, gender: 'M', zip_code: '10001', income: 55000, credit_score: 700, approved: 'Yes' },
    { applicant_id: 4, age: 28, gender: 'F', zip_code: '10005', income: 55000, credit_score: 700, approved: 'No' },
    { applicant_id: 5, age: 42, gender: 'M', zip_code: '10001', income: 95000, credit_score: 800, approved: 'Yes' },
    { applicant_id: 6, age: 42, gender: 'F', zip_code: '10003', income: 95000, credit_score: 800, approved: 'No' },
    { applicant_id: 7, age: 30, gender: 'M', zip_code: '10001', income: 65000, credit_score: 720, approved: 'Yes' },
    { applicant_id: 8, age: 30, gender: 'F', zip_code: '10007', income: 65000, credit_score: 720, approved: 'No' },
    { applicant_id: 9, age: 50, gender: 'M', zip_code: '10001', income: 120000, credit_score: 850, approved: 'Yes' },
    { applicant_id: 10, age: 50, gender: 'F', zip_code: '10009', income: 120000, credit_score: 850, approved: 'No' },
    { applicant_id: 11, age: 26, gender: 'M', zip_code: '10001', income: 45000, credit_score: 680, approved: 'Yes' },
    { applicant_id: 12, age: 26, gender: 'F', zip_code: '10006', income: 45000, credit_score: 680, approved: 'No' },
    { applicant_id: 13, age: 38, gender: 'M', zip_code: '10001', income: 85000, credit_score: 770, approved: 'Yes' },
    { applicant_id: 14, age: 38, gender: 'F', zip_code: '10008', income: 85000, credit_score: 770, approved: 'No' },
    { applicant_id: 15, age: 45, gender: 'M', zip_code: '10001', income: 110000, credit_score: 820, approved: 'Yes' },
    { applicant_id: 16, age: 45, gender: 'F', zip_code: '10004', income: 110000, credit_score: 820, approved: 'No' },
    { applicant_id: 17, age: 32, gender: 'M', zip_code: '10001', income: 70000, credit_score: 740, approved: 'Yes' },
    { applicant_id: 18, age: 32, gender: 'F', zip_code: '10010', income: 70000, credit_score: 740, approved: 'No' },
    { applicant_id: 19, age: 55, gender: 'M', zip_code: '10001', income: 130000, credit_score: 880, approved: 'Yes' },
    { applicant_id: 20, age: 55, gender: 'F', zip_code: '10011', income: 130000, credit_score: 880, approved: 'No' }
  ];
  res.json({ data, description: 'Biased loan dataset - Certain zip codes denied more loans' });
});

app.get('/api/v1/samples/medical', (req, res) => {
  const data = [
    { patient_id: 1, age: 45, gender: 'M', insurance: 'Premium', condition: 'Heart Disease', treatment: 'Aggressive', outcome: 'Good' },
    { patient_id: 2, age: 45, gender: 'F', insurance: 'Basic', condition: 'Heart Disease', treatment: 'Conservative', outcome: 'Poor' },
    { patient_id: 3, age: 60, gender: 'M', insurance: 'Premium', condition: 'Cancer', treatment: 'Chemo+Surgery', outcome: 'Good' },
    { patient_id: 4, age: 60, gender: 'F', insurance: 'Basic', condition: 'Cancer', treatment: 'Observation', outcome: 'Poor' },
    { patient_id: 5, age: 35, gender: 'M', insurance: 'Premium', condition: 'Diabetes', treatment: 'Multiple meds', outcome: 'Stable' },
    { patient_id: 6, age: 35, gender: 'F', insurance: 'Basic', condition: 'Diabetes', treatment: 'Diet only', outcome: 'Unstable' },
    { patient_id: 7, age: 50, gender: 'M', insurance: 'Premium', condition: 'Stroke Risk', treatment: 'Preventive', outcome: 'Good' },
    { patient_id: 8, age: 50, gender: 'F', insurance: 'Basic', condition: 'Stroke Risk', treatment: 'Monitoring', outcome: 'Poor' },
    { patient_id: 9, age: 55, gender: 'M', insurance: 'Premium', condition: 'Kidney Disease', treatment: 'Dialysis', outcome: 'Stable' },
    { patient_id: 10, age: 55, gender: 'F', insurance: 'Basic', condition: 'Kidney Disease', treatment: 'Medication', outcome: 'Declining' },
    { patient_id: 11, age: 40, gender: 'M', insurance: 'Premium', condition: 'Arthritis', treatment: 'Surgery', outcome: 'Good' },
    { patient_id: 12, age: 40, gender: 'F', insurance: 'Basic', condition: 'Arthritis', treatment: 'Therapy', outcome: 'Fair' },
    { patient_id: 13, age: 65, gender: 'M', insurance: 'Premium', condition: 'Alzheimer', treatment: 'Clinical Trial', outcome: 'Stable' },
    { patient_id: 14, age: 65, gender: 'F', insurance: 'Basic', condition: 'Alzheimer', treatment: 'Standard Care', outcome: 'Declining' },
    { patient_id: 15, age: 48, gender: 'M', insurance: 'Premium', condition: 'Lung Disease', treatment: 'Transplant', outcome: 'Good' },
    { patient_id: 16, age: 48, gender: 'F', insurance: 'Basic', condition: 'Lung Disease', treatment: 'Inhalers', outcome: 'Poor' },
    { patient_id: 17, age: 52, gender: 'M', insurance: 'Premium', condition: 'Liver Disease', treatment: 'Aggressive', outcome: 'Stable' },
    { patient_id: 18, age: 52, gender: 'F', insurance: 'Basic', condition: 'Liver Disease', treatment: 'Conservative', outcome: 'Poor' },
    { patient_id: 19, age: 38, gender: 'M', insurance: 'Premium', condition: 'Depression', treatment: 'Therapy+Meds', outcome: 'Good' },
    { patient_id: 20, age: 38, gender: 'F', insurance: 'Basic', condition: 'Depression', treatment: 'Basic meds', outcome: 'Poor' }
  ];
  res.json({ data, description: 'Biased medical treatment dataset' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FairLens AI Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;