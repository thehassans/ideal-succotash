import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrencyAmount } from '../utils/currency';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved === 'ar' ? 'bn' : (saved || 'bn');
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    
    // Update document direction and font for Bangla
    if (language === 'bn') {
      document.documentElement.classList.add('font-arabic');
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.classList.remove('font-arabic');
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [language, i18n]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const changeLanguage = (lang) => {
    setLanguage(lang === 'ar' ? 'bn' : lang);
  };

  // Currency formatting for Bangladesh with ৳ symbol
  const formatCurrency = (amount, currency = 'SAR') => {
    return formatCurrencyAmount(amount, {
      language,
      currencyCode: currency
    });
  };

  // Format number for Bangladesh
  const formatNumber = (num) => {
    return new Intl.NumberFormat(language === 'bn' ? 'ar-SA' : 'en-SA').format(num);
  };

  const value = {
    language,
    resolvedLanguage: language === 'bn' ? 'ar' : language,
    setLanguage: changeLanguage,
    toggleLanguage,
    isEnglish: language === 'en',
    isBangla: language === 'bn',
    isArabic: language === 'bn',
    formatCurrency,
    formatNumber
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
