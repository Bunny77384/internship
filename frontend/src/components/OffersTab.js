import React from 'react';

const OffersTab = ({ internships }) => {
    // Filter for accepted/offered internships
    // Safety check: internships might be undefined/null initially
    const offers = (internships || []).filter(item => {
        const status = item.status?.toLowerCase() || '';
        return status.includes('selected') || status.includes('offer');
    });

    return (
        <div className="glass-card fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Offers Received</h2>
            <div className="table-container">
                {offers.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Role</th>
                                <th>Offer Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((item) => (
                                <tr key={item._id}>
                                    <td style={{ fontWeight: '600' }}>{item.companyName}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        {/* Use existing date fields, defensive fallback */}
                                        {item.nextStepDate 
                                            ? new Date(item.nextStepDate).toLocaleDateString() 
                                            : new Date().toLocaleDateString()} 
                                    </td>
                                    <td>
                                        <span className="badge badge-selected">Offer Received</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <h3>No offers yet.</h3>
                        <p>Keep applying! Your big break is coming.</p>
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

export default OffersTab;
