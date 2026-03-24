import React, { useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import { GradientProvider } from './context/GradientContext';
import { BookingProvider } from './context/BookingContext';
import { AIAgentProvider } from './context/AIAgentContext';
import { normalizeSaudiCurrencySettings } from './utils/currency';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import AIChatWidget from './components/support/AIChatWidget';

// Pages
import HomePage from './pages/HomePage';
import FlightsPage from './pages/FlightsPage';
import HolidaysPage from './pages/HolidaysPage';
import VisasPage from './pages/VisasPage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import LandPackagesPage from './pages/LandPackagesPage';
import GroupToursPage from './pages/GroupToursPage';
import ServicesPage from './pages/ServicesPage';
import PartnersPage from './pages/PartnersPage';
import PackageDetailPage from './pages/PackageDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VisaApplicationPage from './pages/VisaApplicationPage';
import FlightSearchResults from './pages/FlightSearchResults';
import FlightBooking from './pages/FlightBooking';
import CareersPage from './pages/CareersPage';
import PrivacyPage from './pages/PrivacyPage';
import MyBookingsPage from './pages/MyBookingsPage';
import HotelBookingPage from './pages/HotelBookingPage';
import TravelInsurancePage from './pages/TravelInsurancePage';
import CarRentalPage from './pages/CarRentalPage';
import TourGuidePage from './pages/TourGuidePage';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQueries from './pages/admin/AdminQueries';
import AdminBookings from './pages/admin/AdminBookings';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHolidays from './pages/admin/AdminHolidays';
import AdminVisas from './pages/admin/AdminVisas';
import AdminVisaQueries from './pages/admin/AdminVisaQueries';
import AdminFlightBookings from './pages/admin/AdminFlightBookings';
import AdminAIAgent from './pages/admin/AdminAIAgent';
import AdminAgentChats from './pages/admin/AdminAgentChats';

const defaultSiteSettings = {
  siteTitle: 'Sabir Travels',
  siteName: 'Sabir Travels',
  tagline: 'Your trusted travel partner in Saudi Arabia',
  taglineAr: 'شريكك الموثوق للسفر في المملكة العربية السعودية',
  currencyCode: 'SAR',
  currencySymbol: '⃁',
  locale: 'en-SA',
  phone: '+966 55 123 4567',
  email: 'info@sabirtravels.sa',
  address: 'Olaya Street, Riyadh 12214, Saudi Arabia',
  footerText: 'Premium travel services tailored for Saudi Arabia and Gulf travelers.',
  copyrightText: '© 2024 Sabir Travels. All rights reserved.'
};

const normalizeSiteSettings = (settings = {}) => {
  const merged = { ...defaultSiteSettings, ...settings };
  const legacyNames = ['Ahmed Essa Travel', 'Explore Holidays'];
  const legacyEmails = ['info@ahmedessatravel.sa', 'info@exploreholidays.com'];

  if (!merged.siteName || legacyNames.includes(merged.siteName)) {
    merged.siteName = defaultSiteSettings.siteName;
  }

  if (!merged.siteTitle || legacyNames.includes(merged.siteTitle)) {
    merged.siteTitle = defaultSiteSettings.siteTitle;
  }

  if (!merged.email || legacyEmails.includes(merged.email)) {
    merged.email = defaultSiteSettings.email;
  }

  if (!merged.tagline || merged.tagline === 'Your Premium Travel Partner') {
    merged.tagline = defaultSiteSettings.tagline;
  }

  if (!merged.taglineAr) {
    merged.taglineAr = defaultSiteSettings.taglineAr;
  }

  return normalizeSaudiCurrencySettings(merged);
};

function App() {
  const { isDark } = useTheme();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        const normalizedSavedSettings = normalizeSiteSettings(JSON.parse(savedSettings));
        localStorage.setItem('siteSettings', JSON.stringify(normalizedSavedSettings));
      } catch (error) {
        localStorage.setItem('siteSettings', JSON.stringify(defaultSiteSettings));
      }
    } else {
      localStorage.setItem('siteSettings', JSON.stringify(defaultSiteSettings));
    }

    const hydrateSiteSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        const { partners, ...settings } = response.data.data;
        localStorage.setItem('siteSettings', JSON.stringify(normalizeSiteSettings(settings)));
        localStorage.setItem('sitePartners', JSON.stringify(partners));
      } catch (error) {
      }
    };

    hydrateSiteSettings();
  }, []);

  return (
    <AuthProvider>
      <BookingProvider>
        <AdminProvider>
          <GradientProvider>
            <AIAgentProvider>
            <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
            <ScrollToTop />
            <Helmet>
            <title>Sabir Travels | Premium Travel Booking from Saudi Arabia</title>
            <meta name="description" content="Book flights, holiday packages, visas, and tours from Saudi Arabia with Sabir Travels. Your trusted Arabic-first travel partner." />
          </Helmet>
          
          {!isAdminRoute && <Header />}
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/flights/search" element={<FlightSearchResults />} />
              <Route path="/flights/book/:id" element={<ProtectedRoute><FlightBooking /></ProtectedRoute>} />
              <Route path="/holidays" element={<HolidaysPage />} />
              <Route path="/visas" element={<VisasPage />} />
              <Route path="/visa-apply/:country" element={<ProtectedRoute><VisaApplicationPage /></ProtectedRoute>} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/land-packages" element={<LandPackagesPage />} />
              <Route path="/group-tours" element={<GroupToursPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/hotels" element={<HotelBookingPage />} />
              <Route path="/services/insurance" element={<TravelInsurancePage />} />
              <Route path="/services/car-rental" element={<CarRentalPage />} />
              <Route path="/services/tour-guide" element={<TourGuidePage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/holidays/:id" element={<PackageDetailPage />} />
              <Route path="/package/:id" element={<PackageDetailPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/queries" element={<AdminQueries />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/invoices" element={<AdminInvoices />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/holidays" element={<AdminHolidays />} />
              <Route path="/admin/visas" element={<AdminVisas />} />
              <Route path="/admin/visa-queries" element={<AdminVisaQueries />} />
              <Route path="/admin/flight-bookings" element={<AdminFlightBookings />} />
              <Route path="/admin/ai-agent" element={<AdminAIAgent />} />
              <Route path="/admin/agent-chats" element={<AdminAgentChats />} />
            </Routes>
          </main>
          
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <AIChatWidget />}
            </div>
            </AIAgentProvider>
          </GradientProvider>
        </AdminProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
