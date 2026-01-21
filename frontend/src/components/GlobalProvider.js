import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

// Safe wrapper that combines all global providers
const GlobalProvider = ({ children }) => {
    return (
        <LanguageProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </LanguageProvider>
    );
};

export default GlobalProvider;
