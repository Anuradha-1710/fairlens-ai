# Example environment files for FairLens AI

## server/.env.example

```
# Server port
PORT=5000

# MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_URI=mongodb+srv://fairlens:fairlens123@cluster.mongodb.net/fairlens?retryWrites=true&w=majority

# JWT secret for token signing - change this in production!
JWT_SECRET=fairlens_super_secret_jwt_key_2024_change_in_production

# Google Gemini API Key
# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL for CORS
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

## client/.env.example

```
# Backend API URL
VITE_API_URL=http://localhost:5000/api/v1

# App name (optional)
VITE_APP_NAME=FairLens AI
```

## Deployment Configuration

### For Render (Backend Deployment)

Set these environment variables in Render:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=generate_a_strong_random_string_here
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

### For Vercel (Frontend Deployment)

Set these environment variables in Vercel:

```
VITE_API_URL=https://your-backend-domain.com/api/v1
VITE_APP_NAME=FairLens AI
```

### For MongoDB Atlas

1. Create a cluster
2. Create a database user
3. Connection string format:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
   ```
4. Whitelist your IP addresses

### For Google Gemini API

1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy and paste to GEMINI_API_KEY

## Security Notes

⚠️ **IMPORTANT:**

- Never commit .env files to Git
- Always use strong JWT secrets in production
- Regenerate secrets when deploying
- Use MongoDB Atlas IP whitelist
- Enable 2FA on all cloud accounts
- Rotate API keys regularly
- Monitor usage quotas
- Use environment-specific configurations

## Local Development Setup

```bash
# Copy example files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit .env files with your credentials
# Then start development servers
npm run dev
```

## Production Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB production cluster
- [ ] Add all IPs to MongoDB whitelist
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Configure backups
- [ ] Set up monitoring/alerts
- [ ] Use environment-specific configs
