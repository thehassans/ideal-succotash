import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const HolidaysPage = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { language, formatCurrency } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/api/packages');
        setPackages(response.data.data);
      } catch (error) {
        setPackages([]);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = filter === 'all' || pkg.category === filter;
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Holiday Packages | Explore Holidays</title>
        <meta name="description" content="Discover amazing holiday packages to destinations worldwide. Book your dream vacation from Bangladesh." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-secondary-500 via-orange-500 to-red-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            {language === 'bn' ? 'হলিডে প্যাকেজ' : 'Holiday Packages'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80"
          >
            {language === 'bn' 
              ? 'আপনার স্বপ্নের গন্তব্যে অবিস্মরণীয় অভিজ্ঞতা'
              : 'Unforgettable experiences to your dream destinations'}
          </motion.p>
        </div>
      </section>

      {/* Filters & Packages */}
      <section className={`py-12 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className={`p-6 rounded-2xl mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'গন্তব্য অনুসন্ধান করুন...' : 'Search destinations...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-gray-50 border-gray-200'
                  } focus:border-primary-500 focus:outline-none`}
                />
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                {['all', 'beach', 'city', 'adventure'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === type
                        ? 'bg-primary-500 text-white'
                        : isDark
                          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' && (language === 'bn' ? 'সব' : 'All')}
                    {type === 'beach' && (language === 'bn' ? 'সৈকত' : 'Beach')}
                    {type === 'city' && (language === 'bn' ? 'শহর' : 'City')}
                    {type === 'adventure' && (language === 'bn' ? 'অ্যাডভেঞ্চার' : 'Adventure')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${
                  isDark ? 'bg-slate-800' : 'bg-white'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image_url}
                    alt={language === 'bn' ? pkg.title_bn : pkg.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex items-center px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {pkg.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? pkg.title_bn : pkg.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                      {pkg.destination}
                    </span>
                    <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Clock className="w-4 h-4 mr-1" />
                      {pkg.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('common.from')}
                      </span>
                      <p className="text-xl font-bold text-primary-500">
                        {formatCurrency(pkg.price)}
                      </p>
                    </div>
                    <Link
                      to={`/holidays/${pkg.id}`}
                      className="px-4 py-2 bg-primary-500/10 text-primary-500 font-medium rounded-xl hover:bg-primary-500 hover:text-white transition-all"
                    >
                      {t('common.viewDetails')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HolidaysPage;
