import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AdminFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                
                // Join with profiles to get user names
                const { data: feedbackData, error: feedbackError } = await supabase
                    .from('mental_health_feedback')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (feedbackError) throw feedbackError;
                
                // Fetch all relevant user profiles
                const userIds = feedbackData.map(item => item.user_id);
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, email')
                    .in('id', userIds);

                if (profilesError) throw profilesError;
                
                // Create a lookup map for profiles
                const profilesMap = {};
                profilesData.forEach(profile => {
                    profilesMap[profile.id] = profile;
                });
                
                // Combine the data
                const enrichedFeedback = feedbackData.map(item => ({
                    ...item,
                    user_profile: profilesMap[item.user_id] || null
                }));
                
                console.log("Enriched feedback data:", enrichedFeedback);
                setFeedback(enrichedFeedback || []);
                
            } catch (error) {
                console.error('Error fetching feedback:', error.message);
                setError('Failed to load feedback. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="admin-container">
            <h1 className="admin-title">User Feedback</h1>
            <div className="admin-card">
                <h2 className="card-title">Mental Health Feedback</h2>
                {loading ? (
                    <div className="loading-message">Loading feedback...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Mental Health Rating</th>
                                    <th>Stress Frequency</th>
                                    <th>Overwhelmed Frequency</th>
                                    <th>Emotional Awareness</th>
                                    <th>Coping Mechanisms</th>
                                    <th>Additional Support</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedback.length > 0 ? (
                                    feedback.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.user_profile?.email || `User ${item.user_id.substring(0,8)}`}</td>
                                            <td>{item.mental_health_rating || 'N/A'}</td>
                                            <td>{item.stress_frequency || 'N/A'}</td>
                                            <td>{item.overwhelmed_frequency || 'N/A'}</td>
                                            <td>{item.emotional_awareness || 'N/A'}</td>
                                            <td>{item.coping_mechanisms || 'N/A'}</td>
                                            <td style={{maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis"}}>
                                                {item.additional_support || 'None provided'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="no-data">No feedback found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Total Submissions</h3>
                    <div className="stat-value">{feedback.length}</div>
                </div>
                <div className="stat-card">
                    <h3>Average Mental Health Rating</h3>
                    <div className="stat-value">
                        {feedback.length > 0 
                            ? (feedback.reduce((sum, item) => sum + (parseFloat(item.mental_health_rating) || 0), 0) / feedback.length).toFixed(1)
                            : 'N/A'
                        }
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Recent Feedback</h3>
                    <div className="stat-value">
                        {feedback.filter(item => {
                            const created = new Date(item.created_at);
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

export default AdminFeedback;