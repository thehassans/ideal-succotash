import React, { createContext, useContext, useState, useEffect } from 'react';
import { normalizeSaudiCurrencySettings } from '../utils/currency';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

const defaultSettings = {
  // General
  siteTitle: 'Sabir Travels',
  siteName: 'Sabir Travels',
  tagline: 'Your trusted travel partner in Saudi Arabia',
  taglineAr: 'شريكك الموثوق للسفر في المملكة العربية السعودية',
  logo: null,
  favicon: null,
  
  // Contact Info
  phone: '+966 55 123 4567',
  email: 'info@sabirtravels.sa',
  address: 'Olaya Street, Riyadh 12214, Saudi Arabia',
  currencyCode: 'SAR',
  currencySymbol: '⃁',
  locale: 'en-SA',
  
  // Social Links
  facebook: 'https://facebook.com/sabirtravels',
  twitter: 'https://twitter.com/sabirtravels',
  instagram: 'https://instagram.com/sabirtravels',
  youtube: 'https://youtube.com/sabirtravels',
  
  // Theme Colors
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#06b6d4',
  
  // UI Settings
  useGradients: true,
  
  // Footer
  footerText: 'Premium travel services tailored for Saudi Arabia and Gulf travelers.',
  copyrightText: '© 2024 Sabir Travels. All rights reserved.',
  
  // Partners
  partners: {
    banks: [
      { name: 'Al Rajhi Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Al_Rajhi_Bank_Logo.svg', active: true },
      { name: 'Saudi National Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/68/SNB_Logo.svg', active: true },
      { name: 'Riyad Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Riyad_Bank_logo.svg', active: true },
      { name: 'SAB', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/SABB_logo.svg', active: true },
      { name: 'Alinma Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Alinma_Bank.svg', active: true },
      { name: 'Bank AlJazira', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Bank_AlJazira_Logo.svg', active: true },
    ],
    airlines: [
      { name: 'Saudia', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Saudia_Logo.svg', active: true },
      { name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg', active: true },
      { name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Qatar_Airways_logo.svg', active: true },
      { name: 'Etihad Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Etihad_Airways_Logo.svg', active: true },
      { name: 'Flynas', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flynas_Logo.svg', active: true },
      { name: 'Flydubai', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flydubai_logo.svg', active: true },
    ]
  }
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved
      ? normalizeSaudiCurrencySettings({ ...defaultSettings, ...JSON.parse(saved) })
      : normalizeSaudiCurrencySettings(defaultSettings);
  });

  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Update favicon dynamically
    if (settings.favicon) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = settings.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    // Update document title
    document.title = settings.siteTitle + ' | Travel Booking';
    
    // Update CSS variables for theme
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updatePartners = (type, partners) => {
    setSettings(prev => ({
      ...prev,
      partners: {
        ...prev.partners,
        [type]: partners
      }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('siteSettings');
  };

  return (
    <SiteSettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      updatePartners,
      resetSettings,
      defaultSettings 
    }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export default SiteSettingsContext;
