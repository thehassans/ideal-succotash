import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  Award, 
  HeadphonesIcon,
  CreditCard,
  MapPin,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGradient } from '../../context/GradientContext';

const WhyChooseUs = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { useGradients } = useGradient();

  const features = [
    {
      icon: Shield,
      title: 'Secure Booking',
      title_bn: 'حجز آمن',
      description: 'Your payment and personal data are protected with industry-leading security',
      description_bn: 'نحمي بياناتك ومدفوعاتك بأعلى معايير الأمان الموثوقة في قطاع السفر',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      title_bn: 'ضمان أفضل سعر',
      description: 'We offer the most competitive prices with price match guarantee',
      description_bn: 'نوفر أسعارًا تنافسية مع التزام واضح بأفضل قيمة لرحلتك',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      title_bn: 'دعم على مدار الساعة',
      description: 'Our dedicated support team is available round the clock to assist you',
      description_bn: 'فريق الدعم لدينا جاهز لمساعدتك في أي وقت قبل السفر وأثناءه وبعده',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      title: 'Easy Booking',
      title_bn: 'حجز سهل وسريع',
      description: 'Book your travel in just a few clicks with our user-friendly platform',
      description_bn: 'احجز رحلتك بخطوات بسيطة عبر منصة واضحة وسهلة الاستخدام',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: CreditCard,
      title: 'Flexible Payment',
      title_bn: 'خيارات دفع مرنة',
      description: 'Multiple payment options including EMI and mobile banking',
      description_bn: 'نوفر وسائل دفع متعددة تناسب الأفراد والعائلات والعملاء من الشركات',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: MapPin,
      title: 'Expert Guidance',
      title_bn: 'استشارات سفر احترافية',
      description: 'Travel experts with local knowledge to plan your perfect trip',
      description_bn: 'خبراء سفر يساعدونك على تخطيط برنامج مناسب لميزانيتك ووجهتك',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <section className={`py-24 relative overflow-hidden transition-all duration-500 ${
      isDark 
        ? (useGradients ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-slate-900') 
        : (useGradients ? 'bg-gradient-to-b from-gray-50 to-white' : 'bg-gray-50')
    }`}>
      {/* Background Decorations */}
      {useGradients && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </>
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
            className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold mb-6 ${useGradients ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-500' : 'bg-slate-900 text-white border-0'}`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'مزايا السفر معنا' : 'Our Benefits'}
            <Sparkles className="w-4 h-4 ml-2" />
          </motion.span>
          <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === 'bn' ? 'لماذا تختار Sabir Travels؟' : 'Why Choose Us?'}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'bn' 
              ? 'نجمع بين الخبرة المحلية والخدمة السريعة والعروض المناسبة لنصنع لك تجربة سفر مريحة وموثوقة'
              : 'We combine trusted expertise, fast support, and competitive offers to make every journey smoother'}
          </p>
        </motion.div>

        {/* Ultra Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative p-8 rounded-3xl transition-all duration-500 overflow-hidden ${
                  isDark 
                    ? 'bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600' 
                    : 'bg-white hover:shadow-2xl border border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Hover Glow */}
                {useGradients && <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />}
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${
                    useGradients ? `bg-gradient-to-br ${feature.color}` : 'bg-primary-500'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {useGradients && <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${feature.color} opacity-40 blur-md`} />}
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'bn' ? feature.title_bn : feature.title}
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'bn' ? feature.description_bn : feature.description}
                </p>

                {/* Decorative Elements */}
                {useGradients && (
                  <>
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-br ${feature.color} opacity-5`} />
                    <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-tr-full bg-gradient-to-tr ${feature.color} opacity-5`} />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8 lg:gap-16"
        >
          {[
            { number: '10+', label: language === 'bn' ? 'سنوات من الخبرة' : 'Years Experience' },
            { number: '50K+', label: language === 'bn' ? 'عميل سعيد' : 'Happy Customers' },
            { number: '100+', label: language === 'bn' ? 'وجهة' : 'Destinations' },
            { number: '99%', label: language === 'bn' ? 'رضا العملاء' : 'Satisfaction' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-center"
            >
              <div className={`text-4xl lg:text-5xl font-black ${useGradients ? 'bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent' : isDark ? 'text-white' : 'text-slate-900'}`}>
                {stat.number}
              </div>
              <div className={`text-sm font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
