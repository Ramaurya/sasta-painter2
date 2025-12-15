import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const statusFilter = searchParams.get('status') || '';
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    // Debounce search could be added, but manual trigger or short delay is fine for now
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBookings();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/bookings', {
                params: {
                    status: statusFilter,
                    search: searchTerm
                }
            });
            if (res.data.success) {
                setBookings(res.data.inquiries);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.post(`/api/admin/inquiries/${id}/update`, { status: newStatus });
            setBookings(bookings.map(i => i._id === id ? { ...i, status: newStatus } : i));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '1rem', color: '#64748b', fontSize: '1rem' }}
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                            {statusFilter ? `${statusFilter} Bookings` : 'All Bookings'}
                        </h2>

                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '0.6rem 1rem 0.6rem 2.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.9rem',
                                    width: '250px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '1rem', color: '#64748b' }}>Name</th>
                                        <th style={{ padding: '1rem', color: '#64748b' }}>Service</th>
                                        <th style={{ padding: '1rem', color: '#64748b' }}>City</th>
                                        <th style={{ padding: '1rem', color: '#64748b' }}>Date</th>
                                        <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
                                        <th style={{ padding: '1rem', color: '#64748b' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No bookings found</td></tr>
                                    ) : (
                                        bookings.map(booking => (
                                            <tr key={booking._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontWeight: '600', color: '#334155' }}>{booking.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.email}</div>
                                                </td>
                                                <td style={{ padding: '1rem', color: '#334155' }}>{booking.service_type}</td>
                                                <td style={{ padding: '1rem', color: '#334155' }}>{booking.city}</td>
                                                <td style={{ padding: '1rem', color: '#64748b' }}>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600,
                                                        backgroundColor: booking.status === 'Completed' ? '#dcfce7' : booking.status === 'Contacted' ? '#dbeafe' : booking.status === 'Cancelled' ? '#f1f5f9' : '#fef3c7',
                                                        color: booking.status === 'Completed' ? '#166534' : booking.status === 'Contacted' ? '#2563eb' : booking.status === 'Cancelled' ? '#64748b' : '#d97706',
                                                    }}>
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <select
                                                        value={booking.status || 'Pending'}
                                                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                        style={{
                                                            padding: '0.25rem',
                                                            fontSize: '0.9rem',
                                                            borderRadius: '4px',
                                                            border: '1px solid #cbd5e1'
                                                        }}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Contacted">Contacted</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminBookings;
