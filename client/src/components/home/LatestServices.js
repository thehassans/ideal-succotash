import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Palmtree, 
  FileCheck, 
  Building2, 
  Users, 
  Shield,
  Car,
  ArrowRight,
  Sparkles,
  Star
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGradient } from '../../context/GradientContext';
import axios from 'axios';

const iconMap = {
  Plane: Plane,
  Palmtree: Palmtree,
  FileCheck: FileCheck,
  Building2: Building2,
  Users: Users,
  Shield: Shield,
  Car: Car
};

const LatestServices = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { useGradients } = useGradient();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services?latest=true');
        setServices(response.data.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback data
        setServices([
          {
            id: 1,
            title: 'Flight Booking',
            title_bn: 'حجز الرحلات',
            description: 'Book domestic and international flights at best prices',
            description_bn: 'احجز الرحلات الداخلية والدولية بأسعار تنافسية وخدمة موثوقة',
            icon: "Plane",
            path: "/flights"
          },
          {
            id: 2,
            title: 'Holiday Packages',
            title_bn: 'باقات العطلات',
            description: 'Curated holiday packages for every budget',
            description_bn: 'باقات عطلات مصممة بعناية لتناسب مختلف الميزانيات والأذواق',
            icon: "Palmtree",
            path: "/holidays"
          },
          {
            id: 3,
            title: 'Visa Services',
            title_bn: 'خدمات التأشيرات',
            description: 'Hassle-free visa processing for all countries',
            description_bn: 'إجراءات تأشيرات سلسة ومنظمة لمختلف الدول والوجهات',
            icon: "FileCheck",
            path: "/visas"
          },
          {
            id: 4,
            title: 'Hotel Booking',
            title_bn: 'حجز الفنادق',
            description: 'Premium hotels and resorts worldwide',
            description_bn: 'فنادق ومنتجعات مختارة حول العالم لإقامة مريحة وفاخرة',
            icon: "Building2",
            path: "/services/hotels"
          },
          {
            id: 5,
            title: 'Travel Insurance',
            title_bn: 'تأمين السفر',
            description: 'Comprehensive travel insurance coverage',
            description_bn: 'خطط تأمين سفر شاملة تمنحك راحة أكبر أثناء رحلتك',
            icon: "Shield",
            path: "/services/insurance"
          },
          {
            id: 6,
            title: 'Car Rental',
            title_bn: 'تأجير السيارات',
            description: 'Comfortable transportation options',
            description_bn: 'خيارات تنقل مريحة ومرنة تناسب الأفراد والعائلات',
            icon: "Car",
            path: "/services/car-rental"
          },
          {
            id: 7,
            title: 'Tour Guide',
            title_bn: 'مرشد سياحي',
            description: 'Expert local guides for memorable trips',
            description_bn: 'مرشدون محترفون يساعدونك على الاستمتاع بكل لحظة من رحلتك',
            icon: "Users",
            path: "/services/tour-guide"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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

  const gradientColors = [
    'from-blue-500 to-cyan-500',
    'from-orange-500 to-red-500',
    'from-purple-500 to-indigo-500',
    'from-green-500 to-emerald-500',
    'from-pink-500 to-rose-500',
    'from-yellow-500 to-orange-500'
  ];

  return (
    <section className={`py-24 relative overflow-hidden ${isDark ? useGradients ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-slate-900' : useGradients ? 'bg-gradient-to-b from-white to-gray-50' : 'bg-slate-50'}`}>
      {/* Background Elements */}
      {useGradients && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>
      )}
      
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
            className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold mb-6 ${useGradients ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-500' : 'bg-slate-900 text-white border-0'}`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'خدماتنا' : 'Our Services'}
            <Star className="w-4 h-4 ml-2 fill-current" />
          </motion.span>
          <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === 'bn' ? 'خدمات سفر متكاملة' : 'Premium Travel Services'}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'bn' 
              ? 'نوفر لك حلول سفر متكاملة تبدأ من الحجز وتنتهي بتجربة سفر مريحة وآمنة'
              : 'World-class services to make your travel experience unforgettable'}
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-2xl p-8 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <div className="w-16 h-16 rounded-2xl bg-gray-300 dark:bg-slate-600 mb-6" />
                <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-full" />
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
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Plane;
              const gradient = gradientColors[index % gradientColors.length];
              
              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className={`group relative p-8 rounded-3xl transition-all duration-500 overflow-hidden ${
                    isDark 
                      ? 'bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600' 
                      : 'bg-white hover:shadow-2xl border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Glow Effect */}
                  {useGradients && <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />}
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl ${
                      useGradients ? `bg-gradient-to-br ${gradient}` : 'bg-primary-500'
                    }`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    {useGradients && <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${gradient} opacity-30 blur-lg`} />}
                  </div>

                  {/* Content */}
                  <h3 className={`text-2xl font-bold mb-3 transition-all ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? service.title_bn : service.title}
                  </h3>
                  <p className={`mb-6 leading-relaxed text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'bn' ? service.description_bn : service.description}
                  </p>

                  {/* Link */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(service.path || '/services');
                    }}
                    className={`inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-sm text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 relative ${
                      useGradients ? `bg-gradient-to-r ${gradient}` : 'bg-primary-500 hover:bg-primary-600'
                    }`}
                  >
                    {language === 'bn' ? 'اعرف المزيد' : 'Learn More'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>

                  {/* Decorative Elements */}
                  {useGradients && <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 bg-gradient-to-br ${gradient} rounded-bl-full`} />}
                  {useGradients && <div className={`absolute bottom-0 left-0 w-24 h-24 opacity-5 bg-gradient-to-tr ${gradient} rounded-tr-full`} />}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Ultra Premium CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 relative overflow-hidden"
        >
          <div className={`absolute inset-0 rounded-3xl ${useGradients ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600' : 'bg-blue-600'}`} />
          {useGradients && <div className="absolute inset-0 opacity-10 rounded-3xl" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}} />}
          
          <div className="relative p-10 lg:p-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            
            <h3 className="text-3xl lg:text-4xl font-black text-white mb-4">
              {language === 'bn' ? 'هل أنت جاهز لتخطيط رحلتك القادمة؟' : 'Ready to Plan Your Dream Vacation?'}
            </h3>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'فريق Sabir Travels جاهز لتصميم برنامج سفر يناسب احتياجاتك وميزانيتك'
                : 'Our travel experts are ready to create the perfect tour for you'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="group px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl flex items-center cursor-pointer"
              >
                {language === 'bn' ? 'تواصل معنا' : 'Contact Us'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/holidays')}
                className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 cursor-pointer"
              >
                {language === 'bn' ? 'تصفح الباقات' : 'Browse Packages'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestServices;
