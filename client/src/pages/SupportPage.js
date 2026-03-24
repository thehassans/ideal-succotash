import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeadphonesIcon, 
  Phone, 
  Mail, 
  MessageCircle,
  ChevronDown,
  Send
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const SupportPage = () => {
  useTranslation();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    {
      question: 'How do I book a holiday package?',
      question_bn: 'আমি কিভাবে হলিডে প্যাকেজ বুক করব?',
      answer: 'You can book a holiday package by visiting our Holidays page, selecting your preferred package, and following the booking process. You can also contact our support team for assistance.',
      answer_bn: 'আপনি আমাদের হলিডে পেজ ভিজিট করে, আপনার পছন্দের প্যাকেজ নির্বাচন করে এবং বুকিং প্রক্রিয়া অনুসরণ করে হলিডে প্যাকেজ বুক করতে পারেন।'
    },
    {
      question: 'What payment methods do you accept?',
      question_bn: 'আপনি কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?',
      answer: 'We accept bank transfers, credit/debit cards, bKash, Nagad, and EMI options from various banks.',
      answer_bn: 'আমরা ব্যাংক ট্রান্সফার, ক্রেডিট/ডেবিট কার্ড, বিকাশ, নগদ এবং বিভিন্ন ব্যাংক থেকে ইএমআই অপশন গ্রহণ করি।'
    },
    {
      question: 'Can I cancel or modify my booking?',
      question_bn: 'আমি কি আমার বুকিং বাতিল বা পরিবর্তন করতে পারি?',
      answer: 'Yes, you can cancel or modify your booking subject to our cancellation policy. Please contact our support team at least 48 hours before your departure date.',
      answer_bn: 'হ্যাঁ, আপনি আমাদের বাতিল নীতি অনুযায়ী আপনার বুকিং বাতিল বা পরিবর্তন করতে পারেন।'
    },
    {
      question: 'How long does visa processing take?',
      question_bn: 'ভিসা প্রসেসিং কতদিন সময় নেয়?',
      answer: 'Visa processing time varies by country. Typically, it ranges from 3-20 business days. Please check our Visa page for specific country requirements.',
      answer_bn: 'ভিসা প্রসেসিং সময় দেশ অনুযায়ী ভিন্ন হয়। সাধারণত, এটি ৩-২০ কার্যদিবস সময় নেয়।'
    },
    {
      question: 'Do you offer travel insurance?',
      question_bn: 'আপনি কি ভ্রমণ বীমা অফার করেন?',
      answer: 'Yes, we offer comprehensive travel insurance packages that cover medical emergencies, trip cancellation, lost baggage, and more.',
      answer_bn: 'হ্যাঁ, আমরা ব্যাপক ভ্রমণ বীমা প্যাকেজ অফার করি যা মেডিকেল ইমার্জেন্সি, ট্রিপ বাতিল, হারানো ব্যাগেজ এবং আরও অনেক কিছু কভার করে।'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await axios.post('/api/inquiries', {
        ...formData,
        source: 'support'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert(language === 'bn' ? 'মেসেজ পাঠানো হয়েছে' : 'Message sent successfully');
    } catch (error) {
      alert(language === 'bn' ? 'মেসেজ পাঠানো যায়নি' : 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Customer Support | Explore Holidays</title>
        <meta name="description" content="24/7 customer support for all your travel needs. Contact Explore Holidays for assistance with bookings, visas, and more." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <HeadphonesIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {language === 'bn' ? 'গ্রাহক সহায়তা' : 'Customer Support'}
            </h1>
            <p className="text-xl text-white/80">
              {language === 'bn' 
                ? 'আমরা আপনাকে সাহায্য করতে এখানে আছি ২৪/৭'
                : "We're here to help you 24/7"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className={`py-16 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Phone, title: 'Call Us', title_bn: 'কল করুন', value: '+880 1234-567890', color: 'from-green-500 to-emerald-500' },
              { icon: Mail, title: 'Email Us', title_bn: 'ইমেইল করুন', value: 'support@exploreholidays.com', color: 'from-blue-500 to-cyan-500' },
              { icon: MessageCircle, title: 'Live Chat', title_bn: 'লাইভ চ্যাট', value: 'Available 24/7', color: 'from-purple-500 to-indigo-500' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`p-8 rounded-2xl text-center ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? item.title_bn : item.title}
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* FAQ Section */}
            <div>
              <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'bn' ? 'সাধারণ প্রশ্ন' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className={`rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className={`w-full p-6 text-left flex items-center justify-between ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      <span className="font-medium">{language === 'bn' ? faq.question_bn : faq.question}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className={`px-6 pb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {language === 'bn' ? faq.answer_bn : faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'bn' ? 'আমাদের মেসেজ করুন' : 'Send us a Message'}
              </h2>
              <form onSubmit={handleSubmit} className={`p-8 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'bn' ? 'নাম' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'
                      } focus:border-primary-500 focus:outline-none`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'bn' ? 'ইমেইল' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'
                      } focus:border-primary-500 focus:outline-none`}
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {language === 'bn' ? 'বিষয়' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'
                    } focus:border-primary-500 focus:outline-none`}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {language === 'bn' ? 'মেসেজ' : 'Message'}
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'
                    } focus:border-primary-500 focus:outline-none resize-none`}
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {submitting ? (language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...') : (language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message')}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportPage;
