import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, Plane, Building2, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGradient } from '../../context/GradientContext';

const Partners = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { useGradients } = useGradient();

  const defaultBanks = useMemo(() => [
    { id: 1, name: 'Al Rajhi Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Al_Rajhi_Bank_Logo.svg', initials: 'AR', gradient: 'from-blue-600 to-blue-800', active: true },
    { id: 2, name: 'Saudi National Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/68/SNB_Logo.svg', initials: 'SNB', gradient: 'from-green-700 to-green-900', active: true },
    { id: 3, name: 'Riyad Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Riyad_Bank_logo.svg', initials: 'RB', gradient: 'from-indigo-600 to-indigo-800', active: true },
    { id: 4, name: 'SAB', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/SABB_logo.svg', initials: 'SAB', gradient: 'from-orange-500 to-orange-700', active: true },
    { id: 5, name: 'Alinma Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Alinma_Bank.svg', initials: 'AB', gradient: 'from-teal-500 to-emerald-700', active: true },
    { id: 6, name: 'Bank AlJazira', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Bank_AlJazira_Logo.svg', initials: 'BAJ', gradient: 'from-cyan-500 to-blue-700', active: true },
  ], []);

  const defaultAirlines = useMemo(() => [
    { id: 1, name: 'Saudia', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Saudia_Logo.svg', initials: 'SV', gradient: 'from-emerald-600 to-emerald-800', active: true },
    { id: 2, name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg', initials: 'EK', gradient: 'from-red-500 to-red-700', active: true },
    { id: 3, name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Qatar_Airways_logo.svg', initials: 'QR', gradient: 'from-purple-800 to-purple-950', active: true },
    { id: 4, name: 'Etihad Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Etihad_Airways_Logo.svg', initials: 'EY', gradient: 'from-amber-600 to-yellow-700', active: true },
    { id: 5, name: 'Flynas', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flynas_Logo.svg', initials: 'XY', gradient: 'from-blue-700 to-blue-900', active: true },
    { id: 6, name: 'Flydubai', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flydubai_logo.svg', initials: 'FZ', gradient: 'from-sky-500 to-blue-700', active: true },
  ], []);

  const [partners, setPartners] = useState({ banks: defaultBanks, airlines: defaultAirlines });

  useEffect(() => {
    const mergePartners = (parsed) => ({
      banks: parsed.banks?.map((p, i) => ({ ...defaultBanks[i], ...p, gradient: defaultBanks[i]?.gradient || 'from-gray-600 to-gray-800', initials: defaultBanks[i]?.initials || p.name?.substring(0, 3).toUpperCase() })) || defaultBanks,
      airlines: parsed.airlines?.map((p, i) => ({ ...defaultAirlines[i], ...p, gradient: defaultAirlines[i]?.gradient || 'from-gray-600 to-gray-800', initials: defaultAirlines[i]?.initials || p.name?.substring(0, 3).toUpperCase() })) || defaultAirlines
    });

    const fetchPartners = async () => {
      try {
        const response = await axios.get('/api/settings');
        const apiPartners = response.data.data.partners;
        setPartners(mergePartners(apiPartners));
        localStorage.setItem('sitePartners', JSON.stringify(apiPartners));
      } catch (error) {
        const saved = localStorage.getItem('sitePartners');
        if (saved) {
          setPartners(mergePartners(JSON.parse(saved)));
        }
      }
    };

    fetchPartners();
  }, [defaultAirlines, defaultBanks]);

  const bankPartners = partners.banks.filter(p => p.active);
  const airlinePartners = partners.airlines.filter(p => p.active);

  const PartnerSlider = ({ partners, direction = 'left' }) => (
    <div className="relative overflow-hidden py-4">
      {/* Gradient Fades */}
      <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r ${isDark ? 'from-slate-900' : 'from-gray-50'} to-transparent`} />
      <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l ${isDark ? 'from-slate-800' : 'from-white'} to-transparent`} />
      
      <motion.div
        className="flex space-x-6"
        animate={{
          x: direction === 'left' ? [0, -1200] : [-1200, 0]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear"
          }
        }}
      >
        {[...partners, ...partners, ...partners].map((partner, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`flex-shrink-0 px-6 py-4 rounded-2xl transition-all duration-300 ${
              isDark 
                ? 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50' 
                : 'bg-white hover:shadow-xl border border-gray-100'
            } shadow-lg min-w-[180px] flex items-center gap-3`}
          >
            {partner.logo ? (
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="w-10 h-10 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className={`hidden w-full h-full rounded-xl bg-gradient-to-br ${partner.gradient || 'from-gray-600 to-gray-800'} items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{partner.initials}</span>
                </div>
              </div>
            ) : (
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${partner.gradient || 'from-gray-600 to-gray-800'} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-sm">{partner.initials}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {partner.name}
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {language === 'bn' ? 'شريك' : 'Partner'}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className={`py-24 relative overflow-hidden ${
      isDark 
        ? (useGradients ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-slate-900') 
        : (useGradients ? 'bg-gradient-to-b from-gray-50 to-white' : 'bg-gray-50')
    }`}>
      {/* Background Decorations */}
      {useGradients && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ultra Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-500 text-sm font-semibold mb-6"
          >
            <Award className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'شركاء موثوقون' : 'Trusted Partners'}
            <Sparkles className="w-4 h-4 ml-2" />
          </motion.span>
          <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === 'bn' ? 'شركاؤنا' : 'Our Partners'}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'bn' 
              ? 'نتعاون مع بنوك وشركات طيران موثوقة لتقديم تجربة سفر أكثر أمانًا وراحة'
              : 'Partnered with world-leading banks and airlines for your convenience'}
          </p>
        </motion.div>

        {/* Bank Partners */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Building2 className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {language === 'bn' ? 'شركاء الدفع والبنوك' : 'Banking Partners'}
            </h3>
          </div>
          <PartnerSlider partners={bankPartners} direction="left" />
        </div>

        {/* Airline Partners */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Plane className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {language === 'bn' ? 'شركاء الطيران' : 'Airline Partners'}
            </h3>
          </div>
          <PartnerSlider partners={airlinePartners} direction="right" />
        </div>
      </div>
    </section>
  );
};

export default Partners;
