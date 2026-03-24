import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Package, Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';

const AdminBookings = () => {
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
    const interval = setInterval(checkTheme, 500);
    return () => clearInterval(interval);
  }, []);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { formatCurrency } = useLanguage();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Try API first
      const response = await axios.get('/api/admin/bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching from API, using localStorage:', error);
      // Fallback to localStorage
      const holidayBookings = JSON.parse(localStorage.getItem('holidayBookings') || '[]');
      setBookings(holidayBookings);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (booking) => {
    setEditingId(booking.id);
    setEditData({ status: booking.status, paymentStatus: booking.paymentStatus });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/admin/bookings/${id}`, editData);
    } catch (error) {
      console.error('Error updating via API, updating localStorage:', error);
    }
    // Always update local state and localStorage
    const updatedBookings = bookings.map(b => b.id === id ? { ...b, ...editData } : b);
    setBookings(updatedBookings);
    localStorage.setItem('holidayBookings', JSON.stringify(updatedBookings));
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400';
      case 'unpaid': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Bookings</h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>View and manage all customer bookings</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
                  <tr>
                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Booking ID</th>
                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Customer</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Package</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Travel Date</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Payment</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-slate-700 hover:bg-slate-700/30"
                    >
                      <td className="p-4">
                        <span className="text-primary-400 font-mono">{booking.bookingId}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{booking.customerName}</p>
                          <p className="text-gray-400 text-sm">{booking.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-primary-500 mr-2" />
                          <span className="text-gray-300">{booking.package}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {booking.travelDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-semibold">{formatCurrency(booking.totalAmount || booking.amount || 0)}</span>
                        <p className="text-gray-400 text-sm">{booking.persons} persons</p>
                      </td>
                      <td className="p-4">
                        {editingId === booking.id ? (
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-white text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {editingId === booking.id ? (
                          <select
                            value={editData.paymentStatus}
                            onChange={(e) => setEditData({ ...editData, paymentStatus: e.target.value })}
                            className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-white text-sm"
                          >
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm ${getPaymentColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {editingId === booking.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => saveEdit(booking.id)}
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(booking)}
                            className="p-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
