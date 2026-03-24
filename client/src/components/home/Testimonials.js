import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGradient } from '../../context/GradientContext';

const Testimonials = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { useGradients } = useGradient();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-play testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Rashid Ahmed',
      name_bn: 'راشد أحمد',
      role: 'Business Traveler',
      role_bn: 'مسافر أعمال',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 5,
      review: 'Exceptional service! Sabir Travels made my Dubai business trip seamless. Highly recommended for corporate travel.',
      review_bn: 'خدمة ممتازة جدًا. رتبت Sabir Travels رحلتي العملية إلى دبي باحترافية وسلاسة من البداية حتى النهاية.'
    },
    {
      id: 2,
      name: 'Fatima Khan',
      name_bn: 'فاطمة خان',
      role: 'Family Vacation',
      role_bn: 'رحلة عائلية',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 5,
      review: 'Our family trip to Maldives was absolutely magical. The team took care of every detail. A wonderful agency for family vacations.',
      review_bn: 'كانت رحلتنا العائلية إلى المالديف رائعة بكل التفاصيل. اهتم الفريق بالحجوزات والتنظيم بشكل ممتاز.'
    },
    {
      id: 3,
      name: 'Mohammad Hasan',
      name_bn: 'محمد حسن',
      role: 'Adventure Seeker',
      role_bn: 'محب للمغامرة',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      rating: 5,
      review: 'From visa processing to hotel booking, everything was perfect. The Thailand package exceeded all my expectations!',
      review_bn: 'من التأشيرة إلى الفندق كان كل شيء منظمًا بشكل مثالي. باقة تايلاند تجاوزت توقعاتي بالكامل.'
    },
    {
      id: 4,
      name: 'Nusrat Jahan',
      name_bn: 'نُسرت جهان',
      role: 'Honeymoon Trip',
      role_bn: 'رحلة شهر عسل',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      rating: 5,
      review: 'Our honeymoon in Singapore was unforgettable thanks to Sabir Travels. The attention to detail was impressive!',
      review_bn: 'جعلت Sabir Travels شهر العسل في سنغافورة تجربة لا تُنسى، وكان الاهتمام بالتفاصيل رائعًا جدًا.'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className={`py-24 relative overflow-hidden ${isDark ? useGradients ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-slate-900' : useGradients ? 'bg-gradient-to-b from-white to-gray-50' : 'bg-slate-50'}`}>
      {/* Background Decorations */}
      {useGradients && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
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
            className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold mb-6 ${useGradients ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-500' : 'bg-slate-900 text-white border-0'}`}
          >
            <Star className="w-4 h-4 mr-2 fill-current" />
            {language === 'bn' ? 'آراء العملاء' : 'Customer Reviews'}
            <Sparkles className="w-4 h-4 ml-2" />
          </motion.span>
          <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === 'bn' ? 'تجارب عملائنا مع Sabir Travels' : 'Our Happy Travelers'}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'bn' 
              ? 'قصص حقيقية من مسافرين وثقوا بخدماتنا في الرحلات والعطلات والتأشيرات'
              : 'Thousands of satisfied customers trust us with their travel dreams'}
          </p>
        </motion.div>

        {/* Ultra Premium Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`relative p-8 lg:p-14 rounded-3xl overflow-hidden ${
                isDark ? 'bg-slate-800/80' : 'bg-white'
              } shadow-2xl border ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}
            >
              {/* Background Gradient */}
              {useGradients && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />}
              
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10">
                <Quote className="w-24 h-24 text-amber-500" />
              </div>

              <div className="relative flex flex-col lg:flex-row items-center gap-10">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {useGradients && <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl blur-lg opacity-30" />}
                    <img
                      src={testimonials[currentIndex].image}
                      alt={language === 'bn' ? testimonials[currentIndex].name_bn : testimonials[currentIndex].name}
                      className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-3xl object-cover shadow-2xl ring-4 ring-white/20"
                    />
                    <div className={`absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${useGradients ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-slate-900'}`}>
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Rating */}
                  <div className="flex items-center justify-center lg:justify-start gap-1.5 mb-5">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-amber-400 fill-current drop-shadow-md" />
                    ))}
                    <span className={`ml-2 font-bold ${isDark ? 'text-amber-400' : 'text-amber-500'}`}>5.0</span>
                  </div>

                  {/* Review */}
                  <p className={`text-xl lg:text-2xl leading-relaxed mb-8 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    "{language === 'bn' ? testimonials[currentIndex].review_bn : testimonials[currentIndex].review}"
                  </p>

                  {/* Author */}
                  <div>
                    <h4 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'bn' ? testimonials[currentIndex].name_bn : testimonials[currentIndex].name}
                    </h4>
                    <p className={`text-lg ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      {language === 'bn' ? testimonials[currentIndex].role_bn : testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Premium Navigation Buttons */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Premium Dots */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? useGradients ? 'bg-gradient-to-r from-amber-500 to-orange-500 w-10 shadow-lg' : 'bg-slate-900 w-10 shadow-lg'
                      : isDark
                        ? 'bg-slate-600 hover:bg-slate-500 w-3'
                        : 'bg-gray-300 hover:bg-gray-400 w-3'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
