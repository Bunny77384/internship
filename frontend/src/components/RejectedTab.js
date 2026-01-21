import React from 'react';

const RejectedTab = ({ internships }) => {
    // Filter for rejected internships
    const rejected = (internships || []).filter(item => {
        const status = item.status?.toLowerCase() || '';
        return status.includes('rejected');
    });

    return (
        <div className="glass-card fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--danger-color)' }}>Applications Rejected</h2>
            <div className="table-container">
                {rejected.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Role</th>
                                <th>Rejection Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rejected.map((item) => (
                                <tr key={item._id} style={{ opacity: 0.7 }}>
                                    <td style={{ fontWeight: '600' }}>{item.companyName}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        {/* Use existing date fields */}
                                        {item.nextStepDate 
                                            ? new Date(item.nextStepDate).toLocaleDateString() 
                                            : new Date().toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className="badge badge-rejected">Rejected</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <h3>No rejections found.</h3>
                        <p>That's an impressive streak!</p>
                    </div>
                )}
            </div>

            <style>{`
                .fade-in {
                    animation: fadeIn 0.3s ease-in;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default RejectedTab;
