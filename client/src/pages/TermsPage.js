import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Shield, CreditCard, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const TermsPage = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const sections = [
    {
      icon: FileText,
      title: 'Booking Terms',
      title_bn: 'বুকিং শর্তাবলী',
      content: [
        'All bookings are subject to availability and confirmation.',
        'Full payment is required at the time of booking unless otherwise specified.',
        'Booking confirmation will be sent via email within 24 hours.',
        'Please verify all details in your booking confirmation carefully.'
      ],
      content_bn: [
        'সব বুকিং প্রাপ্যতা এবং নিশ্চিতকরণ সাপেক্ষে।',
        'অন্যথায় নির্দিষ্ট না করা হলে বুকিংয়ের সময় সম্পূর্ণ পেমেন্ট প্রয়োজন।',
        'বুকিং নিশ্চিতকরণ ২৪ ঘণ্টার মধ্যে ইমেইলের মাধ্যমে পাঠানো হবে।',
        'আপনার বুকিং নিশ্চিতকরণে সমস্ত বিবরণ সাবধানে যাচাই করুন।'
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment Policy',
      title_bn: 'পেমেন্ট নীতি',
      content: [
        'We accept bank transfers, credit/debit cards, and mobile banking.',
        'All prices are in Saudi Riyal (SAR) unless otherwise stated.',
        'EMI options are available on selected bank cards.',
        'Payment receipts will be issued for all transactions.'
      ],
      content_bn: [
        'আমরা ব্যাংক ট্রান্সফার, ক্রেডিট/ডেবিট কার্ড এবং মোবাইল ব্যাংকিং গ্রহণ করি।',
        'ما لم يُذكر خلاف ذلك، فإن جميع الأسعار بالريال السعودي (SAR).',
        'নির্বাচিত ব্যাংক কার্ডে ইএমআই অপশন উপলব্ধ।',
        'সব লেনদেনের জন্য পেমেন্ট রসিদ প্রদান করা হবে।'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Cancellation Policy',
      title_bn: 'বাতিল নীতি',
      content: [
        'Cancellation charges apply based on the timing of cancellation.',
        'More than 30 days before departure: 10% cancellation fee.',
        '15-30 days before departure: 25% cancellation fee.',
        '7-14 days before departure: 50% cancellation fee.',
        'Less than 7 days: No refund applicable.'
      ],
      content_bn: [
        'বাতিলের সময়ের উপর ভিত্তি করে বাতিল চার্জ প্রযোজ্য।',
        'প্রস্থানের ৩০ দিনের বেশি আগে: ১০% বাতিল ফি।',
        'প্রস্থানের ১৫-৩০ দিন আগে: ২৫% বাতিল ফি।',
        'প্রস্থানের ৭-১৪ দিন আগে: ৫০% বাতিল ফি।',
        '৭ দিনের কম: কোন রিফান্ড প্রযোজ্য নয়।'
      ]
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      title_bn: 'গোপনীয়তা ও নিরাপত্তা',
      content: [
        'Your personal information is protected and never shared with third parties.',
        'All payment transactions are encrypted and secure.',
        'We comply with local data protection regulations.',
        'You can request deletion of your data at any time.'
      ],
      content_bn: [
        'আপনার ব্যক্তিগত তথ্য সুরক্ষিত এবং তৃতীয় পক্ষের সাথে কখনও শেয়ার করা হয় না।',
        'সব পেমেন্ট লেনদেন এনক্রিপ্টেড এবং নিরাপদ।',
        'আমরা স্থানীয় ডেটা সুরক্ষা বিধি মেনে চলি।',
        'আপনি যেকোনো সময় আপনার ডেটা মুছে ফেলার অনুরোধ করতে পারেন।'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Service | Sabir Travels</title>
        <meta name="description" content="Read Sabir Travels terms of service, booking policies, and cancellation terms." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FileText className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {language === 'bn' ? 'সেবার শর্তাবলী' : 'Terms of Service'}
            </h1>
            <p className="text-xl text-white/80">
              {language === 'bn' 
                ? 'সর্বশেষ আপডেট: ডিসেম্বর ২০২৪'
                : 'Last updated: December 2024'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`mb-8 p-8 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'bn' ? section.title_bn : section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {(language === 'bn' ? section.content_bn : section.content).map((item, i) => (
                    <li key={i} className={`flex items-start ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="w-2 h-2 mt-2 mr-3 bg-primary-500 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl text-center ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}
          >
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {language === 'bn' ? 'প্রশ্ন আছে?' : 'Have Questions?'}
            </h3>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'bn' 
                ? 'আমাদের সাথে যোগাযোগ করুন legal@exploreholidays.com'
                : 'Contact us at legal@exploreholidays.com'}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TermsPage;
