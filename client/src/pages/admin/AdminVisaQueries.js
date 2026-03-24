import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, Search, Eye, Check, X,
  User, Globe, FileCheck, RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';

const AdminVisaQueries = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const { formatCurrency } = useLanguage();

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('visaApplications');
    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  const updateStatus = (id, status) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status } : app
    );
    setApplications(updated);
    localStorage.setItem('visaApplications', JSON.stringify(updated));
  };

  const deleteApplication = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      const updated = applications.filter(app => app.id !== id);
      setApplications(updated);
      localStorage.setItem('visaApplications', JSON.stringify(updated));
      setSelectedApp(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.visa?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-500/20 text-green-400';
      case 'Rejected': return 'bg-red-500/20 text-red-400';
      case 'Processing': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Visa Applications</h1>
            <p className="text-gray-500 mt-1">Manage submitted visa applications</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const saved = localStorage.getItem('visaApplications');
                if (saved) setApplications(JSON.parse(saved));
              }}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', count: applications.length, color: 'bg-primary-500' },
            { label: 'Pending', count: applications.filter(a => a.status === 'Pending').length, color: 'bg-yellow-500' },
            { label: 'Processing', count: applications.filter(a => a.status === 'Processing').length, color: 'bg-blue-500' },
            { label: 'Approved', count: applications.filter(a => a.status === 'Approved').length, color: 'bg-green-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.count}</p>
              <div className={`h-1 w-12 ${stat.color} rounded-full mt-2`} />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or visa type..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Applications Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardList className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No Applications</h3>
              <p className="text-gray-500 dark:text-gray-400">No visa applications have been submitted yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Applicant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Visa</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Travel Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Fee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">{app.fullName}</p>
                          <p className="text-sm text-gray-500">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-800 dark:text-white">{app.visa}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-800 dark:text-white">{app.travelDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-primary-500">{formatCurrency(app.price || 0)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 bg-primary-500/10 text-primary-500 rounded-lg hover:bg-primary-500/20"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'Approved')}
                            className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'Rejected')}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Application Details</h2>
                <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => {
                      updateStatus(selectedApp.id, e.target.value);
                      setSelectedApp({...selectedApp, status: e.target.value});
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl text-slate-800 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Personal Info */}
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Full Name</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date of Birth</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.dateOfBirth}</p>
                    </div>
                  </div>
                </div>

                {/* Passport Info */}
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <FileCheck className="w-4 h-4" /> Passport Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Passport Number</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.passportNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expiry Date</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.passportExpiry}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Nationality</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.nationality}</p>
                    </div>
                  </div>
                </div>

                {/* Travel Info */}
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Travel Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Destination</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.visa}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Purpose</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.purpose}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Travel Date</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.travelDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Return Date</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.returnDate}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Accommodation</span>
                      <p className="text-slate-800 dark:text-white font-medium">{selectedApp.accommodation || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Fee */}
                <div className="flex items-center justify-between p-4 bg-primary-500/10 rounded-xl">
                  <span className="text-slate-800 dark:text-white font-medium">Processing Fee</span>
                  <span className="text-2xl font-bold text-primary-500">{formatCurrency(selectedApp.price || 0)}</span>
                </div>

                {/* Applied Date */}
                <div className="text-sm text-gray-500 text-center">
                  Applied on: {new Date(selectedApp.appliedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex gap-3">
                <button
                  onClick={() => deleteApplication(selectedApp.id)}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
                >
                  Delete Application
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVisaQueries;
