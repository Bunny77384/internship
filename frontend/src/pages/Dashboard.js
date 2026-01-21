import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { internshipAPI } from '../services/api';
import OffersTab from '../components/OffersTab';
import EnhancedInterviewsTab from '../components/EnhancedInterviewsTab';
import RejectedTab from '../components/RejectedTab';
import HeaderExtensions from '../components/HeaderExtensions';

const Dashboard = () => {
    const [internships, setInternships] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [internshipsRes, statsRes] = await Promise.all([
                internshipAPI.getAll(),
                internshipAPI.getStats()
            ]);
            setInternships(internshipsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this internship?')) {
            try {
                await internshipAPI.delete(id);
                fetchData();
            } catch (error) {
                alert('Failed to delete internship');
            }
        }
    };

    const getBadgeClass = (status) => {
        const s = status.toLowerCase();
        if (s.includes('applied')) return 'badge badge-applied';
        if (s.includes('shortlisted')) return 'badge badge-shortlisted';
        if (s.includes('interview')) return 'badge badge-interview';
        if (s.includes('selected')) return 'badge badge-selected';
        if (s.includes('rejected')) return 'badge badge-rejected';
        return 'badge badge-completed';
    };

    if (loading) return <div className="container"><h2>Loading your dashboard...</h2></div>;

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <h1>Your Career Dashboard</h1>
                    <p className="text-muted">Track and manage your internship applications</p>
                </div>
                <button 
                    onClick={() => setActiveTab('overview')}
                    className="btn"
                    style={{ marginRight: '1rem', background: activeTab === 'overview' ? '#e0e7ff' : 'transparent', color: activeTab === 'overview' ? 'var(--primary-color)' : 'inherit' }}
                >
                    Overview
                </button>
                <Link to="/add" className="btn btn-primary">
                    <span>+</span> Add Internship
                </Link>
                <HeaderExtensions />
            </div>

            {stats && (
                <div className="stats-grid">
                    <div className="glass-card stat-item" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer', border: activeTab === 'overview' ? '2px solid var(--primary-color)' : 'none' }}>
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Applications</span>
                    </div>
                    <div className="glass-card stat-item" onClick={() => setActiveTab('offers')} style={{ cursor: 'pointer', border: activeTab === 'offers' ? '2px solid var(--accent-color)' : 'none' }}>
                        <span className="stat-value" style={{ color: 'var(--accent-color)' }}>{stats.selected}</span>
                        <span className="stat-label">Offers Received</span>
                    </div>
                    <div className="glass-card stat-item" onClick={() => setActiveTab('interviews')} style={{ cursor: 'pointer', border: activeTab === 'interviews' ? '2px solid #f59e0b' : 'none' }}>
                        <span className="stat-value" style={{ color: '#f59e0b' }}>{stats.interviewScheduled}</span>
                        <span className="stat-label">Interviews</span>
                    </div>
                    <div className="glass-card stat-item" onClick={() => setActiveTab('rejected')} style={{ cursor: 'pointer', border: activeTab === 'rejected' ? '2px solid var(--danger-color)' : 'none' }}>
                        <span className="stat-value" style={{ color: 'var(--danger-color)' }}>{stats.rejected}</span>
                        <span className="stat-label">Rejected</span>
                    </div>
                </div>
            )}

            {activeTab === 'overview' && (
                <div className="glass-card fade-in">
                    <h2 style={{ marginBottom: '1.5rem' }}>Recent Applications</h2>
                    <div className="table-container">
                    {internships.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Role</th>
                                    <th>Platform</th>
                                    <th>Applied Date</th>
                                    <th>Next Step Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {internships.map((item) => (
                                    <tr key={item._id}>
                                        <td style={{ fontWeight: '600' }}>{item.companyName}</td>
                                        <td>{item.role}</td>
                                        <td>{item.platform}</td>
                                        <td>{new Date(item.appliedDate).toLocaleDateString()}</td>
                                        <td>{item.nextStepDate ? new Date(item.nextStepDate).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <span className={getBadgeClass(item.status)}>{item.status}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link to={`/edit/${item._id}`} className="btn btn-sm btn-primary" style={{ background: '#e0e7ff', color: 'var(--primary-color)' }}>Edit</Link>
                                                <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-danger" style={{ background: '#fee2e2', color: 'var(--danger-color)' }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state">
                            <h3>No internships tracked yet.</h3>
                            <p>Click "Add Internship" to start your journey!</p>
                        </div>
                    )}
                </div>
                </div>
            )}

            {activeTab === 'offers' && <OffersTab internships={internships} />}
            {activeTab === 'interviews' && <EnhancedInterviewsTab />}
            {activeTab === 'rejected' && <RejectedTab internships={internships} />}
        </div>
    );
};

export default Dashboard;
