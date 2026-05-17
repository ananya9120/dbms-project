const mongoose = require('mongoose');

const meterApplicationSchema = new mongoose.Schema({
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    connectionType: { 
        type: String, 
        enum: ['Residential', 'Commercial', 'Industrial'], 
        default: 'Residential' 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MeterApplication', meterApplicationSchema);
