import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const HeaderExtensions = () => {
    // --- Global Contexts ---
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    
    // --- Local UI State ---
    const [showProfile, setShowProfile] = useState(false);

    // --- Language Logic ---
    const languages = ['English', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'];
    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    // --- Profile Data ---
    // Try to get user from localStorage if auth saves it there, else placeholders
    const userStr = localStorage.getItem('user'); 
    const user = userStr ? JSON.parse(userStr) : {
        name: 'Guest User',
        email: 'guest@example.com',
        phone: '+91 99999 99999',
        userId: 'GUEST_001'
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            {/* 1. Profile Tab */}
            <div style={{ position: 'relative' }}>
                <button 
                    onClick={() => setShowProfile(!showProfile)}
                    className="btn btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    👤 Profile
                </button>
                
                {showProfile && (
                    <div className="glass-card" style={{
                        position: 'absolute',
                        top: '110%',
                        right: 0,
                        width: '280px',
                        padding: '1.5rem',
                        zIndex: 1000,
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-color)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>My Profile</h3>
                            <button onClick={() => setShowProfile(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Full Name</label>
                                <div style={{ fontWeight: 600 }}>{user.name}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Email ID</label>
                                <div>{user.email}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Phone Number</label>
                                <div>{user.phone || 'Not Provided'}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>User ID</label>
                                <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>{user.userId || user._id || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Language Selector - REMOVED as per user request */}
            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                <select 
                    value={language}
                    onChange={handleLanguageChange}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem', cursor: 'pointer' }}
                >
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </div> */}

            {/* 3. Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="btn btn-outline"
                style={{ fontSize: '1.2rem', padding: '0.4rem 0.8rem' }}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
        </div>
    );
};

export default HeaderExtensions;
