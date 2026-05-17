const MeterApplication = require('../models/MeterApplication');

exports.submitApplication = async (req, res) => {
    try {
        const { applicantName, email, phone, address, connectionType, notes } = req.body;
        
        if (!applicantName || !email || !phone || !address) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        const application = new MeterApplication({
            applicantName,
            email,
            phone,
            address,
            connectionType,
            notes
        });

        await application.save();

        res.status(201).json({ 
            message: 'Your application has been submitted successfully. Our team will contact you soon.',
            application 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const applications = await MeterApplication.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
