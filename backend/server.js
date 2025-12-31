const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware CORS - Configuration pour production et développement
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://ubs-nu.vercel.app',
  /\.vercel\.app$/, // Tous les domaines Vercel
  /\.loca\.lt$/, // Tous les domaines localtunnel
  /\.ngrok\.io$/ // Tous les domaines ngrok
];

app.use(cors({
  origin: function (origin, callback) {
    // Permettre les requêtes sans origin (comme les apps mobiles ou curl)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origin est autorisée
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // En production, on autorise quand même pour le moment
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'bypass-tunnel-reminder'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400 // 24 heures
}));

// Options preflight pour toutes les routes
app.options('*', cors());

app.use(express.json());

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({
      success: false,
      message: 'Database connection failed. Please try again later.'
    });
  }
});

// Root route - redirect to /api/auth
app.get('/', (req, res) => {
  res.redirect('/api/auth');
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: isConnected ? 'Connected' : 'Disconnected'
  });
});

// Initialize database and demo account
app.get('/api/init', async (req, res) => {
  try {
    await connectDB();
    await createDemoAccount();
    res.json({
      success: true,
      message: 'Database initialized successfully',
      demoAccount: {
        email: 'demo@bank.com',
        password: 'demo123'
      }
    });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Initialization failed: ' + error.message
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/operations', require('./routes/operations'));

// Connect to MongoDB
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bank-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
    });
    isConnected = true;
    console.log('MongoDB Connected');
    
    // Create demo account if it doesn't exist
    await createDemoAccount();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Initialize connection
connectDB().catch(err => console.error('Initial DB connection failed:', err));

// Create demo account
async function createDemoAccount() {
  try {
    const User = require('./models/User');
    const demoEmail = 'demo@bank.com';
    const demoPassword = 'demo123';
    
    const existingUser = await User.findOne({ email: demoEmail });
    if (!existingUser) {
      const demoUser = await User.create({
        email: demoEmail,
        password: demoPassword,
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin'
      });
      console.log('✅ Compte démo créé avec succès!');
      console.log('📧 Email: demo@bank.com');
      console.log('🔑 Mot de passe: demo123');
    } else {
      console.log('ℹ️  Compte démo existe déjà');
      console.log('📧 Email: demo@bank.com');
      console.log('🔑 Mot de passe: demo123');
    }
  } catch (error) {
    console.error('Erreur lors de la création du compte démo:', error.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

