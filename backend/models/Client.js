const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  accountNumber: {
    type: String,
    unique: true,
    required: false,
    default: null
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Generate account number before saving (fallback if not set in route)
clientSchema.pre('save', async function(next) {
  if (!this.accountNumber || this.accountNumber === null) {
    try {
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      let accountNumber = `ACC${timestamp}${random}`;
      
      // Ensure uniqueness
      let exists = await mongoose.model('Client').findOne({ accountNumber });
      let attempts = 0;
      while (exists && attempts < 10) {
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        accountNumber = `ACC${timestamp}${random}`;
        exists = await mongoose.model('Client').findOne({ accountNumber });
        attempts++;
      }
      
      this.accountNumber = accountNumber;
    } catch (error) {
      // If error, generate a simple one
      this.accountNumber = `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
  }
  next();
});

module.exports = mongoose.model('Client', clientSchema);

