const mongoose = require('mongoose');

const anomalyAlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    readingId: { type: mongoose.Schema.Types.ObjectId, ref: 'MeterReading', required: true },
    alertDate: { type: Date, default: Date.now },
    details: { type: String, required: true },
    handled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('AnomalyAlert', anomalyAlertSchema);
