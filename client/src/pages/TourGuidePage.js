import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Star,
  Clock,
  Globe,
  Award,
  Camera,
  Phone,
  Mail,
  Sparkles,
  Check,
  Languages
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useGradient } from '../context/GradientContext';

const TourGuidePage = () => {
  const { isDark } = useTheme();
  const { language, formatCurrency } = useLanguage();
  const { useGradients } = useGradient();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Guides', name_bn: 'جميع المرشدين' },
    { id: 'city', name: 'City Tours', name_bn: 'جولات المدن' },
    { id: 'adventure', name: 'Adventure', name_bn: 'مغامرات' },
    { id: 'cultural', name: 'Cultural', name_bn: 'ثقافية' },
    { id: 'food', name: 'Food Tours', name_bn: 'جولات الطعام' },
  ];

  const guides = [
    {
      id: 1,
      name: 'Faisal Al-Harbi',
      name_bn: 'فيصل الحربي',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      category: 'city',
      speciality: 'Riyadh Landmarks & Heritage',
      speciality_bn: 'معالم الرياض والتراث',
      languages: ['Arabic', 'English'],
      experience: 12,
      rating: 4.9,
      reviews: 248,
      tours: 520,
      price: 3000,
      priceUnit: 'day',
      bio: 'Experienced city guide for Riyadh museums, historic districts, and premium local experiences.',
      bio_bn: 'مرشد خبير في الرياض يقدم جولات مميزة في المتاحف والأحياء التاريخية والتجارب المحلية الراقية.',
      verified: true
    },
    {
      id: 2,
      name: 'Noura Al-Qahtani',
      name_bn: 'نورة القحطاني',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      category: 'cultural',
      speciality: 'Jeddah Historic District',
      speciality_bn: 'جدة التاريخية',
      languages: ['Arabic', 'English', 'French'],
      experience: 8,
      rating: 4.8,
      reviews: 186,
      tours: 340,
      price: 2500,
      priceUnit: 'day',
      bio: 'Specialist in Jeddah Al-Balad heritage walks, architecture, and traditional Hijazi culture.',
      bio_bn: 'متخصصة في جولات جدة البلد والتراث الحجازي والعمارة التاريخية والحرف التقليدية.',
      verified: true
    },
    {
      id: 3,
      name: 'Majed Al-Anazi',
      name_bn: 'ماجد العنزي',
      photo: 'https://randomuser.me/api/portraits/men/67.jpg',
      category: 'adventure',
      speciality: 'AlUla Adventure Trails',
      speciality_bn: 'مسارات المغامرة في العلا',
      languages: ['Arabic', 'English'],
      experience: 15,
      rating: 4.9,
      reviews: 312,
      tours: 680,
      price: 4000,
      priceUnit: 'day',
      bio: 'Adventure expert for desert landscapes, rock formations, and guided outdoor experiences in AlUla.',
      bio_bn: 'خبير مغامرات في العلا يقدم تجارب صحراوية ومسارات طبيعية وجولات خارجية منظمة باحترافية.',
      verified: true
    },
    {
      id: 4,
      name: 'Sara Al-Shammari',
      name_bn: 'سارة الشمري',
      photo: 'https://randomuser.me/api/portraits/men/45.jpg',
      category: 'food',
      speciality: 'Saudi Cuisine Tours',
      speciality_bn: 'جولات المطبخ السعودي',
      languages: ['Arabic', 'English'],
      experience: 6,
      rating: 4.7,
      reviews: 145,
      tours: 220,
      price: 2000,
      priceUnit: 'day',
      bio: 'Food host specializing in traditional Saudi dishes, coffee experiences, and curated culinary stops.',
      bio_bn: 'مرشدة متخصصة في الأطباق السعودية والقهوة العربية والتجارب الذوقية المختارة بعناية.',
      verified: true
    },
    {
      id: 5,
      name: 'Layan Al-Otaibi',
      name_bn: 'ليان العتيبي',
      photo: 'https://randomuser.me/api/portraits/women/68.jpg',
      category: 'city',
      speciality: 'Abha & Mountain Views',
      speciality_bn: 'أبها والإطلالات الجبلية',
      languages: ['Arabic', 'English'],
      experience: 10,
      rating: 4.8,
      reviews: 198,
      tours: 410,
      price: 3500,
      priceUnit: 'day',
      bio: 'Mountain-region guide focused on Abha scenery, local markets, and family-friendly day tours.',
      bio_bn: 'مرشدة متخصصة في أبها تقدم جولات يومية عائلية تشمل الطبيعة والأسواق المحلية والإطلالات الجبلية.',
      verified: true
    },
    {
      id: 6,
      name: 'Omar Al-Zahrani',
      name_bn: 'عمر الزهراني',
      photo: 'https://randomuser.me/api/portraits/men/52.jpg',
      category: 'adventure',
      speciality: 'Taif Hiking & Nature',
      speciality_bn: 'هايكنج الطبيعة في الطائف',
      languages: ['Arabic', 'English'],
      experience: 9,
      rating: 4.9,
      reviews: 167,
      tours: 290,
      price: 4500,
      priceUnit: 'day',
      bio: 'Outdoor guide for Taif landscapes, hiking routes, and active travelers seeking scenic exploration.',
      bio_bn: 'مرشد أنشطة خارجية في الطائف يقدم مسارات مشي وجولات طبيعية للمسافرين الباحثين عن الاستكشاف والمناظر الجميلة.',
      verified: true
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Certified Guides',
      title_bn: 'مرشدون معتمدون',
      description: 'All guides are licensed and verified',
      description_bn: 'جميع المرشدين موثقون ومعتمدون رسميًا'
    },
    {
      icon: Globe,
      title: 'Local Expertise',
      title_bn: 'خبرة محلية',
      description: 'Deep knowledge of local culture and history',
      description_bn: 'معرفة عميقة بالثقافة المحلية والتاريخ والمعالم'
    },
    {
      icon: Languages,
      title: 'Multilingual',
      title_bn: 'متعددو اللغات',
      description: 'Guides fluent in multiple languages',
      description_bn: 'مرشدون يجيدون أكثر من لغة لخدمة المسافرين بسهولة'
    },
    {
      icon: Camera,
      title: 'Photo Support',
      title_bn: 'مساعدة تصوير',
      description: 'Help capture your best travel moments',
      description_bn: 'مساعدة في توثيق أجمل لحظات رحلتك'
    }
  ];

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>{language === 'bn' ? 'المرشدون السياحيون' : 'Tour Guides'} | Sabir Travels</title>
      </Helmet>

      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        {/* Hero Section */}
        <section className={`relative pt-24 pb-32 overflow-hidden ${
          isDark 
            ? 'bg-slate-900' 
            : useGradients 
              ? 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700'
              : 'bg-slate-900'
        }`}>
          {useGradients && (
            <div className="absolute inset-0">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
            </div>
          )}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                  useGradients ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/10'
                }`}
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
                {language === 'bn' ? 'مرشدون سياحيون خبراء' : 'Expert Tour Guides'}
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                {language === 'bn' 
                  ? 'اكتشف مدن ومعالم المملكة مع مرشدين محليين يجعلون كل رحلة أكثر عمقًا وراحة'
                  : 'Discover Saudi Arabia with local experts who make every journey unforgettable'}
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>{language === 'bn' ? '50+ مرشدًا موثقًا' : '50+ Verified Guides'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>{language === 'bn' ? 'متوسط تقييم 4.8+' : '4.8+ Avg Rating'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-yellow-400" />
                  <span>{language === 'bn' ? 'في مختلف مدن المملكة' : 'Across Saudi Arabia'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 -mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-2xl text-center ${
                    isDark ? 'bg-slate-800' : 'bg-white shadow-xl'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    useGradients 
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      : 'bg-slate-900'
                  }`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? benefit.title_bn : benefit.title}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'bn' ? benefit.description_bn : benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                    selectedCategory === cat.id
                      ? useGradients
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                        : 'bg-slate-900 text-white'
                      : isDark
                        ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'bn' ? cat.name_bn : cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className={`py-16 ${isDark ? 'bg-slate-900/50' : useGradients ? 'bg-gradient-to-b from-gray-50 to-white' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                useGradients 
                  ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600'
                  : 'bg-slate-900 text-white'
              }`}>
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'bn' ? 'مرشدونا' : 'Our Guides'}
              </span>
              <h2 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'bn' ? 'اختر مرشدك المناسب' : 'Choose Your Guide'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`group rounded-3xl overflow-hidden shadow-xl ${
                    isDark ? 'bg-slate-800' : 'bg-white'
                  } hover:shadow-2xl transition-all duration-300`}
                >
                  {/* Header */}
                  <div className={`relative p-6 ${
                    useGradients 
                      ? 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10'
                      : isDark ? 'bg-slate-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-4">
                      {/* Photo */}
                      <div className="relative">
                        <img 
                          src={guide.photo} 
                          alt={guide.name}
                          className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                        />
                        {guide.verified && (
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            useGradients ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-green-500'
                          }`}>
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {language === 'bn' ? guide.name_bn : guide.name}
                        </h3>
                        <p className={`text-sm mb-2 ${useGradients ? 'text-purple-600' : isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                          {language === 'bn' ? guide.speciality_bn : guide.speciality}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className={`ml-1 font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {guide.rating}
                            </span>
                          </div>
                          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            ({guide.reviews} {language === 'bn' ? 'مراجعة' : 'reviews'})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {language === 'bn' ? guide.bio_bn : guide.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {guide.experience} {language === 'bn' ? 'سنوات' : 'years'}
                      </div>
                      <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <MapPin className="w-4 h-4 mr-1" />
                        {guide.tours} {language === 'bn' ? 'جولات' : 'tours'}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {guide.languages.map((lang) => (
                        <span 
                          key={lang}
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                      <div>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {language === 'bn' ? 'لكل يوم' : 'per day'}
                        </span>
                        <p className={`text-2xl font-black ${
                          useGradients 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent'
                            : isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {formatCurrency(guide.price)}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2.5 rounded-xl font-bold text-white ${
                          useGradients 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                            : 'bg-slate-900 hover:bg-slate-800'
                        }`}
                      >
                        {language === 'bn' ? 'احجز الآن' : 'Book Now'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'bn' ? 'كيف تعمل الخدمة' : 'How It Works'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: 'Choose Guide', title_bn: 'اختر المرشد', desc: 'Browse profiles and pick your perfect guide', desc_bn: 'استعرض الملفات الشخصية واختر المرشد الأنسب لرحلتك' },
                { step: 2, title: 'Book & Pay', title_bn: 'احجز وادفع', desc: 'Select dates and complete secure payment', desc_bn: 'حدد التاريخ وأكمل عملية الدفع الآمنة' },
                { step: 3, title: 'Enjoy Tour', title_bn: 'استمتع بالجولة', desc: 'Meet your guide and explore!', desc_bn: 'التقِ بمرشدك وابدأ التجربة بثقة ومتعة' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl font-black text-white ${
                    useGradients 
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      : 'bg-slate-900'
                  }`}>
                    {item.step}
                  </div>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? item.title_bn : item.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'bn' ? item.desc_bn : item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 ${
          useGradients 
            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600'
            : 'bg-slate-900'
        }`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
              {language === 'bn' ? 'هل ترغب في أن تصبح مرشدًا؟' : 'Want to Become a Guide?'}
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              {language === 'bn' 
                ? 'انضم إلى فريق Sabir Travels وساعد الزوار على اكتشاف أجمل وجهات المملكة'
                : 'Join our team and show travelers the beauty of Saudi Arabia'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="tel:+966551234567"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl transition-all"
              >
                <Phone className="w-5 h-5" />
                +966 55 123 4567
              </motion.a>
              <motion.a
                href="mailto:guides@sabirtravels.sa"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
              >
                <Mail className="w-5 h-5" />
                guides@sabirtravels.sa
              </motion.a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TourGuidePage;
