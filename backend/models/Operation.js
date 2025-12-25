const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false // Allow null for admin deposits
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer', 'payment'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: 0.01
  },
  description: {
    type: String,
    trim: true
  },
  recipientAccountNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  balanceAfter: {
    type: Number
  }
}, {
  timestamps: true
});

// Update client balance after operation
operationSchema.post('save', async function() {
  // Skip balance update for admin deposits (no clientId)
  if (!this.clientId) {
    return;
  }
  
  const Client = mongoose.model('Client');
  const client = await Client.findById(this.clientId);
  
  if (client && this.status === 'completed') {
    if (this.type === 'deposit') {
      client.balance += this.amount;
    } else if (this.type === 'withdrawal' || this.type === 'payment' || this.type === 'transfer') {
      client.balance -= this.amount;
    }
    await client.save();
  }
});

module.exports = mongoose.model('Operation', operationSchema);

