import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { internshipAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const EnhancedInternshipForm = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        platform: 'LinkedIn',
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
        startDate: '',
        nextStepDate: '',
        notes: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchInternship(id);
        }
    }, [id]);

    const fetchInternship = async (internshipId) => {
        try {
            const { data } = await internshipAPI.getAll();
            const internship = data.find((i) => i._id === internshipId);
            if (internship) {
                // Format dates for input fields
                const formattedData = {
                    ...internship,
                    appliedDate: internship.appliedDate ? new Date(internship.appliedDate).toISOString().split('T')[0] : '',
                    startDate: internship.startDate ? new Date(internship.startDate).toISOString().split('T')[0] : '',
                    nextStepDate: internship.nextStepDate ? new Date(internship.nextStepDate).toISOString().split('T')[0] : '',
                };
                setFormData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching internship details', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await internshipAPI.update(id, formData);
            } else {
                await internshipAPI.create(formData);
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving internship', error);
            alert('Failed to save internship');
        }
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {id ? 'Edit Internship' : 'Track New Opportunity'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('Company Name') || 'Company Name'}</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="e.g. Google, Microsoft"
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('Role / Position') || 'Role / Position'}</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="e.g. Frontend Intern"
                        />
                    </div>

                    <div className="row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Platform</label>
                            <select
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Internshala">Internshala</option>
                                <option value="Company Website">Company Website</option>
                                <option value="Naukri">Naukri</option>
                                <option value="Indeed">Indeed</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Applied Date</label>
                            <input
                                type="date"
                                name="appliedDate"
                                value={formData.appliedDate}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                    </div>

                    {/* ENHANCED SECTION: Status Selection */}
                    <div className="form-group" style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <label style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Current Status (Enhanced)</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="form-control"
                            style={{ fontWeight: 'bold' }}
                        >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            
                            {/* NEW OPTIONS */}
                            <option value="Selected">✨ Offer Received (Selected)</option>
                            <option value="Rejected">❌ Rejected</option>
                        </select>
                        <small className="text-muted">
                            Selecting "Offer Received" or "Rejected" will automatically move this to the respective tab.
                        </small>
                    </div>

                    <div className="row">
                         {formData.status === 'Interview Scheduled' && (
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Interview Date</label>
                                <input
                                    type="date"
                                    name="nextStepDate"
                                    value={formData.nextStepDate}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        )}
                        {(formData.status === 'Selected' || formData.status === 'Completed') && (
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                            placeholder="Any rejected reasons, offer details, or interview feedback..."
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {id ? 'Update Internship' : 'Save Internship'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnhancedInternshipForm;
