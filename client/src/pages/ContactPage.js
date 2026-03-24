import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Sparkles,
  CheckCircle,
  Globe,
  Headphones
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ContactPage = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await axios.post('/api/inquiries', {
        ...formData,
        source: 'contact'
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      alert(language === 'bn' ? 'মেসেজ পাঠানো যায়নি' : 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: language === 'bn' ? 'ফোন' : 'Phone', value: '+880 1234-567890', value2: '+880 9876-543210', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Mail, label: language === 'bn' ? 'ইমেইল' : 'Email', value: 'info@exploreholidays.com', value2: 'support@exploreholidays.com', gradient: 'from-purple-500 to-pink-500' },
    { icon: MapPin, label: language === 'bn' ? 'ঠিকানা' : 'Address', value: 'House 42, Road 11', value2: 'Banani, Dhaka 1213', gradient: 'from-amber-500 to-orange-500' },
    { icon: Clock, label: language === 'bn' ? 'সময়' : 'Hours', value: 'Sat - Thu: 9AM - 8PM', value2: 'Friday: Closed', gradient: 'from-green-500 to-emerald-500' }
  ];

  const features = [
    { icon: Headphones, text: language === 'bn' ? '২৪/৭ সাপোর্ট' : '24/7 Support', desc: language === 'bn' ? 'যেকোনো সময় আমাদের সাথে যোগাযোগ করুন' : 'Contact us anytime' },
    { icon: Globe, text: language === 'bn' ? 'বিশ্বব্যাপী সেবা' : 'Global Service', desc: language === 'bn' ? 'বিশ্বের যেকোনো স্থানে' : 'Anywhere in the world' },
    { icon: CheckCircle, text: language === 'bn' ? 'দ্রুত সাড়া' : 'Quick Response', desc: language === 'bn' ? '২৪ ঘন্টার মধ্যে উত্তর' : 'Reply within 24 hours' },
  ];

  return (
    <>
      <Helmet>
        <title>{language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'} | Explore Holidays</title>
        <meta name="description" content="Get in touch with Explore Holidays. Contact us for bookings, inquiries, and support." />
      </Helmet>

      {/* Ultra Premium Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-32 left-[10%] w-20 h-20 bg-white/10 rounded-3xl backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute top-48 right-[15%] w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
          className="absolute bottom-32 left-[20%] w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch'}
              <Sparkles className="w-4 h-4 ml-2" />
            </motion.span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আমরা আপনার যেকোনো প্রশ্নের উত্তর দিতে প্রস্তুত'
                : "We're here to help with any questions you have"}
            </p>
          </motion.div>
          
          {/* Feature Cards */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <Icon className="w-5 h-5 text-white" />
                  <div className="text-left">
                    <p className="text-white font-semibold">{feature.text}</p>
                    <p className="text-white/60 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`py-24 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`relative p-6 rounded-3xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl overflow-hidden group`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.value}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.value2}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Side - Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className={`text-3xl sm:text-4xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'bn' ? 'আমাদের সাথে কথা বলুন' : "Let's Talk"}
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'bn' 
                    ? 'আপনার ভ্রমণ পরিকল্পনা সম্পর্কে জানাতে আমাদের মেসেজ করুন। আমরা আপনার স্বপ্নের ভ্রমণকে বাস্তবে পরিণত করতে সাহায্য করব।'
                    : "Have questions about planning your trip? Send us a message and we'll help make your travel dreams come true."}
                </p>
                
                {/* Social Links */}
                <div className="mb-8">
                  <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? 'সোশ্যাল মিডিয়া' : 'Follow Us'}
                  </h3>
                  <div className="flex gap-3">
                    {[
                      { Icon: Facebook, color: 'hover:bg-blue-500', link: '#' },
                      { Icon: Instagram, color: 'hover:bg-pink-500', link: '#' },
                      { Icon: Twitter, color: 'hover:bg-sky-500', link: '#' }
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.link}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isDark ? 'bg-slate-800' : 'bg-gray-100'
                        } ${social.color} hover:text-white transition-all shadow-lg`}
                      >
                        <social.Icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Office Image/Map Alternative */}
                <div className={`relative rounded-3xl overflow-hidden h-64 ${isDark ? 'bg-slate-800' : 'bg-gradient-to-br from-primary-100 to-purple-100'}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-primary-400' : 'text-primary-500'}`} />
                      <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'bn' ? 'আমাদের অফিস' : 'Our Office'}
                      </h4>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        House 42, Road 11<br />
                        Banani, Dhaka 1213
                      </p>
                      <a 
                        href="https://maps.google.com/?q=Banani,Dhaka" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-4 text-primary-500 hover:text-primary-600 font-semibold"
                      >
                        {language === 'bn' ? 'ম্যাপে দেখুন' : 'View on Map'}
                        <Globe className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className={`relative p-8 lg:p-10 rounded-3xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-2xl overflow-hidden`}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl" />
                
                <div className="relative">
                  <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? 'মেসেজ পাঠান' : 'Send a Message'}
                  </h2>
                  <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'bn' ? 'আমরা ২৪ ঘন্টার মধ্যে উত্তর দেব' : "We'll respond within 24 hours"}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {language === 'bn' ? 'আপনার নাম' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter your name'}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          isDark ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'
                        } focus:border-primary-500 focus:outline-none transition-colors`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {language === 'bn' ? 'ইমেইল' : 'Email'} *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={language === 'bn' ? 'ইমেইল লিখুন' : 'Enter your email'}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          isDark ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'
                        } focus:border-primary-500 focus:outline-none transition-colors`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={language === 'bn' ? 'ফোন নম্বর' : 'Enter phone number'}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          isDark ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'
                        } focus:border-primary-500 focus:outline-none transition-colors`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {language === 'bn' ? 'বিষয়' : 'Subject'} *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={language === 'bn' ? 'বিষয় লিখুন' : 'Enter subject'}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          isDark ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'
                        } focus:border-primary-500 focus:outline-none transition-colors`}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'bn' ? 'আপনার মেসেজ' : 'Your Message'} *
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === 'bn' ? 'আপনার মেসেজ লিখুন...' : 'Write your message here...'}
                      className={`w-full px-5 py-4 rounded-2xl border-2 ${
                        isDark ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'
                      } focus:border-primary-500 focus:outline-none transition-colors resize-none`}
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitted || submitting}
                    className={`w-full py-5 font-bold text-lg rounded-2xl flex items-center justify-center shadow-xl transition-all ${
                      isSubmitted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl'
                    }`}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="w-6 h-6 mr-2" />
                        {language === 'bn' ? 'মেসেজ পাঠানো হয়েছে!' : 'Message Sent!'}
                      </>
                    ) : submitting ? (
                      <>
                        <Send className="w-6 h-6 mr-2 animate-pulse" />
                        {language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
