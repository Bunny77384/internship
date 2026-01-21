import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Persist theme in localStorage
    const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'light');

    useEffect(() => {
        // Apply theme to root html/body
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('appTheme', theme);

        // Define global variables for each theme
        if (theme === 'dark') {
            // Dark Mode Variables
            document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'); // Dark background
            document.documentElement.style.setProperty('--text-main', '#f1f5f9'); // Light text
            document.documentElement.style.setProperty('--text-muted', '#94a3b8');
            document.documentElement.style.setProperty('--card-bg', 'rgba(30, 41, 59, 0.7)'); // Dark glass
            document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
            document.documentElement.style.setProperty('--input-bg', '#334155');
            document.documentElement.style.setProperty('--shadow', '0 10px 25px -5px rgba(0, 0, 0, 0.5)');
        } else {
            // Light Mode Variables (Default from App.css)
            document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)');
            document.documentElement.style.setProperty('--text-main', '#1e293b');
            document.documentElement.style.setProperty('--text-muted', '#64748b');
            document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.8)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.2)');
            document.documentElement.style.setProperty('--input-bg', '#f8fafc');
            document.documentElement.style.setProperty('--shadow', '0 10px 25px -5px rgba(0, 0, 0, 0.1)');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
