const User = require('../models/User');
const MeterReading = require('../models/MeterReading');
const AnomalyAlert = require('../models/AnomalyAlert');
const Technician = require('../models/Technician');
const Complaint = require('../models/Complaint');

exports.getDashboardData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAnomalies = await AnomalyAlert.countDocuments();
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });

        res.json({ totalUsers, totalAnomalies, totalComplaints, pendingComplaints });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }, '-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAnomalies = async (req, res) => {
    try {
        const anomalies = await AnomalyAlert.find().populate('userId', 'name area email').populate('readingId');
        res.json(anomalies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('userId', 'name area').populate('technicianId', 'name phone');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addTechnician = async (req, res) => {
    try {
        const { name, phone, area } = req.body;
        const tech = new Technician({ name, phone, area });
        await tech.save();
        res.status(201).json({ message: 'Technician added successfully', tech });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllReadings = async (req, res) => {
    try {
        const readings = await MeterReading.find().populate('userId', 'name area');
        res.json(readings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
