import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { internshipAPI } from '../services/api';

const InternshipForm = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        platform: 'LinkedIn',
        appliedDate: new Date().toISOString().split('T')[0],
        startDate: '',
        nextStepDate: '',
        status: 'Applied',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            fetchInternship();
        }
    }, [id]);

    const fetchInternship = async () => {
        setFetching(true);
        try {
            const response = await internshipAPI.getOne(id);
            const data = response.data;
            setFormData({
                ...data,
                appliedDate: new Date(data.appliedDate).toISOString().split('T')[0],
                startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
                nextStepDate: data.nextStepDate ? new Date(data.nextStepDate).toISOString().split('T')[0] : ''
            });
        } catch (err) {
            setError('Failed to fetch internship details');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isEdit) {
                await internshipAPI.update(id, formData);
            } else {
                await internshipAPI.create(formData);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save internship');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="container"><h2>Loading details...</h2></div>;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="glass-card">
                <h1>{isEdit ? 'Update Internship' : 'Track New Internship'}</h1>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>Enter the details of your application below</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Row 1: Company and Role */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                className="form-control"
                                placeholder="Google, Meta, etc."
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role / Position</label>
                            <input
                                type="text"
                                name="role"
                                className="form-control"
                                placeholder="Software Engineering Intern"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2: Platform and Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Platform</label>
                            <select name="platform" className="form-control" value={formData.platform} onChange={handleChange}>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Internshala">Internshala</option>
                                <option value="Company Website">Company Website</option>
                                <option value="Naukri">Naukri</option>
                                <option value="Indeed">Indeed</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Current Status</label>
                            <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                                <option value="Applied">Applied</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Selected">Selected</option>
                                <option value="Completed">Completed</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Applied Date and Start Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Applied Date</label>
                            <input
                                type="date"
                                name="appliedDate"
                                className="form-control"
                                value={formData.appliedDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Estimated Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                className="form-control"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 4: Next Step Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Next Step / Interview Date</label>
                            <input
                                type="date"
                                name="nextStepDate"
                                className="form-control"
                                value={formData.nextStepDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 5: Notes */}
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            className="form-control"
                            rows="4"
                            placeholder="Any specific details, interview questions, or follow-up dates..."
                            value={formData.notes}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (isEdit ? 'Update Internship' : 'Save Internship')}
                        </button>
                        <button type="button" className="btn" onClick={() => navigate('/')} style={{ background: '#f1f5f9' }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InternshipForm;
