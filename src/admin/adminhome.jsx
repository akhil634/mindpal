import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './adminhome.css';

const AdminHome = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                
                // Use the correct API to get profiles (which you've disabled RLS for)
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('*');

                if (profilesError) throw profilesError;
                
                console.log("User data:", profilesData);
                setUsers(profilesData || []);
                
            } catch (error) {
                console.error('Error fetching users:', error.message);
                setError('Failed to load users. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Count regular (non-admin) users - those with role null, undefined, or "user"
    const regularUsersCount = users.filter(user => !user.role || user.role === 'user').length;

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>
            <div className="admin-card">
                <h2 className="card-title">User Management</h2>
                {loading ? (
                    <div className="loading-message">Loading users...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Name</th>
                                    <th>Created At</th>
                                    <th>Last Sign In</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="user-id">{user.id}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role || 'user'}`}>
                                                    {user.role || 'user'}
                                                </span>
                                            </td>
                                            <td>{user.full_name || 'N/A'}</td>
                                            <td>{user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</td>
                                            <td>{user.last_sign_in ? new Date(user.last_sign_in).toLocaleString() : 'Never'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-data">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <div className="stat-value">{users.length}</div>
                </div>
                <div className="stat-card">
                    <h3>Regular Users</h3>
                    <div className="stat-value">{regularUsersCount}</div>
                </div>
                <div className="stat-card">
                    <h3>Admin Users</h3>
                    <div className="stat-value">
                        {users.filter(user => user.role === 'admin').length}
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Recent Signups</h3>
                    <div className="stat-value">
                        {users.filter(user => {
                            const created = new Date(user.created_at);
                            const now = new Date();
                            const diffTime = Math.abs(now - created);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            return diffDays <= 7;
                        }).length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;