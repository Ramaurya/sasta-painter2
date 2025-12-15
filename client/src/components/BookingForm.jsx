import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';

const BookingForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        email: '',
        service_type: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login or register to book visit site");
            navigate('/login');
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axios.post('/api/book', formData);
            if (res.data.success) {
                setStatus({ type: 'success', message: 'Success! Your inquiry has been received. We will contact you shortly.' });
                setFormData({ name: '', phone: '', city: '', email: '', service_type: '', message: '' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="book" className="booking-section">
            <div className="container">
                <div className="section-title">
                    <span>Book Now</span>
                    <h2>Get a Free Site Visit</h2>
                </div>
                <motion.div
                    className="booking-form"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {status.message && (
                        <div style={{
                            backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                            color: status.type === 'success' ? '#166534' : '#991b1b',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            {status.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <select
                                    id="city"
                                    name="city"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select City</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Noida">Noida</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="service_type">Service Required</label>
                            <select
                                id="service_type"
                                name="service_type"
                                className="form-control"
                                value={formData.service_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Service</option>
                                <option value="Interior Painting">Interior Painting</option>
                                <option value="Exterior Painting">Exterior Painting</option>
                                <option value="Rental Painting">Rental Painting</option>
                                <option value="Waterproofing">Waterproofing</option>
                                <option value="Wood Finishes">Wood Finishes</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message (Optional)</label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-control"
                                rows="3"
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Booking...' : 'Book Free Visit'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default BookingForm;
