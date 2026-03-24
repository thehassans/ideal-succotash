import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGradient } from '../../context/GradientContext';
import axios from 'axios';

const PopularPackages = () => {
  const { isDark } = useTheme();
  const { language, formatCurrency } = useLanguage();
  const { useGradients } = useGradient();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/api/packages?popular=true&limit=6');
        setPackages(response.data.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Fallback data
        setPackages([
          {
            id: 1,
            title: 'Dubai City Explorer',
            title_bn: 'رحلة استكشاف دبي',
            destination: 'Dubai, UAE',
            destination_bn: 'دبي، الإمارات',
            price: 85000,
            duration: '4 Days / 3 Nights',
            duration_bn: '4 أيام / 3 ليال',
            image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
            is_popular: true,
            is_featured: true
          },
          {
            id: 2,
            title: 'Maldives Luxury Escape',
            title_bn: 'عطلة فاخرة في المالديف',
            destination: 'Maldives',
            destination_bn: 'المالديف',
            price: 150000,
            duration: '5 Days / 4 Nights',
            duration_bn: '5 أيام / 4 ليال',
            image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
            is_popular: true,
            is_featured: true
          },
          {
            id: 3,
            title: 'Cairo Heritage Escape',
            title_bn: 'رحلة تراثية إلى القاهرة',
            destination: 'Cairo, Egypt',
            destination_bn: 'القاهرة، مصر',
            price: 72000,
            duration: '4 Days / 3 Nights',
            duration_bn: '4 أيام / 3 ليال',
            image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
            is_popular: true,
            is_featured: true
          },
          {
            id: 4,
            title: 'Thailand Tropical Getaway',
            title_bn: 'عطلة استوائية في تايلاند',
            destination: 'Thailand',
            destination_bn: 'تايلاند',
            price: 65000,
            duration: '5 Days / 4 Nights',
            duration_bn: '5 أيام / 4 ليال',
            image_url: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
            is_popular: true,
            is_featured: false
          },
          {
            id: 5,
            title: 'Singapore Family Fun',
            title_bn: 'مغامرة عائلية في سنغافورة',
            destination: 'Singapore',
            destination_bn: 'سنغافورة',
            price: 95000,
            duration: '4 Days / 3 Nights',
            duration_bn: '4 أيام / 3 ليال',
            image_url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
            is_popular: false,
            is_featured: true
          },
          {
            id: 6,
            title: 'Istanbul Cultural Journey',
            title_bn: 'رحلة ثقافية إلى إسطنبول',
            destination: 'Istanbul, Turkey',
            destination_bn: 'إسطنبول، تركيا',
            price: 88000,
            duration: '4 Days / 3 Nights',
            duration_bn: '4 أيام / 3 ليال',
            image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
            is_popular: true,
            is_featured: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className={`py-24 relative overflow-hidden ${isDark ? 'bg-slate-900' : useGradients ? 'bg-gradient-to-b from-gray-50 to-white' : 'bg-slate-50'}`}>
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ultra Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold mb-6 ${useGradients ? 'bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 text-primary-500' : 'bg-slate-900 text-white border-0'}`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'أفضل العروض' : 'Top Picks'}
            <Sparkles className="w-4 h-4 ml-2" />
          </motion.span>
          <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === 'bn' ? 'الباقات الأكثر طلبًا' : 'Popular Packages'}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'bn' 
              ? 'اكتشف الوجهات المختارة بعناية والمفضلة لدى عملائنا'
              : 'Discover our most loved destinations handpicked for you'}
          </p>
        </motion.div>

        {/* Packages Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden animate-pulse ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="h-56 bg-gray-300 dark:bg-slate-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                  isDark ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-white'
                }`}
              >
                {/* Glow Effect */}
                {useGradients && <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-transparent to-purple-500/0 group-hover:from-primary-500/10 group-hover:to-purple-500/10 transition-all duration-500" />}
                
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.image_url}
                    alt={language === 'bn' ? pkg.title_bn : pkg.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 ${useGradients ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' : 'bg-black/40'}`} />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {pkg.is_popular && (
                      <span className={`px-4 py-1.5 text-white text-xs font-bold rounded-full flex items-center shadow-lg ${useGradients ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-slate-900'}`}>
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {language === 'bn' ? 'شائع' : 'HOT'}
                      </span>
                    )}
                    {pkg.is_featured && (
                      <span className={`px-4 py-1.5 text-white text-xs font-bold rounded-full shadow-lg ${useGradients ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'}`}>
                        {language === 'bn' ? 'مميز' : 'FEATURED'}
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 right-4">
                    <div className="px-5 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                      <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {language === 'bn' ? 'ابتداءً من' : 'From'}
                      </span>
                      <div className={`text-2xl font-black ${useGradients ? 'bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent' : 'text-slate-900'}`}>
                        {formatCurrency(pkg.price)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Destination on Image */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center text-white/90 text-sm font-medium">
                      <MapPin className="w-4 h-4 mr-1" />
                      {language === 'bn' ? (pkg.destination_bn || pkg.destination) : pkg.destination}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className={`text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? (pkg.title_bn || pkg.title) : pkg.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4 mr-1.5 text-primary-500" />
                      {language === 'bn' ? (pkg.duration_bn || pkg.duration) : pkg.duration}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/holidays/${pkg.id}`}
                    className={`flex items-center justify-center w-full py-3.5 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-xl group/btn ${useGradients ? 'bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {language === 'bn' ? 'عرض التفاصيل' : 'Explore Now'}
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* See All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/holidays"
            className={`group inline-flex items-center px-10 py-5 text-white font-bold text-lg rounded-2xl transition-all duration-300 relative overflow-hidden ${useGradients ? 'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 hover:shadow-2xl hover:shadow-primary-500/30' : 'bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl'}`}
          >
            {useGradients && <span className="absolute inset-0 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
            <span className="relative">{language === 'bn' ? 'عرض جميع الباقات' : 'View All Packages'}</span>
            <ArrowRight className="relative w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularPackages;
