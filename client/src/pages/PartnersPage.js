import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const PartnersPage = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const bankPartners = [
    { name: 'Al Rajhi Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Al_Rajhi_Bank_Logo.svg' },
    { name: 'Saudi National Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/68/SNB_Logo.svg' },
    { name: 'Riyad Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Riyad_Bank_logo.svg' },
    { name: 'SAB', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/SABB_logo.svg' },
    { name: 'Alinma Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Alinma_Bank.svg' },
    { name: 'Bank AlJazira', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Bank_AlJazira_Logo.svg' },
  ];

  const airlinePartners = [
    { name: 'Saudia', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Saudia_Logo.svg' },
    { name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg' },
    { name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Qatar_Airways_logo.svg' },
    { name: 'Etihad Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Etihad_Airways_Logo.svg' },
    { name: 'Flynas', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flynas_Logo.svg' },
    { name: 'Flydubai', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flydubai_logo.svg' },
  ];

  return (
    <>
      <Helmet>
        <title>{language === 'bn' ? 'شركاؤنا' : 'Our Partners'} | Sabir Travels</title>
      </Helmet>

      <section className="relative pt-32 pb-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            {language === 'bn' ? 'شركاؤنا' : 'Our Partners'}
          </motion.h1>
        </div>
      </section>

      <section className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`} id="banks">
            {language === 'bn' ? 'شركاء البنوك السعودية' : 'Saudi Banking Partners'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
            {bankPartners.map((partner, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg flex items-center justify-center`}>
                <img src={partner.logo} alt={partner.name} className="h-12 object-contain" />
              </motion.div>
            ))}
          </div>

          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`} id="airlines">
            {language === 'bn' ? 'شركاء الطيران الخليجي' : 'Gulf Airline Partners'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {airlinePartners.map((partner, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg flex items-center justify-center`}>
                <img src={partner.logo} alt={partner.name} className="h-12 object-contain" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnersPage;
