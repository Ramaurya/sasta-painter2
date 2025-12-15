const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    city: {
        type: String,
        enum: ['Delhi', 'Noida'],
        required: true
    },
    service_type: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Contacted', 'Completed']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    editHistory: [{
        timestamp: { type: Date, default: Date.now },
        changes: { type: Object }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
