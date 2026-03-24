import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  Palmtree, 
  FileCheck, 
  HeadphonesIcon, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Globe,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Compass,
  Ticket
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useGradient } from '../../context/GradientContext';

const Header = () => {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const { useGradients } = useGradient();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const siteSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem('siteSettings') || '{}');
    } catch (error) {
      return {};
    }
  })();
  const siteName = !siteSettings.siteName || ['Ahmed Essa Travel', 'Explore Holidays'].includes(siteSettings.siteName)
    ? 'Sabir Travels'
    : siteSettings.siteName;
  const tagline = !siteSettings.tagline || siteSettings.tagline === 'Your Premium Travel Partner'
    ? 'Your trusted travel partner in Saudi Arabia'
    : siteSettings.tagline;
  const taglineAr = siteSettings.taglineAr || 'شريكك الموثوق للسفر في المملكة العربية السعودية';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const navItems = [
    { path: '/flights', label: t('nav.flights'), icon: Plane },
    { path: '/holidays', label: t('nav.holidays'), icon: Palmtree },
    { path: '/visas', label: t('nav.visas'), icon: FileCheck },
    { path: '/support', label: t('nav.support'), icon: HeadphonesIcon },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? isDark 
            ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-700/50' 
            : 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className={`w-12 h-12 flex items-center justify-center shadow-lg ${useGradients ? 'rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500' : 'rounded-xl bg-slate-900'}`}
            >
              <Plane className="w-6 h-6 text-white transform -rotate-45" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold ${
                isScrolled || isDark ? 'text-primary-500' : 'text-white'
              } group-hover:text-primary-400 transition-colors`}>
                {siteName}
              </h1>
              <p className={`text-xs ${
                isScrolled 
                  ? isDark ? 'text-slate-400' : 'text-gray-500'
                  : 'text-white/70'
              }`}>
                {language === 'bn' ? taglineAr : tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-primary-500 bg-primary-500/10'
                      : isScrolled || isDark
                        ? 'text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-primary-500/5'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
                isScrolled || isDark
                  ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Toggle Language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'عربي' : 'EN'}</span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                isScrolled || isDark
                  ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Toggle Theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    isScrolled || isDark
                      ? 'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${useGradients ? 'bg-gradient-to-br from-primary-500 to-purple-500' : 'bg-slate-900'}`}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="font-medium max-w-[150px] truncate">
                    <Compass className="w-3 h-3 inline mr-1" />
                    Explorer {user?.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border ${
                        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
                      } overflow-hidden`}
                    >
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/my-bookings"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 ${
                            isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <Ticket className="w-4 h-4" />
                          {language === 'bn' ? 'حجوزاتي' : 'My Bookings'}
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 ${
                            isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <User className="w-4 h-4" />
                          {language === 'bn' ? 'الملف الشخصي' : 'Profile'}
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 ${
                            isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <Settings className="w-4 h-4" />
                          {language === 'bn' ? 'الإعدادات' : 'Settings'}
                        </Link>
                      </div>
                      <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <button
                          onClick={handleLogout}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors`}
                        >
                          <LogOut className="w-4 h-4" />
                          {language === 'bn' ? 'تسجيل الخروج' : 'Logout'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    isScrolled || isDark
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {language === 'bn' ? 'تسجيل الدخول' : 'Login'}
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                    useGradients 
                      ? 'bg-gradient-to-r from-primary-500 to-purple-500 hover:shadow-purple-500/30' 
                      : 'bg-primary-500 hover:bg-primary-600'
                  }`}
                >
                  {language === 'bn' ? 'إنشاء حساب' : 'Sign Up'}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
                isScrolled || isDark
                  ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                  : 'bg-white/10 text-white'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden overflow-hidden ${
              isDark ? 'bg-slate-900' : 'bg-white'
            } border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : isDark
                            ? 'text-gray-300 hover:bg-slate-800'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
