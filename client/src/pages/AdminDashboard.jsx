import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUsers, FaClipboardList, FaCalendarDay, FaClock, FaTools, FaCheckCircle, FaBan, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/admin/dashboard-stats');
            if (res.data.success) {
                setStats(res.data.stats);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const StatCard = ({ title, count, icon, color, delay, onClick }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5, boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }}
            onClick={onClick}
            style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '140px',
                position: 'relative',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    backgroundColor: `${color}15`,
                    color: color,
                    padding: '10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', lineHeight: 1 }}>
                    {count}
                </span>
            </div>
            <div>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500', color: '#64748b' }}>{title}</p>
            </div>
            <div style={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                opacity: 0.05,
                transform: 'scale(5)',
                color: color
            }}>
                {icon}
            </div>
        </motion.div>
    );

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b' }}>
            Loading Dashboard...
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
            {/* Minimal Admin Header */}
            <div style={{
                backgroundColor: 'white',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        A
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#0f172a' }}>Admin Dashboard</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                        <FaUserCircle size={20} color="#94a3b8" />
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user?.username || 'Admin'}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'none',
                            border: '1px solid #e2e8f0',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#64748b',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Overview</h1>
                    <p style={{ color: '#64748b', marginTop: '4px' }}>Welcome back, here's what's happening today.</p>
                </motion.div>

                {stats && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {/* Key Metrics Row */}
                        <StatCard
                            title="Total Users"
                            count={stats.totalUsers}
                            icon={<FaUsers size={24} />}
                            color="#3b82f6"
                            delay={0.1}
                            onClick={() => navigate('/admin/users')}
                        />
                        <StatCard
                            title="Total Bookings"
                            count={stats.totalBookings}
                            icon={<FaClipboardList size={24} />}
                            color="#8b5cf6"
                            delay={0.2}
                            onClick={() => navigate('/admin/bookings')}
                        />
                        <StatCard
                            title="Today's Bookings"
                            count={stats.todaysBookings}
                            icon={<FaCalendarDay size={24} />}
                            color="#f59e0b"
                            delay={0.3}
                            // No specific filter for "Today" in bookings page yet, just show all or add logic later if needed
                            onClick={() => navigate('/admin/bookings')}
                        />

                        {/* Status Breakdown */}
                        <StatCard
                            title="Pending"
                            count={stats.pendingBookings}
                            icon={<FaClock size={24} />}
                            color="#ef4444"
                            delay={0.4}
                            onClick={() => navigate('/admin/bookings?status=Pending')}
                        />
                        <StatCard
                            title="Ongoing"
                            count={stats.ongoingProjects}
                            icon={<FaTools size={24} />}
                            color="#0ea5e9"
                            delay={0.5}
                            onClick={() => navigate('/admin/bookings?status=Ongoing')}
                        />
                        <StatCard
                            title="Completed"
                            count={stats.completedProjects}
                            icon={<FaCheckCircle size={24} />}
                            color="#22c55e"
                            delay={0.6}
                            onClick={() => navigate('/admin/bookings?status=Completed')}
                        />
                        <StatCard
                            title="Cancelled"
                            count={stats.cancelledBookings}
                            icon={<FaBan size={24} />}
                            color="#94a3b8"
                            delay={0.7}
                            onClick={() => navigate('/admin/bookings?status=Cancelled')}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
