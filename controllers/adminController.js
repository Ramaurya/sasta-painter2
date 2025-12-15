const User = require('../models/User');
const Inquiry = require('../models/Inquiry');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users
        const totalUsers = await User.countDocuments();

        // 2. Total Bookings (Inquiries)
        const totalBookings = await Inquiry.countDocuments();

        // 3. Today's Bookings
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todaysBookings = await Inquiry.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // 4. Pending Bookings
        const pendingBookings = await Inquiry.countDocuments({ status: 'Pending' });

        // 5. Ongoing Projects (Contacted or In Progress)
        // 'In Progress' wasn't in the enum seen in Inquiry.js but requested by user.
        // We include it in case it's manually added or legacy.
        const ongoingProjects = await Inquiry.countDocuments({
            status: { $in: ['Contacted', 'In Progress'] }
        });

        // 6. Completed Projects
        const completedProjects = await Inquiry.countDocuments({ status: 'Completed' });

        // 7. Cancelled Bookings
        const cancelledBookings = await Inquiry.countDocuments({ status: 'Cancelled' });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalBookings,
                todaysBookings,
                pendingBookings,
                ongoingProjects,
                completedProjects,
                cancelledBookings
            }
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) {
            if (role === 'admin') {
                query.isAdmin = true;
            } else if (role === 'user') {
                query.isAdmin = false;
            }
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        if (status) {
            if (status === 'Ongoing') {
                query.status = { $in: ['Contacted', 'In Progress'] };
            } else {
                query.status = status;
            }
        }

        if (search) {
            query.email = { $regex: search, $options: 'i' };
        }

        const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
        res.json({ success: true, inquiries });
    } catch (error) {
        console.error('Get Bookings Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (user.isAdmin) {
            return res.status(403).json({ success: false, error: 'Cannot delete admin users' });
        }

        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
