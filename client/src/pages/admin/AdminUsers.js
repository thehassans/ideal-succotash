import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Mail, 
  Calendar,
  UserCheck,
  Phone
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminUsers = () => {
  const { isDark } = useTheme();
  const { getAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        setUsers([]);
      }
    };

    loadUsers();
  }, [getAllUsers]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Registered Users
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage all registered users on the platform
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{users.length}</span>
            <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`mb-6 p-4 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 placeholder-gray-400'
              } border-2 focus:border-primary-500 focus:outline-none transition-colors`}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className={`rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl overflow-hidden`}>
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No Users Found
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                {searchQuery ? 'No users match your search criteria' : 'No users have registered yet'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className={`${isDark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    User
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Email
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Phone
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Provider
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Joined
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-semibold">{user.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ID: {user.id?.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{user.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.provider === 'google'
                          ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                      }`}>
                        {user.provider === 'google' ? (
                          <>
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            </svg>
                            Google
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email Signups</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {users.filter(u => u.provider === 'email').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Google Signups</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {users.filter(u => u.provider === 'google').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active Users</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {users.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </motion.div>
        </div>
    </AdminLayout>
  );
};

export default AdminUsers;
