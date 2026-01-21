import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                🚀 InternTracker
            </Link>
            <div className="navbar-links">
                <Link to="/">Dashboard</Link>
                <Link to="/add">Add New</Link>
                <Link to="/files">Files</Link>
                <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
