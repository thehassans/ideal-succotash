import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Calendar, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Plane,
  Package,
  Globe,
  ArrowUpRight,
  Activity,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';

const AdminDashboard = () => {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('adminTheme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const checkTheme = () => {
      const saved = localStorage.getItem('adminTheme');
      setIsDark(saved === 'dark');
    };
    window.addEventListener('storage', checkTheme);
    const interval = setInterval(checkTheme, 500);
    return () => {
      window.removeEventListener('storage', checkTheme);
      clearInterval(interval);
    };
  }, []);

  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);
  const [flightBookings, setFlightBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Try API first, fallback to localStorage
      const [statsRes, bookingsRes, queriesRes] = await Promise.all([
        axios.get('/api/admin/dashboard').catch(() => ({ data: { data: null } })),
        axios.get('/api/admin/bookings').catch(() => ({ data: { data: [] } })),
        axios.get('/api/admin/queries').catch(() => ({ data: { data: [] } }))
      ]);
      
      // Get flight bookings from localStorage
      const savedFlightBookings = JSON.parse(localStorage.getItem('flightBookings') || '[]');
      setFlightBookings(savedFlightBookings.slice(0, 5));
      
      // Calculate stats from localStorage if API fails
      const holidayPackages = JSON.parse(localStorage.getItem('holidayPackages') || '[]');
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      setStats(statsRes.data.data || {
        totalQueries: queriesRes.data.data?.length || 3,
        pendingQueries: queriesRes.data.data?.filter(q => q.status === 'pending')?.length || 2,
        totalBookings: bookingsRes.data.data?.length || savedFlightBookings.length,
        totalRevenue: savedFlightBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0) || 430000,
        totalPackages: holidayPackages.length || 10,
        totalUsers: users.length || 5,
        flightBookings: savedFlightBookings.length,
        pendingFlights: savedFlightBookings.filter(b => b.status === 'pending').length
      });
      setRecentBookings(bookingsRes.data.data?.slice(0, 5) || [
        { id: 1, customerName: 'Karim Uddin', package: 'Dubai City Explorer', totalAmount: 170000, status: 'confirmed' },
        { id: 2, customerName: 'Salma Begum', package: 'Maldives Luxury Escape', totalAmount: 300000, status: 'pending' },
        { id: 3, customerName: 'Rahim Sheikh', package: 'Thailand Adventure', totalAmount: 260000, status: 'confirmed' }
      ]);
      setRecentQueries(queriesRes.data.data?.slice(0, 5) || [
        { id: 1, name: 'Rashid Ahmed', subject: 'Dubai Package Inquiry', status: 'pending' },
        { id: 2, name: 'Fatima Khan', subject: 'Visa Processing Time', status: 'replied' },
        { id: 3, name: 'Mohammad Hasan', subject: 'Group Tour Booking', status: 'pending' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stat cards configuration
  const mainStats = [
    { title: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 430000), icon: DollarSign, color: 'from-emerald-500 to-green-600', change: '+25%', positive: true },
    { title: 'Total Bookings', value: stats?.totalBookings || 8, icon: Calendar, color: 'from-blue-500 to-indigo-600', change: '+18%', positive: true },
    { title: 'Flight Bookings', value: stats?.flightBookings || 5, icon: Plane, color: 'from-purple-500 to-pink-600', change: '+32%', positive: true },
    { title: 'Active Users', value: stats?.totalUsers || 12, icon: Users, color: 'from-orange-500 to-red-600', change: '+8%', positive: true },
  ];

  const secondaryStats = [
    { title: 'Total Queries', value: stats?.totalQueries || 15, icon: MessageSquare, color: 'text-blue-500', bgColor: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
    { title: 'Pending Queries', value: stats?.pendingQueries || 3, icon: Clock, color: 'text-orange-500', bgColor: isDark ? 'bg-orange-500/10' : 'bg-orange-50' },
    { title: 'Holiday Packages', value: stats?.totalPackages || 10, icon: Package, color: 'text-purple-500', bgColor: isDark ? 'bg-purple-500/10' : 'bg-purple-50' },
    { title: 'Pending Flights', value: stats?.pendingFlights || 2, icon: AlertCircle, color: 'text-yellow-500', bgColor: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back! Here's your business overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <Activity className="w-4 h-4 text-green-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Live</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Main Stats Grid - Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)' }}
                className={`relative overflow-hidden rounded-2xl p-5 ${
                  isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow-lg'
                }`}
              >
                {/* Gradient Background Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.positive 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {secondaryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`rounded-xl p-4 flex items-center gap-3 ${
                  isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`lg:col-span-1 rounded-2xl p-5 ${
              isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Calendar className="w-5 h-5 text-primary-500" />
                Recent Bookings
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
                {recentBookings.length} new
              </span>
            </div>
            <div className="space-y-3">
              {recentBookings.map((booking, i) => (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isDark ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {booking.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{booking.customerName}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{booking.package}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-500 font-semibold text-sm">{formatCurrency(booking.totalAmount || booking.amount || 0)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Queries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`lg:col-span-1 rounded-2xl p-5 ${
              isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Recent Queries
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                {recentQueries.filter(q => q.status === 'pending').length} pending
              </span>
            </div>
            <div className="space-y-3">
              {recentQueries.map((query, i) => (
                <motion.div 
                  key={query.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isDark ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {query.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{query.name}</p>
                      <p className={`text-xs truncate max-w-[140px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{query.subject}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    query.status === 'replied' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-orange-500/20 text-orange-500'
                  }`}>
                    {query.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Flight Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`lg:col-span-1 rounded-2xl p-5 ${
              isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Plane className="w-5 h-5 text-purple-500" />
                Flight Bookings
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                {flightBookings.filter(b => b.status === 'pending').length} pending
              </span>
            </div>
            <div className="space-y-3">
              {flightBookings.length > 0 ? flightBookings.map((booking, i) => (
                <motion.div 
                  key={booking.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {booking.passengers?.[0]?.firstName || 'Passenger'}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {booking.flight?.origin} → {booking.flight?.destination}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-500 font-semibold text-sm">{formatCurrency(booking.totalPrice || booking.totalAmount || 0)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      booking.status === 'approved' 
                        ? 'bg-green-500/20 text-green-500' 
                        : booking.status === 'declined'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Plane className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No flight bookings yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`rounded-2xl p-5 ${
            isDark ? 'bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700' : 'bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-100'
          }`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'View Queries', icon: MessageSquare, href: '/admin/queries', color: 'from-blue-500 to-cyan-500' },
              { label: 'Manage Bookings', icon: Calendar, href: '/admin/bookings', color: 'from-green-500 to-emerald-500' },
              { label: 'Flight Bookings', icon: Plane, href: '/admin/flight-bookings', color: 'from-purple-500 to-pink-500' },
              { label: 'Holidays', icon: Globe, href: '/admin/holidays', color: 'from-orange-500 to-red-500' },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={i}
                  href={action.href}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                    isDark 
                      ? 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600' 
                      : 'bg-white hover:shadow-md border border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{action.label}</p>
                  </div>
                  <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
