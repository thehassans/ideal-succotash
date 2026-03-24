import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Plane,
  ChevronDown,
  Minus,
  Plus,
  Sparkles,
  Star,
  Globe,
  Shield,
  Clock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGradient } from '../../context/GradientContext';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { useGradients } = useGradient();
  const navigate = useNavigate();
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [showPassengers, setShowPassengers] = useState(false);
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const popularOrigins = [
    { code: 'RUH', name: 'Riyadh', name_bn: 'الرياض', country: 'Saudi Arabia' },
    { code: 'JED', name: 'Jeddah', name_bn: 'جدة', country: 'Saudi Arabia' },
    { code: 'DMM', name: 'Dammam', name_bn: 'الدمام', country: 'Saudi Arabia' },
    { code: 'MED', name: 'Madinah', name_bn: 'المدينة المنورة', country: 'Saudi Arabia' },
    { code: 'AHB', name: 'Abha', name_bn: 'أبها', country: 'Saudi Arabia' },
    { code: 'TUU', name: 'Tabuk', name_bn: 'تبوك', country: 'Saudi Arabia' },
  ];

  const popularDestinations = [
    { code: 'DXB', name: 'Dubai', name_bn: 'دبي', country: 'UAE' },
    { code: 'IST', name: 'Istanbul', name_bn: 'إسطنبول', country: 'Turkey' },
    { code: 'LHR', name: 'London', name_bn: 'لندن', country: 'UK' },
    { code: 'CAI', name: 'Cairo', name_bn: 'القاهرة', country: 'Egypt' },
    { code: 'MLE', name: 'Maldives', name_bn: 'المالديف', country: 'Maldives' },
    { code: 'KUL', name: 'Kuala Lumpur', name_bn: 'كوالالمبور', country: 'Malaysia' },
    { code: 'DOH', name: 'Doha', name_bn: 'الدوحة', country: 'Qatar' },
    { code: 'AMM', name: 'Amman', name_bn: 'عمّان', country: 'Jordan' },
    { code: 'PAR', name: 'Paris', name_bn: 'باريس', country: 'France' },
    { code: 'ROM', name: 'Rome', name_bn: 'روما', country: 'Italy' },
    { code: 'BKK', name: 'Bangkok', name_bn: 'بانكوك', country: 'Thailand' },
    { code: 'SIN', name: 'Singapore', name_bn: 'سنغافورة', country: 'Singapore' },
    { code: 'JFK', name: 'New York', name_bn: 'نيويورك', country: 'USA' },
    { code: 'NRT', name: 'Tokyo', name_bn: 'طوكيو', country: 'Japan' },
    { code: 'GVA', name: 'Geneva', name_bn: 'جنيف', country: 'Switzerland' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!origin || !destination) {
      alert(language === 'bn' ? 'يرجى اختيار نقطة الانطلاق والوجهة' : 'Please select origin and destination');
      return;
    }
    const searchParams = new URLSearchParams({
      origin,
      destination,
      departDate: departDate ? departDate.toISOString() : '',
      returnDate: returnDate ? returnDate.toISOString() : '',
      adults: passengers.adults,
      children: passengers.children
    });
    navigate(`/flights/search?${searchParams.toString()}`);
  };

  const updatePassengers = (type, action) => {
    setPassengers(prev => ({
      ...prev,
      [type]: action === 'add' 
        ? prev[type] + 1 
        : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
        />
      </AnimatePresence>
      
      {/* Ultra Premium Overlays */}
      <div className={`absolute inset-0 ${useGradients ? 'bg-gradient-to-b from-black/70 via-black/50 to-black/80' : 'bg-black/60'}`} />
      {useGradients && <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-pink-900/40" />}
      {useGradients && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/50" />}
      
      {/* Animated Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 10, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[5%] opacity-20"
      >
        <Plane className="w-24 h-24 text-white" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1, ease: "easeInOut" }}
        className="absolute top-1/3 right-[10%] opacity-15"
      >
        <Globe className="w-20 h-20 text-cyan-300" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/3 left-[15%] opacity-20"
      >
        <Sparkles className="w-16 h-16 text-yellow-300" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <span className={`inline-flex items-center px-6 py-2 rounded-full backdrop-blur-sm border ${useGradients ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30' : 'bg-white/10 border-white/20'}`}>
            <Star className={`w-4 h-4 mr-2 fill-current ${useGradients ? 'text-amber-400' : 'text-white'}`} />
            <span className={`text-sm font-medium ${useGradients ? 'text-amber-300' : 'text-white'}`}>
              {language === 'bn' ? 'وكالتك العربية الموثوقة للسفر حول العالم' : 'Your Trusted Travel Agency for Global Journeys'}
            </span>
            <Star className={`w-4 h-4 ml-2 fill-current ${useGradients ? 'text-amber-400' : 'text-white'}`} />
          </span>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className={`text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight ${useGradients ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-2xl' : 'text-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {language === 'bn' ? 'رحلتك المثالية' : 'Your Dream Journey'}
            <br />
            <span className={useGradients ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' : 'text-white/90'}>
              {language === 'bn' ? 'تبدأ من هنا' : 'Starts Here'}
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {language === 'bn' 
              ? 'اكتشف أفضل الوجهات العالمية بخدمة راقية وأسعار تنافسية من Sabir Travels'
              : 'Explore world-class destinations with premium service & unbeatable prices'}
          </motion.p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <form 
            onSubmit={handleSearch}
            className={`${
              isDark ? 'bg-slate-900/95' : useGradients ? 'bg-white/95' : 'bg-white'
            } backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border ${
              isDark ? 'border-slate-700/50' : useGradients ? 'border-white/50' : 'border-slate-200'
            }`}
          >
            {/* All Fields in One Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
              {/* Origin */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <MapPin className={`w-4 h-4 mr-1.5 ${useGradients ? 'text-primary-500' : 'text-slate-600'}`} />
                  {t('banner.origin')}
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                      : useGradients 
                        ? 'bg-white border-gray-200 text-gray-900 focus:border-primary-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-900'
                  } focus:outline-none transition-colors appearance-none cursor-pointer`}
                >
                  <option value="">{t('banner.selectOrigin')}</option>
                  {popularOrigins.map(loc => (
                    <option key={loc.code} value={loc.code}>
                      {language === 'bn' ? loc.name_bn : loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 bottom-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Destination */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <MapPin className={`w-4 h-4 mr-1.5 ${useGradients ? 'text-secondary-500' : 'text-slate-600'}`} />
                  {t('banner.destination')}
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                      : useGradients 
                        ? 'bg-white border-gray-200 text-gray-900 focus:border-primary-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-900'
                  } focus:outline-none transition-colors appearance-none cursor-pointer`}
                >
                  <option value="">{t('banner.selectDestination')}</option>
                  {popularDestinations.map(loc => (
                    <option key={loc.code} value={loc.code}>
                      {language === 'bn' ? loc.name_bn : loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 bottom-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Depart Date */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Calendar className={`w-4 h-4 mr-1.5 ${useGradients ? 'text-primary-500' : 'text-slate-600'}`} />
                  <span className="hidden sm:inline">{t('banner.departDate')}</span>
                  <span className="sm:hidden">{language === 'bn' ? 'مغادرة' : 'Depart'}</span>
                </label>
                <DatePicker
                  selected={departDate}
                  onChange={setDepartDate}
                  minDate={new Date()}
                  placeholderText={t('banner.selectDate')}
                  className={`w-full px-3 sm:px-4 py-3 rounded-xl border-2 text-sm sm:text-base ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                      : useGradients 
                        ? 'bg-white border-gray-200 text-gray-900 focus:border-primary-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-900'
                  } focus:outline-none transition-colors cursor-pointer`}
                  dateFormat="dd MMM yyyy"
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    { name: 'offset', options: { offset: [0, 8] } },
                    { name: 'preventOverflow', options: { rootBoundary: 'viewport', padding: 8 } }
                  ]}
                />
              </div>

              {/* Return Date */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Calendar className={`w-4 h-4 mr-1.5 ${useGradients ? 'text-secondary-500' : 'text-slate-600'}`} />
                  <span className="hidden sm:inline">{t('banner.returnDate')}</span>
                  <span className="sm:hidden">{language === 'bn' ? 'عودة' : 'Return'}</span>
                </label>
                <DatePicker
                  selected={returnDate}
                  onChange={setReturnDate}
                  minDate={departDate || new Date()}
                  placeholderText={t('banner.selectDate')}
                  className={`w-full px-3 sm:px-4 py-3 rounded-xl border-2 text-sm sm:text-base ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                      : useGradients 
                        ? 'bg-white border-gray-200 text-gray-900 focus:border-primary-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-900'
                  } focus:outline-none transition-colors cursor-pointer`}
                  dateFormat="dd MMM yyyy"
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    { name: 'offset', options: { offset: [0, 8] } },
                    { name: 'preventOverflow', options: { rootBoundary: 'viewport', padding: 8 } }
                  ]}
                />
              </div>

              {/* Passengers */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Users className={`w-4 h-4 mr-1.5 ${useGradients ? 'text-cyan-500' : 'text-slate-600'}`} />
                  {t('banner.passengers')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassengers(!showPassengers)}
                  className={`w-full h-[50px] px-4 rounded-xl border-2 ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-500' 
                      : useGradients 
                        ? 'bg-white border-gray-200 text-gray-900 focus:border-primary-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-900'
                  } focus:outline-none transition-colors text-left flex items-center justify-between`}
                >
                  <span className="font-medium">{passengers.adults + passengers.children}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPassengers ? 'rotate-180' : ''}`} />
                </button>

                {/* Passengers Dropdown - Fixed Alignment */}
                <AnimatePresence>
                  {showPassengers && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full right-0 mt-2 p-5 rounded-2xl shadow-2xl z-50 min-w-[220px] ${
                        isDark ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-gray-100'
                      }`}
                    >
                      {/* Adults */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                        <div>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {t('banner.adults')}
                          </span>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>12+ years</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updatePassengers('adults', 'subtract')}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                              isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-primary-100 text-gray-700'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className={`w-8 text-center font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {passengers.adults}
                          </span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updatePassengers('adults', 'add')}
                            className="w-9 h-9 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {t('banner.children')}
                          </span>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>2-11 years</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updatePassengers('children', 'subtract')}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                              isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-primary-100 text-gray-700'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className={`w-8 text-center font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {passengers.children}
                          </span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updatePassengers('children', 'add')}
                            className="w-9 h-9 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative w-full lg:w-auto px-10 sm:px-20 py-4 sm:py-5 text-white font-bold rounded-2xl transition-all flex items-center justify-center space-x-3 overflow-hidden ${
                  useGradients 
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-2xl hover:shadow-blue-500/30' 
                    : 'bg-slate-900 hover:bg-slate-800 shadow-xl hover:shadow-2xl'
                }`}
              >
                {useGradients && <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                <Search className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                <span className="text-lg sm:text-xl relative z-10">{t('banner.search')}</span>
                {useGradients && <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 opacity-70" />}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Ultra Premium Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
        >
          {[
            { number: '50K+', label: 'Happy Travelers', label_bn: 'مسافرون سعداء', icon: Users, gradient: 'from-cyan-500 to-blue-500' },
            { number: '100+', label: 'Destinations', label_bn: 'وجهة', icon: Globe, gradient: 'from-purple-500 to-pink-500' },
            { number: '24/7', label: 'Support', label_bn: 'دعم متواصل', icon: Clock, gradient: 'from-green-500 to-emerald-500' },
            { number: '99%', label: 'Satisfaction', label_bn: 'رضا العملاء', icon: Shield, gradient: 'from-amber-500 to-orange-500' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`group relative text-center p-6 rounded-3xl backdrop-blur-md border transition-all duration-300 overflow-hidden ${useGradients ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              {useGradients && <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity`} />}
              <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center ${useGradients ? `bg-gradient-to-br ${stat.gradient}` : 'bg-white/20'}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-4xl font-black text-white mb-1 drop-shadow-lg">{stat.number}</div>
              <div className="text-white/70 text-sm font-medium">
                {language === 'bn' ? stat.label_bn : stat.label}
              </div>
            </motion.div>
          );
          })}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
