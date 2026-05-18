const User = require('../models/User');
const MeterReading = require('../models/MeterReading');
const AnomalyAlert = require('../models/AnomalyAlert');
const Technician = require('../models/Technician');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');
const UsageNote = require('../models/UsageNote');
const MeterApplication = require('../models/MeterApplication');


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

        // Calculate Total Revenue
        const payments = await Payment.find();
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({ 
            totalUsers, 
            totalAnomalies, 
            totalComplaints, 
            pendingComplaints, 
            resolvedComplaints,
            totalRevenue: totalRevenue.toFixed(2),
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
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('userId', 'name email area').sort({ paymentDate: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsageNotes = async (req, res) => {
    try {
        const notes = await UsageNote.find().populate('userId', 'name email area').sort({ startDate: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllMeterApplications = async (req, res) => {
    try {
        const applications = await MeterApplication.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMeterApplicationStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const application = await MeterApplication.findById(id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        application.status = status;
        await application.save();
        
        res.json({ message: `Application status updated to ${status} successfully`, application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
