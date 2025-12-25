const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Autoriser toutes les origines pour ngrok
  credentials: true
}));
app.use(express.json());

// Root route - redirect to /api/auth
app.get('/', (req, res) => {
  res.redirect('/api/auth');
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/operations', require('./routes/operations'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bank-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB Connected');
  // Create demo account if it doesn't exist
  await createDemoAccount();
})
.catch(err => console.error('MongoDB connection error:', err));

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

