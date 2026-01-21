import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// --- 1. Expanded Dictionary for Full Site Coverage ---
const translations = {
    English: {
        // ... (English is the key itself mostly)
    },
    Hindi: {
        // Navbar & Brand
        "InternTracker": "इंटर्न ट्रैकर",
        "Dashboard": "डैशबोर्ड",
        "Login": "लॉग इन",
        "Register": "पंजीकरण",
        "Logout": "लॉग आउट",
        
        // Dashboard Stats & Headers
        "Your Career Dashboard": "आपका करियर डैशबोर्ड",
        "Track and manage your internship applications": "अपने इंटर्नशिप आवेदनों को ट्रैक और प्रबंधित करें",
        "Overview": "अवलोकन",
        "Add Internship": "इंटर्नशिप जोड़ें",
        "Total Applications": "कुल आवेदन",
        "Offers Received": "प्राप्त प्रस्ताव",
        "Interviews Scheduled": "साक्षात्कार निर्धारित",
        "Applications Rejected": "अस्वीकृत आवेदन",
        "Recent Applications": "हॉलिया आवेदन",

        // Tabs
        "Offers": "प्रस्ताव",
        "Interviews": "साक्षात्कार",
        "Rejected": "अस्वीकृत",

        // Table Headers
        "Company": "कंपनी",
        "Role": "भूमिका",
        "Status": "स्थिति",
        "Date": "तारीख",
        "Actions": "कार्रवाई",
        
        // Form & Buttons
        "Track New Opportunity": "नया अवसर ट्रैक करें",
        "Company Name": "कंपनी का नाम",
        "Role / Position": "भूमिका / पद",
        "Applied Date": "आवेदन तिथि",
        "Platform": "प्लेटफ़ॉर्म",
        "Notes": "टिप्पणियाँ",
        "Save": "सहेजें",
        "Cancel": "रद्द करें",
        "Update": "अपडेट करें",
        
        // Enhanced Form
        "Current Status (Enhanced)": "वर्तमान स्थिति (उन्नत)",
        "Offer Received": "प्रस्ताव प्राप्त हुआ",
	    "Interview Date": "साक्षात्कार तिथि"
    },
    // (Other languages can be expanded similarly, keeping Hindi focused for verification)
     Telugu: {
        "InternTracker": "ఇంటర్న్ ట్రాకర్",
        "Dashboard": "డాష్‌బోర్డ్",
        "Login": "లాగిన్",
        "Register": "రిజిస్టర్",
        "Logout": "లాగ్ అవుట్",
        "Your Career Dashboard": "మీ కెరీర్ డాష్‌బోర్డ్",
        "Track and manage your internship applications": "మీ ఇంటర్న్‌షిప్ అప్లికేషన్లను ట్రాక్ చేయండి",
        "Overview": "అవలోకనం",
        "Add Internship": "ఇంటర్న్‌షిప్ జోడించండి",
        "Total Applications": "మొత్తం దరఖాస్తులు",
        "Offers Received": "ఆఫర్లు వచ్చాయి"
    }
};

export const LanguageProvider = ({ children }) => {
    // Force default to English (resetting any previous persisted state)
    const [language, setLanguage] = useState('English');

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    // --- 2. DOM Translation Logic (The "Additive" Magic) ---
    useEffect(() => {
        if (language === 'English') return; // React renders English by default

        const dictionary = translations[language];
        if (!dictionary) return;

        // Recursive function to walk the DOM and translate text nodes
        const walkAndTranslate = (node) => {
            if (node.nodeType === 3) { // Text Node
                const text = node.nodeValue.trim();
                if (text && dictionary[text]) {
                    // Store original for restoration? 
                    // Simpler: React usually re-renders, so we replace.
                    // Risk: If we replace "Dashboard" with "डैशबोर्ड", next time logic might fail.
                    // Solution: We only replace English strings found in dictionary.
                    // But if node is already translated, it won't match English key. Good.
                    
                    // Actually, modifying DOM directly battles React.
                    // React might throw error if we mess with its text nodes too much.
                    // A safer bet for "Architect" level is creating a map of replacements
                    node.nodeValue = node.nodeValue.replace(text, dictionary[text]);
                }
            } else if (node.nodeType === 1) { // Element
                 // Skip scripts, inputs that utilize value attribute (handled differently)
                if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'TEXTAREA') return;
                
                // Handle Inputs placeholders
                if (node.tagName === 'INPUT' && node.placeholder) {
                     if (dictionary[node.placeholder]) node.placeholder = dictionary[node.placeholder];
                }

                node.childNodes.forEach(walkAndTranslate);
            }
        };

        // Observer to handle dynamic content (routing)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(walkAndTranslate);
            });
             // Also scan subtree modifications for text changes
             walkAndTranslate(document.body);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Initial scan
        walkAndTranslate(document.body);

        return () => observer.disconnect();
    }, [language]);


    // Helper for new components (still useful)
    const t = (key) => {
        const langData = translations[language] || translations['English'];
        return langData[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
