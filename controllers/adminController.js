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
        const pendingComplaints = await Complaint.countDocuments({ status: { $ne: 'Resolved' } });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
        
        // Calculate Avg Resolution Time
        const resolvedDocs = await Complaint.find({ status: 'Resolved', startedAt: { $exists: true }, resolvedAt: { $exists: true } });
        let avgResolutionTime = 0;
        if (resolvedDocs.length > 0) {
            const totalTime = resolvedDocs.reduce((acc, curr) => acc + (curr.resolvedAt - curr.startedAt), 0);
            avgResolutionTime = (totalTime / resolvedDocs.length) / (1000 * 60 * 60); // Convert to hours
        }

        res.json({ 
            totalUsers, 
            totalAnomalies, 
            totalComplaints, 
            pendingComplaints, 
            resolvedComplaints,
            avgResolutionTime: avgResolutionTime.toFixed(1)
        });
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
        const complaints = await Complaint.find().populate('userId', 'name area').populate('technicianId', 'name phone').sort({ date: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addTechnician = async (req, res) => {
    try {
        const { name, phone, area, email } = req.body;
        const bcrypt = require('bcryptjs');
        const password = 'tech123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create User account for Technician to log in
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'technician',
            address: 'Service HQ',
            area
        });
        await user.save();

        // 2. Create Technician profile
        const tech = new Technician({ 
            userId: user._id,
            name, 
            phone, 
            area 
        });
        await tech.save();

        // After adding, check if there are pending complaints in this area to auto-assign
        const pendingComplaint = await Complaint.findOne({ status: 'Pending' }).populate('userId');
        
        if (pendingComplaint && pendingComplaint.userId && pendingComplaint.userId.area === area) {
            pendingComplaint.status = 'Assigned';
            pendingComplaint.technicianId = tech._id;
            await pendingComplaint.save();
        }

        res.status(201).json({ message: 'Technician added with system access. Default pass: tech123', tech });
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

exports.getTechnicians = async (req, res) => {
    try {
        const technicians = await Technician.find();
        res.json(technicians);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.assignComplaint = async (req, res) => {
    try {
        const { complaintId, technicianId } = req.body;
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

        const tech = await Technician.findById(technicianId);
        if (!tech) return res.status(404).json({ error: 'Technician not found' });

        complaint.status = 'Assigned';
        complaint.technicianId = tech._id;
        await complaint.save();

        res.json({ message: 'Technician assigned successfully', complaint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
