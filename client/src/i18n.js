import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      "nav.flights": "Flights",
      "nav.holidays": "Holidays",
      "nav.visas": "Visas",
      "nav.support": "Support",
      
      // Banner
      "banner.title": "Explore the World with Confidence",
      "banner.subtitle": "Premium travel experiences from Saudi Arabia to destinations worldwide",
      "banner.search": "Search",
      "banner.origin": "Origin",
      "banner.destination": "Destination",
      "banner.departDate": "Depart Date",
      "banner.returnDate": "Return Date",
      "banner.passengers": "Passengers",
      "banner.selectOrigin": "Select Origin",
      "banner.selectDestination": "Where to?",
      "banner.selectDate": "Select Date",
      "banner.adult": "Adult",
      "banner.adults": "Adults",
      "banner.child": "Child",
      "banner.children": "Children",
      
      // Sections
      "section.popularPackages": "Popular Packages",
      "section.popularPackagesDesc": "Handpicked destinations loved by travelers",
      "section.latestServices": "Our Services",
      "section.latestServicesDesc": "Comprehensive travel solutions for every need",
      "section.partners": "Our Partners",
      "section.partnersDesc": "Trusted partnerships for your peace of mind",
      "section.bankPartners": "Bank Partners",
      "section.airlinePartners": "Airline Partners",
      
      // Footer
      "footer.company": "Company",
      "footer.aboutUs": "About Us",
      "footer.contactUs": "Contact Us",
      "footer.termsOfService": "Terms of Service",
      "footer.careers": "Careers",
      "footer.services": "Services",
      "footer.flights": "Flight Booking",
      "footer.holidays": "Holiday Packages",
      "footer.landPackages": "Land Packages",
      "footer.groupTours": "Group Tours",
      "footer.visaServices": "Visa Services",
      "footer.usefulLinks": "Useful Links",
      "footer.support": "Support",
      "footer.faq": "FAQ",
      "footer.privacyPolicy": "Privacy Policy",
      "footer.newsletter": "Subscribe to Newsletter",
      "footer.newsletterPlaceholder": "Enter your email",
      "footer.subscribe": "Subscribe",
      "footer.rights": "All rights reserved",
      "footer.madeWith": "Made with",
      "footer.inBangladesh": "in Saudi Arabia",
      
      // Common
      "common.viewDetails": "View Details",
      "common.bookNow": "Book Now",
      "common.perPerson": "per person",
      "common.days": "Days",
      "common.nights": "Nights",
      "common.from": "From",
      "common.popular": "Popular",
      "common.featured": "Featured",
      "common.new": "New",
      "common.learnMore": "Learn More",
      "common.seeAll": "See All",
      "common.loading": "Loading...",
      "common.error": "Something went wrong",
      "common.noResults": "No results found",
      
      // Pages
      "page.home": "Home",
      "page.about": "About",
      "page.contact": "Contact",
      "page.terms": "Terms"
    }
  },
  bn: {
    translation: {
      // Header
      "nav.flights": "الرحلات",
      "nav.holidays": "العطلات",
      "nav.visas": "التأشيرات",
      "nav.support": "الدعم",
      
      // Banner
      "banner.title": "اكتشف العالم بثقة",
      "banner.subtitle": "تجارب سفر فاخرة من المملكة العربية السعودية إلى وجهات حول العالم",
      "banner.search": "بحث",
      "banner.origin": "الانطلاق",
      "banner.destination": "الوجهة",
      "banner.departDate": "تاريخ المغادرة",
      "banner.returnDate": "تاريخ العودة",
      "banner.passengers": "المسافرون",
      "banner.selectOrigin": "اختر نقطة الانطلاق",
      "banner.selectDestination": "إلى أين؟",
      "banner.selectDate": "اختر التاريخ",
      "banner.adult": "بالغ",
      "banner.adults": "بالغون",
      "banner.child": "طفل",
      "banner.children": "أطفال",
      
      // Sections
      "section.popularPackages": "الباقات الشائعة",
      "section.popularPackagesDesc": "وجهات مختارة بعناية يحبها المسافرون",
      "section.latestServices": "خدماتنا",
      "section.latestServicesDesc": "حلول سفر متكاملة لكل احتياج",
      "section.partners": "شركاؤنا",
      "section.partnersDesc": "شراكات موثوقة لراحتك وطمأنينتك",
      "section.bankPartners": "شركاء الدفع والبنوك",
      "section.airlinePartners": "شركاء خطوط الطيران",
      
      // Footer
      "footer.company": "الشركة",
      "footer.aboutUs": "من نحن",
      "footer.contactUs": "اتصل بنا",
      "footer.termsOfService": "شروط الخدمة",
      "footer.careers": "الوظائف",
      "footer.services": "الخدمات",
      "footer.flights": "حجز الرحلات",
      "footer.holidays": "باقات العطلات",
      "footer.landPackages": "الباقات البرية",
      "footer.groupTours": "الجولات الجماعية",
      "footer.visaServices": "خدمات التأشيرات",
      "footer.usefulLinks": "روابط مفيدة",
      "footer.support": "الدعم",
      "footer.faq": "الأسئلة الشائعة",
      "footer.privacyPolicy": "سياسة الخصوصية",
      "footer.newsletter": "اشترك في النشرة البريدية",
      "footer.newsletterPlaceholder": "أدخل بريدك الإلكتروني",
      "footer.subscribe": "اشتراك",
      "footer.rights": "جميع الحقوق محفوظة",
      "footer.madeWith": "صنع بكل حب",
      "footer.inBangladesh": "في المملكة العربية السعودية",
      
      // Common
      "common.viewDetails": "عرض التفاصيل",
      "common.bookNow": "احجز الآن",
      "common.perPerson": "لكل شخص",
      "common.days": "أيام",
      "common.nights": "ليال",
      "common.from": "من",
      "common.popular": "شائع",
      "common.featured": "مميز",
      "common.new": "جديد",
      "common.learnMore": "اعرف المزيد",
      "common.seeAll": "عرض الكل",
      "common.loading": "جارٍ التحميل...",
      "common.error": "حدث خطأ ما",
      "common.noResults": "لم يتم العثور على نتائج",
      
      // Pages
      "page.home": "الرئيسية",
      "page.about": "من نحن",
      "page.contact": "اتصل بنا",
      "page.terms": "الشروط"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') === 'ar' ? 'bn' : (localStorage.getItem('language') || 'bn'),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
