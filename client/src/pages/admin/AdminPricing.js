import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';
import { SAUDI_RIYAL_SYMBOL } from '../../utils/currency';

const AdminPricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const { formatCurrency } = useLanguage();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/api/admin/packages');
      setPackages(response.data.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (pkg) => {
    setEditingId(pkg.id);
    setEditPrice(pkg.price);
  };

  const savePrice = async (id) => {
    try {
      await axios.put(`/api/admin/packages/${id}`, { price: parseInt(editPrice) });
      setPackages(packages.map(p => p.id === id ? { ...p, price: parseInt(editPrice) } : p));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`/api/admin/packages/${id}`, { isActive: !currentStatus });
      setPackages(packages.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Pricing Management</h1>
          <p className="text-gray-400 mt-1">Update package prices and availability</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-4">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-slate-800 rounded-2xl p-6 border ${
                  pkg.isActive ? 'border-slate-700' : 'border-red-500/30 bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      pkg.isActive ? 'bg-primary-500/20' : 'bg-red-500/20'
                    }`}>
                      <Package className={`w-6 h-6 ${pkg.isActive ? 'text-primary-400' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${pkg.isActive ? 'text-white' : 'text-gray-400'}`}>
                        {pkg.title}
                      </h3>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        pkg.category === 'holiday' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {pkg.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-gray-400 text-sm mb-1">Current Price</p>
                      {editingId === pkg.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">{SAUDI_RIYAL_SYMBOL}</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-lg font-bold focus:border-primary-500 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-primary-400">
                          {formatCurrency(pkg.price)}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {editingId === pkg.id ? (
                        <>
                          <button
                            onClick={() => savePrice(pkg.id)}
                            className="p-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(pkg)}
                            className="p-3 bg-primary-500/20 text-primary-400 rounded-xl hover:bg-primary-500/30 transition-colors"
                            title="Edit Price"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleActive(pkg.id, pkg.isActive)}
                            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                              pkg.isActive
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {pkg.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
