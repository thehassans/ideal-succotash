import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  Send,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGradient } from '../../context/GradientContext';

const Footer = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { useGradients } = useGradient();
  const siteSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem('siteSettings') || '{}');
    } catch (error) {
      return {};
    }
  })();
  const siteName = !siteSettings.siteName || ['Ahmed Essa Travel', 'Explore Holidays'].includes(siteSettings.siteName)
    ? 'Sabir Travels'
    : siteSettings.siteName;
  const tagline = !siteSettings.tagline || siteSettings.tagline === 'Your Premium Travel Partner'
    ? 'Your trusted travel partner in Saudi Arabia'
    : siteSettings.tagline;
  const email = !siteSettings.email || ['info@ahmedessatravel.sa', 'info@exploreholidays.com'].includes(siteSettings.email)
    ? 'info@sabirtravels.sa'
    : siteSettings.email;

  const footerLinks = {
    company: [
      { label: t('footer.aboutUs'), path: '/about' },
      { label: t('footer.contactUs'), path: '/contact' },
      { label: t('footer.termsOfService'), path: '/terms' },
      { label: t('footer.careers'), path: '/careers' },
    ],
    services: [
      { label: t('footer.flights'), path: '/flights' },
      { label: t('footer.holidays'), path: '/holidays' },
      { label: t('footer.landPackages'), path: '/land-packages' },
      { label: t('footer.groupTours'), path: '/group-tours' },
      { label: t('footer.visaServices'), path: '/visas' },
    ],
    usefulLinks: [
      { label: t('footer.support'), path: '/support' },
      { label: t('footer.faq'), path: '/support#faq' },
      { label: t('footer.privacyPolicy'), path: '/privacy' },
      { label: t('section.bankPartners'), path: '/partners#banks' },
      { label: t('section.airlinePartners'), path: '/partners#airlines' },
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className={`relative overflow-hidden ${
      isDark ? 'bg-slate-900' : 'bg-gray-900'
    }`}>
      {/* Decorative Background - only show with gradients */}
      {useGradients && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500 rounded-full filter blur-3xl" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-8">
        {/* Newsletter Section */}
        <div className={`mb-16 p-8 rounded-3xl text-white transition-all duration-500 ${
          useGradients 
            ? 'bg-gradient-to-r from-primary-500 to-accent-500' 
            : 'bg-primary-500'
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{t('footer.newsletter')}</h3>
              <p className="text-white/80">{t('footer.newsletterPlaceholder')}</p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="flex-1 lg:w-80 px-5 py-3 rounded-l-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-r-xl hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <span>{t('footer.subscribe')}</span>
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                useGradients 
                  ? 'rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500' 
                  : 'rounded-xl bg-white'
              }`}>
                <Plane className={`w-6 h-6 transform -rotate-45 ${useGradients ? 'text-white' : 'text-slate-900'}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{siteName}</h2>
                <p className="text-sm text-gray-400">{tagline}</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              {siteSettings.footerText || 'Premium travel services tailored for Saudi Arabia and Gulf travelers.'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span>{siteSettings.address || 'Olaya Street, Riyadh 12214, Saudi Arabia'}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary-500" />
                <span>{siteSettings.phone || '+966 55 123 4567'}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary-500" />
                <span>{email}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 mt-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">{t('footer.services')}</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">{t('footer.usefulLinks')}</h3>
            <ul className="space-y-3">
              {footerLinks.usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Partners */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-gray-500 text-sm mr-2">{t('section.bankPartners')}:</span>
            {[
              { name: 'Al Rajhi Bank', logo: 'https://logo.clearbit.com/alrajhibank.com.sa' },
              { name: 'Saudi National Bank', logo: 'https://logo.clearbit.com/alahli.com' },
              { name: 'Riyad Bank', logo: 'https://logo.clearbit.com/riyadbank.com' },
              { name: 'SAB', logo: 'https://logo.clearbit.com/sab.com' },
              { name: 'stc pay', logo: 'https://logo.clearbit.com/stcpay.com.sa' },
              { name: 'mada', logo: 'https://logo.clearbit.com/mada.com.sa' }
            ].map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                title={partner.name}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              {siteSettings.copyrightText || `(C) ${new Date().getFullYear()} Sabir Travels. ${t('footer.rights')}.`}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-gray-500 text-sm flex items-center">
                {t('footer.madeWith')} <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> {t('footer.inBangladesh')}
              </p>
              <span className="hidden sm:block text-gray-700">|</span>
              <p className="text-gray-500 text-sm">
                Powered by{' '}
                <a 
                  href="https://magnetic-clouds.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  Magnetic Clouds
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
