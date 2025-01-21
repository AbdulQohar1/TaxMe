const mongoose =  require('mongoose');

// create receipt schema
const ReceiptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide receipt title'],
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receipt_date: {
    type: Date,
    default: Date.now
  }
},
 { timestamps: true }
);

module.exports = mongoose.model('Receipt' , ReceiptSchema);