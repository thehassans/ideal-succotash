import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Settings, 
  LogOut,
  Plane,
  ChevronRight,
  Users,
  FileCheck,
  FileText,
  Palmtree,
  Sun,
  Moon,
  Globe,
  ClipboardList,
  Bot,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('adminTheme');
    return saved ? saved === 'dark' : false; // Light mode as default
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('adminLanguage');
    return saved === 'ar' ? 'bn' : (saved || 'en');
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdmin();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Open sidebar by default on desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    localStorage.setItem('adminTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('adminLanguage', language);
  }, [language]);

  const labels = {
    en: {
      dashboard: 'Dashboard',
      queries: 'Queries',
      bookings: 'Bookings',
      flightBookings: 'Flight Bookings',
      holidays: 'Holidays',
      visas: 'Visa Pricing',
      visaQueries: 'Visa Applications',
      users: 'Users',
      invoices: 'Invoices',
      pricing: 'Pricing',
      settings: 'Settings',
      aiAgent: 'AI Agent',
      agentChats: 'Agent Chats',
      logout: 'Logout',
      viewSite: 'View Site',
      admin: 'Admin',
      exploreHolidays: 'Ahmed Essa Travel'
    },
    bn: {
      dashboard: 'لوحة التحكم',
      queries: 'الاستفسارات',
      bookings: 'الحجوزات',
      flightBookings: 'حجوزات الطيران',
      holidays: 'العطلات',
      visas: 'أسعار التأشيرات',
      visaQueries: 'طلبات التأشيرات',
      users: 'المستخدمون',
      invoices: 'الفواتير',
      pricing: 'الأسعار',
      settings: 'الإعدادات',
      aiAgent: 'الوكيل الذكي',
      agentChats: 'محادثات الوكيل',
      logout: 'تسجيل الخروج',
      viewSite: 'عرض الموقع',
      admin: 'الإدارة',
      exploreHolidays: 'أحمد عيسى للسفر'
    }
  };

  const t = labels[language];

  const menuItems = [
    { path: '/admin/dashboard', label: t.dashboard, icon: LayoutDashboard },
    { path: '/admin/queries', label: t.queries, icon: MessageSquare },
    { path: '/admin/bookings', label: t.bookings, icon: Calendar },
    { path: '/admin/invoices', label: t.invoices, icon: FileText },
    { path: '/admin/flight-bookings', label: t.flightBookings, icon: Plane },
    { path: '/admin/holidays', label: t.holidays, icon: Palmtree },
    { path: '/admin/visas', label: t.visas, icon: FileCheck },
    { path: '/admin/visa-queries', label: t.visaQueries, icon: ClipboardList },
    { path: '/admin/users', label: t.users, icon: Users },
    { path: '/admin/ai-agent', label: t.aiAgent, icon: Bot },
    { path: '/admin/agent-chats', label: t.agentChats, icon: MessageSquare },
    { path: '/admin/settings', label: t.settings, icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div dir={language === 'bn' ? 'rtl' : 'ltr'} className={`min-h-screen flex ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : 0,
          x: sidebarOpen ? 0 : -280
        }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-full border-r z-50 flex flex-col overflow-hidden ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}
      >
        {/* Logo */}
        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.admin}</h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.exploreHolidays}</p>
              </motion.div>
            )}
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(false)}
            className={`p-2.5 rounded-xl transition-all ${
              isDark 
                ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-gray-300 hover:text-white shadow-lg shadow-slate-900/50' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:text-gray-900 shadow-md'
            }`}
            title="Close Sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
                {sidebarOpen && isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
              isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{t.logout}</span>}
          </button>
          <Link
            to="/"
            className={`flex items-center space-x-3 w-full px-4 py-3 mt-2 rounded-xl transition-all ${
              isDark ? 'text-gray-400 hover:text-primary-400 hover:bg-primary-500/10' : 'text-gray-600 hover:text-primary-500 hover:bg-primary-50'
            }`}
          >
            <Plane className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{t.viewSite}</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className="flex-1 transition-all min-h-screen"
        style={{ marginLeft: sidebarOpen ? 280 : 0 }}
      >
        {/* Header with controls */}
        <div className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between ${
          isDark ? 'bg-slate-800 border-b border-slate-700' : 'bg-white border-b border-gray-200'
        }`}>
          {/* Left side - Toggle button */}
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className={`p-2.5 rounded-xl transition-all ${
                  isDark 
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/30' 
                    : 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/30'
                }`}
                title="Open Sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </motion.button>
            )}
            {!sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Plane className="w-4 h-4 text-white transform -rotate-45" />
                </div>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.admin}</span>
              </div>
            )}
          </div>
          
          {/* Right side - Theme & Language */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title="Toggle Language"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'عربي' : 'EN'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl transition-all ${
                isDark 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30' 
                  : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 hover:from-slate-200 hover:to-slate-300'
              }`}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
