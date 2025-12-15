const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const authController = require('../controllers/authController');
const googleAuthController = require('../controllers/googleAuthController');
const adminController = require('../controllers/adminController'); // [NEW]

const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public Routes
router.get('/', mainController.getHome);
router.get('/services', mainController.getServices);

// AI Chat Route


// Admin Dashboard Stats [NEW]
router.get('/admin/dashboard-stats', isAdmin, adminController.getDashboardStats);
router.get('/admin/users', isAdmin, adminController.getUsers);
router.delete('/admin/users/:id', isAdmin, adminController.deleteUser);
router.get('/admin/bookings', isAdmin, adminController.getBookings);

// Auth Routes
router.get('/login', (req, res) => res.render('login', { error: null }));
router.post('/login', authController.login);
router.get('/register', (req, res) => res.render('register', { error: null }));
router.post('/register', authController.register);
router.post('/auth/google', googleAuthController.googleLogin);
router.get('/logout', authController.logout);

// Admin Auth
router.get('/admin/login', (req, res) => res.render('admin/login', { error: null }));
router.post('/admin/login', authController.adminLogin);

// Protected Routes
router.post('/book', isAuthenticated, mainController.postBooking);
router.get('/my-bookings', isAuthenticated, mainController.getMyBookings);
router.get('/my-bookings/edit/:id', isAuthenticated, mainController.getEditBooking);
router.post('/my-bookings/edit/:id', isAuthenticated, mainController.updateBooking);
router.post('/my-bookings/delete/:id', isAuthenticated, mainController.deleteBooking);

// Admin Routes
router.get('/admin/inquiries', isAdmin, mainController.getInquiries);
router.post('/admin/inquiries/:id/update', isAdmin, mainController.updateInquiryStatus);

module.exports = router;
