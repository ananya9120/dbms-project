const Complaint = require('../models/Complaint');
const Technician = require('../models/Technician');

exports.getTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const tech = await Technician.findOne({ userId });
        if (!tech) return res.status(404).json({ error: 'Technician profile not found' });

        const tasks = await Complaint.find({ technicianId: tech._id })
            .populate('userId', 'name address phone area')
            .sort({ createdAt: -1 });
        
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { complaintId, status, notes } = req.body;
        const updateData = { status };

        if (status === 'In Progress') {
            updateData.startedAt = new Date();
        } else if (status === 'Resolved') {
            updateData.resolvedAt = new Date();
            updateData.resolutionNotes = notes;
            
            // Mark technician as available again
            const complaint = await Complaint.findById(complaintId);
            await Technician.findByIdAndUpdate(complaint.technicianId, { available: true });
        }

        const task = await Complaint.findByIdAndUpdate(complaintId, updateData, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
