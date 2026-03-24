import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Save, X,
  Clock, Search, Check, AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';
import { SAUDI_RIYAL_SYMBOL } from '../../utils/currency';

const AdminVisas = () => {
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
  const [visas, setVisas] = useState(() => {
    const saved = localStorage.getItem('visaPricing');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        country: 'Thailand',
        flag: '🇹🇭',
        type: 'Tourist Visa',
        duration: '60 Days',
        processing: '3-5 Working Days',
        price: 5500,
        requirements: ['Valid Passport', 'Passport Size Photo', 'Bank Statement', 'Hotel Booking'],
        active: true
      },
      {
        id: 2,
        country: 'Malaysia',
        flag: '🇲🇾',
        type: 'E-Visa',
        duration: '30 Days',
        processing: '2-3 Working Days',
        price: 3500,
        requirements: ['Valid Passport', 'Passport Size Photo', 'Return Ticket'],
        active: true
      },
      {
        id: 3,
        country: 'Singapore',
        flag: '🇸🇬',
        type: 'Tourist Visa',
        duration: '30 Days',
        processing: '5-7 Working Days',
        price: 6500,
        requirements: ['Valid Passport', 'Passport Size Photo', 'Bank Statement', 'NOC Letter'],
        active: true
      },
      {
        id: 4,
        country: 'UAE (Dubai)',
        flag: '🇦🇪',
        type: 'Tourist Visa',
        duration: '30 Days',
        processing: '3-4 Working Days',
        price: 8500,
        requirements: ['Valid Passport', 'Passport Size Photo', 'Bank Statement', 'Hotel Booking'],
        active: true
      },
      {
        id: 5,
        country: 'India',
        flag: '🇮🇳',
        type: 'E-Visa',
        duration: '30 Days',
        processing: '3-5 Working Days',
        price: 2500,
        requirements: ['Valid Passport', 'Passport Size Photo'],
        active: true
      },
      {
        id: 6,
        country: 'United Kingdom',
        flag: '🇬🇧',
        type: 'Standard Visitor',
        duration: '6 Months',
        processing: '15-20 Working Days',
        price: 18000,
        requirements: ['Valid Passport', 'Bank Statement (6 months)', 'ITR', 'Employment Letter', 'Travel Insurance'],
        active: true
      },
      {
        id: 7,
        country: 'USA',
        flag: '🇺🇸',
        type: 'B1/B2 Visa',
        duration: '10 Years',
        processing: 'Interview Based',
        price: 22000,
        requirements: ['Valid Passport', 'DS-160 Form', 'Bank Statement', 'Interview Appointment'],
        active: true
      },
      {
        id: 8,
        country: 'Schengen',
        flag: '🇪🇺',
        type: 'Tourist Visa',
        duration: '90 Days',
        processing: '10-15 Working Days',
        price: 12000,
        requirements: ['Valid Passport', 'Travel Insurance', 'Bank Statement', 'Flight Booking', 'Hotel Booking'],
        active: true
      }
    ];
  });

  const [editingVisa, setEditingVisa] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { formatCurrency } = useLanguage();

  const emptyVisa = {
    id: null,
    country: '',
    flag: '🏳️',
    type: '',
    duration: '',
    processing: '',
    price: 0,
    requirements: [],
    active: true
  };

  useEffect(() => {
    localStorage.setItem('visaPricing', JSON.stringify(visas));
  }, [visas]);

  const handleSaveVisa = () => {
    if (editingVisa.id) {
      setVisas(prev => prev.map(v => v.id === editingVisa.id ? editingVisa : v));
    } else {
      const newId = Math.max(...visas.map(v => v.id), 0) + 1;
      setVisas(prev => [...prev, { ...editingVisa, id: newId }]);
    }
    setShowEditor(false);
    setEditingVisa(null);
  };

  const handleDeleteVisa = (id) => {
    if (window.confirm('Are you sure you want to delete this visa?')) {
      setVisas(prev => prev.filter(v => v.id !== id));
    }
  };

  const addRequirement = () => {
    const req = prompt('Enter requirement:');
    if (req) {
      setEditingVisa(prev => ({
        ...prev,
        requirements: [...prev.requirements, req]
      }));
    }
  };

  const removeRequirement = (index) => {
    setEditingVisa(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const filteredVisas = visas.filter(v =>
    v.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const countryFlags = ['🇹🇭', '🇲🇾', '🇸🇬', '🇦🇪', '🇮🇳', '🇬🇧', '🇺🇸', '🇪🇺', '🇨🇦', '🇦🇺', '🇯🇵', '🇰🇷', '🇨🇳', '🇹🇷', '🇪🇬', '🇿🇦', '🇧🇷', '🇲🇻', '🇱🇰', '🇳🇵', '🇧🇹', '🏳️'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Visa Pricing</h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage visa services and pricing for different countries</p>
          </div>
          <button
            onClick={() => { setEditingVisa(emptyVisa); setShowEditor(true); }}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Visa
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by country or visa type..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          />
        </div>

        {/* Visa Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVisas.map(visa => (
            <motion.div
              key={visa.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border p-5 ${!visa.active ? 'opacity-60' : ''} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{visa.flag}</span>
                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{visa.country}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{visa.type}</p>
                  </div>
                </div>
                {!visa.active && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Inactive</span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{visa.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">Processing:</span>
                  <span className="text-white">{visa.processing}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary-400">{formatCurrency(visa.price)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingVisa(visa); setShowEditor(true); }}
                  className="flex-1 py-2 bg-primary-500/20 text-primary-400 rounded-lg flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteVisa(visa.id)}
                  className="py-2 px-3 bg-red-500/20 text-red-400 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Editor Modal */}
        <AnimatePresence>
          {showEditor && editingVisa && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEditor(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Editor Header */}
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {editingVisa.id ? 'Edit Visa' : 'Add New Visa'}
                  </h2>
                  <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Editor Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                      <input
                        type="text"
                        value={editingVisa.country}
                        onChange={(e) => setEditingVisa(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Flag</label>
                      <select
                        value={editingVisa.flag}
                        onChange={(e) => setEditingVisa(prev => ({ ...prev, flag: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-2xl"
                      >
                        {countryFlags.map(flag => (
                          <option key={flag} value={flag}>{flag}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Visa Type</label>
                      <input
                        type="text"
                        value={editingVisa.type}
                        onChange={(e) => setEditingVisa(prev => ({ ...prev, type: e.target.value }))}
                        placeholder="e.g., Tourist Visa, E-Visa"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                      <input
                        type="text"
                        value={editingVisa.duration}
                        onChange={(e) => setEditingVisa(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 30 Days, 6 Months"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Processing Time</label>
                      <input
                        type="text"
                        value={editingVisa.processing}
                        onChange={(e) => setEditingVisa(prev => ({ ...prev, processing: e.target.value }))}
                        placeholder="e.g., 3-5 Working Days"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Price ({SAUDI_RIYAL_SYMBOL})</label>
                      <input
                        type="number"
                        value={editingVisa.price}
                        onChange={(e) => setEditingVisa(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Requirements</label>
                      <button onClick={addRequirement} className="text-primary-400 text-sm">+ Add Requirement</button>
                    </div>
                    <div className="space-y-2">
                      {editingVisa.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="flex-1 text-gray-300">{req}</span>
                          <button onClick={() => removeRequirement(index)} className="text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingVisa.active}
                      onChange={(e) => setEditingVisa(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-gray-300">Active (visible on website)</span>
                  </label>
                </div>

                {/* Editor Footer */}
                <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="px-6 py-3 bg-slate-700 text-white rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveVisa}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Visa
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminVisas;
