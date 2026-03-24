require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
 const { initializeDatabase, testConnection } = require('./config/database');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Middleware
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/services', require('./routes/services'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/content', require('./routes/content'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai-agent', require('./routes/aiagent'));

// SEO Meta endpoint
app.get('/api/meta', (req, res) => {
  res.json({
    siteName: process.env.SITE_NAME || 'Explore Holidays',
    siteDescription: process.env.SITE_DESCRIPTION || 'Premium Travel Booking Platform',
    siteKeywords: process.env.SITE_KEYWORDS || 'travel,holidays,flights',
    siteUrl: process.env.APP_URL || 'http://localhost:3000'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3001;

 async function startServer() {
   await testConnection();
   await initializeDatabase();

   app.listen(PORT, () => {
     console.log(`🚀 Explore Holidays Server running on port ${PORT}`);
     console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
     console.log(`🌐 URL: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
   });
 }

 startServer().catch((error) => {
   console.error('❌ Failed to start server:', error.message);
   process.exit(1);
 });
