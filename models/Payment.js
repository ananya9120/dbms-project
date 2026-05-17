const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Success', 'Pending', 'Failed'], default: 'Success' },
    readingsPaid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MeterReading' }]
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
