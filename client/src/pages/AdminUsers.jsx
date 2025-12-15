import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, roleFilter]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`/api/admin/users?search=${searchQuery}&role=${roleFilter}`);
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            const res = await axios.delete(`/api/admin/users/${userToDelete._id}`);
            if (res.data.success) {
                setUsers(users.filter(u => u._id !== userToDelete._id));
                setShowDeleteModal(false);
                setUserToDelete(null);
            }
        } catch (err) {
            console.error('Delete User Error:', err);
            // Optional: Add toast notification for error
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Users...</div>;

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>All Users</h2>
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '0.625rem 1rem 0.625rem 2.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    outline: 'none',
                                    width: '250px',
                                    fontSize: '0.875rem',
                                    color: '#1e293b'
                                }}
                            />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                style={{
                                    marginLeft: '1rem',
                                    padding: '0.625rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    outline: 'none',
                                    fontSize: '0.875rem',
                                    color: '#1e293b',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem', color: '#64748b' }}>Username</th>
                                    <th style={{ padding: '1rem', color: '#64748b' }}>Email</th>
                                    <th style={{ padding: '1rem', color: '#64748b' }}>Role</th>
                                    <th style={{ padding: '1rem', color: '#64748b' }}>Joined Date</th>
                                    <th style={{ padding: '1rem', color: '#64748b' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{user.username}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{user.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                backgroundColor: user.isAdmin ? '#dbeafe' : '#f1f5f9',
                                                color: user.isAdmin ? '#1e40af' : '#475569',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600'
                                            }}>
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {!user.isAdmin && (
                                                <button
                                                    onClick={() => {
                                                        setUserToDelete(user);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        transition: 'background-color 0.2s',
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '16px',
                                maxWidth: '400px',
                                width: '90%',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>Delete User?</h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                                Are you sure you want to delete <span style={{ fontWeight: '600', color: '#0f172a' }}>{userToDelete?.username}</span>? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: 'white',
                                        color: '#64748b',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
