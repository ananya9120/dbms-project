const mongoose = require('mongoose');

const meterReadingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    readingDate: { type: Date, required: true },
    unitsConsumed: { type: Number, required: true },
    season: { type: String, enum: ['Winter', 'Summer', 'Monsoon', 'Spring', 'Autumn'], default: 'Summer' },
    isAnomaly: { type: Boolean, default: false },
    isExpected: { type: Boolean, default: false },
    surgeReason: { type: String },
    billAmount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MeterReading', meterReadingSchema);
