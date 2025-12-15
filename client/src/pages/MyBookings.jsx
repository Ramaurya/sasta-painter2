import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaClock, FaCheckCircle, FaPhone } from 'react-icons/fa';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/my-bookings');
            if (res.data.success) {
                setBookings(res.data.inquiries);
            }
        } catch (err) {
            setError('Failed to fetch bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            await axios.post(`/api/my-bookings/delete/${id}`);
            setBookings(bookings.filter(b => b._id !== id));
        } catch (err) {
            alert('Failed to delete booking');
        }
    };

    if (loading) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>Loading...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return { bg: '#dcfce7', text: '#166534', icon: <FaCheckCircle /> };
            case 'Contacted': return { bg: '#dbeafe', text: '#2563eb', icon: <FaPhone /> };
            default: return { bg: '#fef3c7', text: '#d97706', icon: <FaClock /> };
        }
    };

    return (
        <div className="container" style={{ padding: '5rem 0' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="section-title">
                    <span>Dashboard</span>
                    <h2>My Bookings</h2>
                </div>
            </motion.div>

            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

            {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>No bookings found.</p>
                </div>
            ) : (
                <div className="grid">
                    {bookings.map((booking, index) => {
                        const statusStyle = getStatusColor(booking.status);
                        return (
                            <motion.div
                                key={booking._id}
                                className="feature-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ padding: '2rem', background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'left' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.25rem' }}>{booking.service_type}</h3>
                                    <span style={{
                                        backgroundColor: statusStyle.bg,
                                        color: statusStyle.text,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {statusStyle.icon} {booking.status}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>City:</strong> {booking.city}</p>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                                {booking.message && <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}><strong>Note:</strong> {booking.message}</p>}

                                {(booking.status !== 'Completed' && booking.status !== 'Contacted') && (
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                        {/* Edit would require a modal or separate page. For now just delete. */}
                                        <button
                                            onClick={() => handleDelete(booking._id)}
                                            style={{
                                                background: '#fee2e2',
                                                color: '#991b1b',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '0.25rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <FaTrash /> Cancel
                                        </button>
                                        {/* Placeholder for edit */}
                                        {/* <button className="btn-secondary"><FaEdit /> Edit</button> */}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
