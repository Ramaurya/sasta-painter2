const Service = require('../models/Service');
const Inquiry = require('../models/Inquiry');

exports.getHome = async (req, res) => {
    try {
        // Just return services logic, frontend handles redirection if admin
        const services = await Service.find({}).limit(6);
        res.json({ success: true, services });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.json({ success: true, services });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error fetching services' });
    }
};

exports.postBooking = async (req, res) => {
    try {
        const { name, phone, email, city, service_type, message } = req.body;

        // Basic Validation
        if (!['Delhi', 'Noida'].includes(city)) {
            return res.status(400).json({ success: false, error: 'Service available only in Delhi and Noida.' });
        }

        const newInquiry = new Inquiry({
            name,
            phone,
            email,
            city,
            service_type,
            message,
            user: req.session.user ? req.session.user._id : null
        });

        await newInquiry.save();
        res.json({ success: true, message: 'Booking submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json({ success: true, inquiries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Inquiry.findByIdAndUpdate(id, { status });
        res.json({ success: true, message: 'Inquiry status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// User Dashboard Methods
exports.getMyBookings = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ user: req.session.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, inquiries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getEditBooking = async (req, res) => {
    try {
        const inquiry = await Inquiry.findOne({ _id: req.params.id, user: req.session.user._id });
        if (!inquiry) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }
        if (inquiry.status === 'Completed' || inquiry.status === 'Contacted') {
            return res.status(400).json({ success: false, error: 'Cannot edit bookings that are Completed or Contacted.' });
        }
        res.json({ success: true, inquiry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { city, service_type, message } = req.body;

        const inquiry = await Inquiry.findOne({ _id: id, user: req.session.user._id });
        if (!inquiry) return res.status(404).json({ success: false, error: 'Booking not found' });
        if (inquiry.status === 'Completed' || inquiry.status === 'Contacted') return res.status(400).json({ success: false, error: 'Cannot edit processing booking' });

        const changes = {};
        if (inquiry.city !== city) changes.city = inquiry.city;
        if (inquiry.service_type !== service_type) changes.service_type = inquiry.service_type;
        if (inquiry.message !== message) changes.message = inquiry.message;

        if (Object.keys(changes).length > 0) {
            inquiry.editHistory.push({
                timestamp: new Date(),
                changes: changes
            });
        }

        inquiry.city = city;
        inquiry.service_type = service_type;
        inquiry.message = message;
        await inquiry.save();

        res.json({ success: true, message: 'Booking updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await Inquiry.findOneAndDelete({ _id: id, user: req.session.user._id });
        res.json({ success: true, message: 'Booking deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
