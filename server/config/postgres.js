const { Pool } = require('pg');
const { createPasswordHash, buildAvatarUrl } = require('../utils/security');

function parseSslConfig() {
  const sslMode = (process.env.PGSSLMODE || '').toLowerCase();

  if (sslMode === 'require') {
    return { rejectUnauthorized: false };
  }

  return false;
}

function createPoolConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: parseSslConfig(),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000
    };
  }

  return {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'explore_holidays',
    ssl: parseSslConfig(),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000
  };
}

const pool = new Pool(createPoolConfig());

const defaultSiteSettings = {
  siteName: 'Ahmed Essa Travel',
  siteTitle: 'Ahmed Essa Travel | Premium Travel Services in Saudi Arabia',
  tagline: 'Your Trusted Travel Partner in Saudi Arabia',
  siteNameAr: 'أحمد عيسى للسفر',
  taglineAr: 'شريكك الموثوق للسفر في المملكة العربية السعودية',
  logo: null,
  favicon: null,
  phone: '+966 55 123 4567',
  email: 'info@ahmedessatravel.sa',
  supportEmail: 'support@ahmedessatravel.sa',
  address: 'Olaya Street, Riyadh 12214, Saudi Arabia',
  addressAr: 'شارع العليا، الرياض 12214، المملكة العربية السعودية',
  facebook: 'https://facebook.com/ahmedessatravel',
  twitter: 'https://twitter.com/ahmedessatravel',
  instagram: 'https://instagram.com/ahmedessatravel',
  youtube: 'https://youtube.com/@ahmedessatravel',
  footerText: 'Premium travel services tailored for Saudi Arabia and Gulf travelers.',
  footerTextAr: 'خدمات سفر متميزة مصممة للمسافرين في المملكة العربية السعودية ودول الخليج.',
  copyrightText: '(C) 2024 Ahmed Essa Travel. All rights reserved.',
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#06b6d4',
  headerBg: '#1e293b',
  footerBg: '#0f172a',
  useGradients: true,
  countryCode: 'SA',
  countryName: 'Saudi Arabia',
  countryNameAr: 'المملكة العربية السعودية',
  defaultLanguage: 'en',
  secondaryLanguage: 'ar',
  currencyCode: 'SAR',
  currencySymbol: '⃁',
  locale: 'en-SA',
  companyName: 'Ahmed Essa Travel',
  companyNameAr: 'أحمد عيسى للسفر',
  companyAddress: 'Olaya Street, Riyadh 12214, Saudi Arabia',
  companyAddressAr: 'شارع العليا، الرياض 12214، المملكة العربية السعودية',
  vatNumber: '300000000000003',
  crNumber: '1010000000',
  taxRate: 15,
  invoicePrefix: 'INV',
  invoiceTerms: 'Thank you for choosing Ahmed Essa Travel.',
  invoiceTermsAr: 'شكراً لاختياركم أحمد عيسى للسفر.',
  zatcaEnabled: true,
  zatcaPhase: 'phase1',
  zatcaQrEnabled: true,
  zatcaPhase2Enabled: false,
  zatcaEnvironment: 'sandbox',
  zatcaDeviceId: '',
  zatcaApiBaseUrl: '',
  zatcaOtp: '',
  zatcaSecret: ''
};

const defaultPartners = [
  { category: 'banks', name: 'Al Rajhi Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Al_Rajhi_Bank_Logo.svg', active: true, sortOrder: 1 },
  { category: 'banks', name: 'Saudi National Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/68/SNB_Logo.svg', active: true, sortOrder: 2 },
  { category: 'banks', name: 'Riyad Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Riyad_Bank_logo.svg', active: true, sortOrder: 3 },
  { category: 'banks', name: 'SAB', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/SABB_logo.svg', active: true, sortOrder: 4 },
  { category: 'banks', name: 'Alinma Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Alinma_Bank.svg', active: true, sortOrder: 5 },
  { category: 'banks', name: 'Bank AlJazira', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Bank_AlJazira_Logo.svg', active: true, sortOrder: 6 },
  { category: 'airlines', name: 'Saudia', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Saudia_Logo.svg', active: true, sortOrder: 1 },
  { category: 'airlines', name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg', active: true, sortOrder: 2 },
  { category: 'airlines', name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Qatar_Airways_logo.svg', active: true, sortOrder: 3 },
  { category: 'airlines', name: 'Etihad Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Etihad_Airways_Logo.svg', active: true, sortOrder: 4 },
  { category: 'airlines', name: 'Flynas', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Flynas_Logo.svg', active: true, sortOrder: 5 },
  { category: 'airlines', name: 'Flydubai', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flydubai_logo.svg', active: true, sortOrder: 6 }
];

function createPackageSeed(data) {
  return {
    title_bn: null,
    destination_bn: null,
    currency: 'SAR',
    rating: 4.7,
    reviewsCount: 120,
    maxPeople: 20,
    isPopular: false,
    isFeatured: false,
    isActive: true,
    highlights: [],
    included: [],
    notIncluded: [],
    itinerary: [],
    gallery: [],
    overview: '',
    overview_bn: null,
    aboutDestination: '',
    aboutDestination_bn: null,
    description: '',
    description_bn: null,
    ...data
  };
}

const packageSeeds = [
  createPackageSeed({
    slug: 'coxs-bazar-beach-paradise',
    title: "Cox's Bazar Beach Paradise",
    title_bn: 'কক্সবাজার সমুদ্র সৈকত প্যারাডাইস',
    destination: "Cox's Bazar, Bangladesh",
    destination_bn: 'কক্সবাজার, বাংলাদেশ',
    price: 25000,
    discountPrice: 25000,
    originalPrice: 32000,
    duration: '3 Days / 2 Nights',
    duration_bn: '৩ দিন / ২ রাত',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    category: 'beach',
    rating: 4.9,
    reviewsCount: 256,
    maxPeople: 20,
    isPopular: true,
    isFeatured: true,
    description: "Experience the world's longest natural sandy beach with luxury accommodation and curated sightseeing.",
    description_bn: 'বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকতে বিলাসবহুল থাকার অভিজ্ঞতা নিন।',
    overview: 'Experience the world-famous beach, luxury resort stays, and curated excursions from Bangladesh.',
    aboutDestination: "Cox's Bazar is Bangladesh's most iconic beach destination, famous for its coastline, seafood, and coastal scenery.",
    highlights: [
      { text: "World's Longest Beach", text_bn: 'বিশ্বের দীর্ঘতম সমুদ্র সৈকত' },
      { text: 'Luxury Beach Resort Stay', text_bn: 'বিলাসবহুল বিচ রিসোর্ট থাকা' },
      { text: 'Inani Beach Visit', text_bn: 'ইনানী সমুদ্র সৈকত পরিদর্শন' },
      { text: 'Sunset Cruise', text_bn: 'সূর্যাস্ত ক্রুজ' }
    ],
    included: [
      { icon: 'Hotel', text: '3-Star Hotel Accommodation', text_bn: '৩-তারা হোটেল থাকার ব্যবস্থা' },
      { icon: 'Utensils', text: 'Breakfast & Dinner', text_bn: 'সকালের নাস্তা ও রাতের খাবার' },
      { icon: 'Plane', text: 'Airport Transfers', text_bn: 'বিমানবন্দর পরিবহন' },
      { icon: 'Users', text: 'Professional Guide', text_bn: 'পেশাদার গাইড' }
    ],
    notIncluded: ['Air Tickets', 'Personal Expenses'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Beach Exploration',
        title_bn: 'আগমন ও সমুদ্র সৈকত অন্বেষণ',
        activities: ['Arrival and hotel check-in', 'Evening beach walk', 'Welcome dinner'],
        activities_bn: ['আগমন ও হোটেলে চেক-ইন', 'সন্ধ্যায় সমুদ্র সৈকতে হাঁটা', 'স্বাগত নৈশভোজ']
      },
      {
        day: 2,
        title: 'Sightseeing Day',
        title_bn: 'দর্শনীয় স্থান ভ্রমণ',
        activities: ['Himchari visit', 'Inani Beach', 'Marine Drive'],
        activities_bn: ['হিমছড়ি ভ্রমণ', 'ইনানী সৈকত', 'মেরিন ড্রাইভ']
      },
      {
        day: 3,
        title: 'Leisure & Departure',
        title_bn: 'অবসর ও প্রস্থান',
        activities: ['Free time', 'Check-out', 'Return transfer'],
        activities_bn: ['অবসর সময়', 'চেক-আউট', 'ফেরত যাত্রা']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'
    ]
  }),
  createPackageSeed({
    slug: 'sundarbans-mangrove-adventure',
    title: 'Sundarbans Mangrove Adventure',
    title_bn: 'সুন্দরবন ম্যানগ্রোভ অ্যাডভেঞ্চার',
    destination: 'Sundarbans, Bangladesh',
    destination_bn: 'সুন্দরবন, বাংলাদেশ',
    price: 35000,
    discountPrice: 35000,
    originalPrice: 42000,
    duration: '4 Days / 3 Nights',
    duration_bn: '৪ দিন / ৩ রাত',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    category: 'adventure',
    rating: 4.8,
    reviewsCount: 189,
    maxPeople: 15,
    isPopular: true,
    description: 'Explore the largest mangrove forest and experience wildlife, boat stays, and guided nature excursions.',
    description_bn: 'বৃহত্তম ম্যানগ্রোভ বন অন্বেষণ করুন এবং নৌকা ও প্রকৃতি ভ্রমণের অভিজ্ঞতা নিন।',
    overview: 'A guided forest and river adventure through the Sundarbans ecosystem.',
    aboutDestination: 'The Sundarbans is a UNESCO World Heritage Site and home to the Royal Bengal Tiger.',
    highlights: [
      { text: 'UNESCO World Heritage Site', text_bn: 'ইউনেস্কো বিশ্ব ঐতিহ্যবাহী স্থান' },
      { text: 'Boat Safari Experience', text_bn: 'নৌকা সাফারি অভিজ্ঞতা' },
      { text: 'Royal Bengal Tiger Habitat', text_bn: 'রয়েল বেঙ্গল টাইগারের আবাসস্থল' }
    ],
    included: [
      { icon: 'Hotel', text: 'Boat Cabin Accommodation', text_bn: 'নৌকা কেবিন থাকার ব্যবস্থা' },
      { icon: 'Utensils', text: 'All Meals Included', text_bn: 'সব খাবার অন্তর্ভুক্ত' },
      { icon: 'Users', text: 'Expert Naturalist Guide', text_bn: 'বিশেষজ্ঞ প্রকৃতিবিদ গাইড' }
    ],
    notIncluded: ['Transport to departure point', 'Tips'],
    itinerary: [
      {
        day: 1,
        title: 'Journey to Sundarbans',
        title_bn: 'সুন্দরবনে যাত্রা',
        activities: ['Travel to Mongla', 'Board the boat', 'Evening wildlife viewing'],
        activities_bn: ['মংলায় যাত্রা', 'নৌকায় আরোহণ', 'সন্ধ্যায় বন্যপ্রাণী দেখা']
      },
      {
        day: 2,
        title: 'Deep Forest Exploration',
        title_bn: 'গভীর বন অন্বেষণ',
        activities: ['Wildlife sanctuary visit', 'Forest trail', 'Bird watching'],
        activities_bn: ['বন্যপ্রাণী অভয়ারণ্য ভ্রমণ', 'বনের পথচলা', 'পাখি দেখা']
      },
      {
        day: 3,
        title: 'Mangrove Discovery',
        title_bn: 'ম্যানগ্রোভ আবিষ্কার',
        activities: ['Tiger point area visit', 'Fishing village experience', 'Night celebration'],
        activities_bn: ['টাইগার পয়েন্ট এলাকা ভ্রমণ', 'মাছ ধরার গ্রাম অভিজ্ঞতা', 'রাতের উদযাপন']
      },
      {
        day: 4,
        title: 'Return Journey',
        title_bn: 'ফেরার যাত্রা',
        activities: ['Breakfast', 'Departure from forest', 'Return to Dhaka'],
        activities_bn: ['সকালের নাস্তা', 'বন থেকে রওনা', 'ঢাকায় ফেরা']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800'
    ]
  }),
  createPackageSeed({
    slug: 'maldives-luxury-escape',
    title: 'Maldives Luxury Escape',
    title_bn: 'মালদ্বীপ বিলাসবহুল অবকাশ',
    destination: 'Maldives',
    destination_bn: 'মালদ্বীপ',
    price: 150000,
    discountPrice: 150000,
    originalPrice: 180000,
    duration: '5 Days / 4 Nights',
    duration_bn: '৫ দিন / ৪ রাত',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    category: 'beach',
    rating: 5,
    reviewsCount: 342,
    maxPeople: 2,
    isPopular: true,
    isFeatured: true,
    description: 'A premium honeymoon-ready island escape with overwater villas and curated luxury experiences.',
    description_bn: 'ওভারওয়াটার ভিলা ও বিলাসবহুল অভিজ্ঞতাসহ প্রিমিয়াম দ্বীপ অবকাশ।',
    overview: 'Luxury Maldives itinerary designed for couples and premium travelers.',
    aboutDestination: "The Maldives is one of the world's most sought-after tropical luxury destinations.",
    highlights: [
      { text: 'Overwater Villa Stay', text_bn: 'ওভারওয়াটার ভিলায় থাকা' },
      { text: 'Private Beach Access', text_bn: 'প্রাইভেট বিচে প্রবেশ' },
      { text: 'Snorkeling & Diving', text_bn: 'স্নরকেলিং ও ডাইভিং' }
    ],
    included: [
      { icon: 'Hotel', text: '5-Star Overwater Villa', text_bn: '৫-তারা ওভারওয়াটার ভিলা' },
      { icon: 'Utensils', text: 'All-Inclusive Meals', text_bn: 'সব খাবার অন্তর্ভুক্ত' },
      { icon: 'Plane', text: 'Return Flights', text_bn: 'ফেরত ফ্লাইট' }
    ],
    notIncluded: ['Visa fee', 'Personal purchases'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Paradise',
        title_bn: 'স্বর্গে আগমন',
        activities: ['Arrival at Male', 'Resort transfer', 'Welcome dinner'],
        activities_bn: ['মালেতে আগমন', 'রিসোর্টে স্থানান্তর', 'স্বাগত নৈশভোজ']
      },
      {
        day: 2,
        title: 'Water Adventures',
        title_bn: 'জল অ্যাডভেঞ্চার',
        activities: ['Snorkeling', 'Spa session', 'Dolphin cruise'],
        activities_bn: ['স্নরকেলিং', 'স্পা সেশন', 'ডলফিন ক্রুজ']
      },
      {
        day: 3,
        title: 'Island Discovery',
        title_bn: 'দ্বীপ আবিষ্কার',
        activities: ['Island hopping', 'Beach picnic', 'Water sports'],
        activities_bn: ['আইল্যান্ড হপিং', 'বিচ পিকনিক', 'ওয়াটার স্পোর্টস']
      },
      {
        day: 4,
        title: 'Relaxation Day',
        title_bn: 'বিশ্রামের দিন',
        activities: ['Private villa time', 'Couples dinner', 'Farewell event'],
        activities_bn: ['প্রাইভেট ভিলায় সময়', 'দম্পতির ডিনার', 'বিদায় অনুষ্ঠান']
      },
      {
        day: 5,
        title: 'Departure',
        title_bn: 'প্রস্থান',
        activities: ['Breakfast', 'Check-out', 'Departure transfer'],
        activities_bn: ['সকালের নাস্তা', 'চেক-আউট', 'ফেরত স্থানান্তর']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800'
    ]
  }),
  createPackageSeed({
    slug: 'dubai-city-explorer',
    title: 'Dubai City Explorer',
    title_bn: 'দুবাই সিটি এক্সপ্লোরার',
    destination: 'Dubai, UAE',
    destination_bn: 'দুবাই, সংযুক্ত আরব আমিরাত',
    price: 85000,
    discountPrice: 85000,
    originalPrice: 98000,
    duration: '4 Days / 3 Nights',
    duration_bn: '৪ দিন / ৩ রাত',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    category: 'city',
    rating: 4.7,
    reviewsCount: 214,
    maxPeople: 18,
    isPopular: true,
    isFeatured: true,
    description: 'Discover the glamour of Dubai with shopping, iconic landmarks, and desert safari.',
    description_bn: 'শপিং, আইকনিক স্থাপনা ও ডেজার্ট সাফারিসহ দুবাইয়ের জাঁকজমক আবিষ্কার করুন।',
    overview: 'A premium city break covering the must-see highlights of Dubai.',
    aboutDestination: 'Dubai offers world-class shopping, skyline attractions, and desert adventures.',
    highlights: [
      { text: 'Burj Khalifa Visit', text_bn: 'বুর্জ খলিফা ভ্রমণ' },
      { text: 'Desert Safari', text_bn: 'ডেজার্ট সাফারি' },
      { text: 'Dubai Marina', text_bn: 'দুবাই মেরিনা' }
    ],
    included: [
      { icon: 'Hotel', text: 'Hotel Stay', text_bn: 'হোটেল থাকার ব্যবস্থা' },
      { icon: 'Camera', text: 'City Tour', text_bn: 'সিটি ট্যুর' },
      { icon: 'Utensils', text: 'Breakfast', text_bn: 'সকালের নাস্তা' }
    ],
    notIncluded: ['Lunch & Dinner', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Arrival', title_bn: 'আগমন', activities: ['Arrival and hotel transfer', 'Evening leisure'], activities_bn: ['আগমন ও হোটেল স্থানান্তর', 'সন্ধ্যায় অবসর'] },
      { day: 2, title: 'City Tour', title_bn: 'সিটি ট্যুর', activities: ['Dubai city tour', 'Burj Khalifa area'], activities_bn: ['দুবাই সিটি ট্যুর', 'বুর্জ খলিফা এলাকা'] },
      { day: 3, title: 'Desert Safari', title_bn: 'ডেজার্ট সাফারি', activities: ['Morning shopping', 'Evening safari'], activities_bn: ['সকালে শপিং', 'সন্ধ্যায় সাফারি'] },
      { day: 4, title: 'Departure', title_bn: 'প্রস্থান', activities: ['Check-out and airport transfer'], activities_bn: ['চেক-আউট ও বিমানবন্দর স্থানান্তর'] }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'
    ]
  }),
  createPackageSeed({
    slug: 'thailand-tropical-getaway',
    title: 'Thailand Tropical Getaway',
    title_bn: 'থাইল্যান্ড ট্রপিক্যাল গেটওয়ে',
    destination: 'Thailand',
    destination_bn: 'থাইল্যান্ড',
    price: 65000,
    discountPrice: 65000,
    originalPrice: 75000,
    duration: '5 Days / 4 Nights',
    duration_bn: '৫ দিন / ৪ রাত',
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    category: 'adventure',
    rating: 4.6,
    reviewsCount: 176,
    maxPeople: 25,
    isPopular: true,
    description: 'Bangkok temples, Phuket beaches, and Thai cuisine adventure in one package.',
    description_bn: 'ব্যাংকক মন্দির, ফুকেট সৈকত এবং থাই খাবারের অভিজ্ঞতা এক প্যাকেজে।',
    overview: 'A classic Thailand getaway for leisure and sightseeing.',
    aboutDestination: 'Thailand offers beaches, nightlife, temples, and accessible international travel.',
    highlights: [
      { text: 'Bangkok City Highlights', text_bn: 'ব্যাংকক সিটি হাইলাইটস' },
      { text: 'Island Excursion', text_bn: 'আইল্যান্ড এক্সকারশন' }
    ],
    included: [
      { icon: 'Hotel', text: 'Hotel Stay', text_bn: 'হোটেল থাকার ব্যবস্থা' },
      { icon: 'Utensils', text: 'Breakfast', text_bn: 'সকালের নাস্তা' },
      { icon: 'Users', text: 'Guided Tours', text_bn: 'গাইডেড ট্যুর' }
    ],
    notIncluded: ['Visa fee'],
    itinerary: [
      { day: 1, title: 'Arrival', title_bn: 'আগমন', activities: ['Arrival and check-in'], activities_bn: ['আগমন ও চেক-ইন'] },
      { day: 2, title: 'Bangkok Tour', title_bn: 'ব্যাংকক ট্যুর', activities: ['Temple visits', 'Local market'], activities_bn: ['মন্দির ভ্রমণ', 'স্থানীয় বাজার'] },
      { day: 3, title: 'Beach Day', title_bn: 'বিচ ডে', activities: ['Beach excursion'], activities_bn: ['সৈকত ভ্রমণ'] },
      { day: 4, title: 'Free Day', title_bn: 'অবসর দিন', activities: ['Shopping and leisure'], activities_bn: ['শপিং ও অবসর'] },
      { day: 5, title: 'Departure', title_bn: 'প্রস্থান', activities: ['Airport transfer'], activities_bn: ['বিমানবন্দর স্থানান্তর'] }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800'
    ]
  }),
  createPackageSeed({
    slug: 'singapore-family-fun',
    title: 'Singapore Family Fun',
    title_bn: 'সিঙ্গাপুর ফ্যামিলি ফান',
    destination: 'Singapore',
    destination_bn: 'সিঙ্গাপুর',
    price: 95000,
    discountPrice: 95000,
    originalPrice: 108000,
    duration: '4 Days / 3 Nights',
    duration_bn: '৪ দিন / ৩ রাত',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    category: 'city',
    rating: 4.8,
    reviewsCount: 201,
    maxPeople: 20,
    isFeatured: true,
    description: 'Universal Studios, Gardens by the Bay, and more family attractions in Singapore.',
    description_bn: 'ইউনিভার্সাল স্টুডিওস ও গার্ডেনস বাই দ্য বেসহ পারিবারিক আকর্ষণ।',
    overview: 'A family-friendly city itinerary with premium attractions.',
    aboutDestination: 'Singapore is known for efficient travel, premium attractions, and a family-friendly city experience.',
    highlights: [
      { text: 'Universal Studios', text_bn: 'ইউনিভার্সাল স্টুডিওস' },
      { text: 'Gardens by the Bay', text_bn: 'গার্ডেনস বাই দ্য বে' }
    ],
    included: [
      { icon: 'Hotel', text: 'Hotel Stay', text_bn: 'হোটেল থাকার ব্যবস্থা' },
      { icon: 'Camera', text: 'Attraction Tickets', text_bn: 'আকর্ষণের টিকিট' }
    ],
    notIncluded: ['Lunch & Dinner'],
    itinerary: [
      { day: 1, title: 'Arrival', title_bn: 'আগমন', activities: ['Arrival and city orientation'], activities_bn: ['আগমন ও সিটি ওরিয়েন্টেশন'] },
      { day: 2, title: 'City Attractions', title_bn: 'সিটি আকর্ষণ', activities: ['Gardens by the Bay', 'Marina Bay'], activities_bn: ['গার্ডেনস বাই দ্য বে', 'মারিনা বে'] },
      { day: 3, title: 'Sentosa Day', title_bn: 'সেন্তোসা ডে', activities: ['Universal Studios'], activities_bn: ['ইউনিভার্সাল স্টুডিওস'] },
      { day: 4, title: 'Departure', title_bn: 'প্রস্থান', activities: ['Airport transfer'], activities_bn: ['বিমানবন্দর স্থানান্তর'] }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800'
    ]
  })
];

const inquirySeeds = [
  {
    name: 'Rashid Ahmed',
    email: 'rashid@example.com',
    phone: '+880 1712345678',
    subject: 'Dubai Package Inquiry',
    message: 'I want to know more about the Dubai package for 4 persons.',
    source: 'contact',
    status: 'pending'
  },
  {
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    phone: '+880 1812345678',
    subject: 'Visa Processing Time',
    message: 'How long does Singapore visa take?',
    source: 'support',
    status: 'replied'
  }
];

async function query(text, params = []) {
  return pool.query(text, params);
}

async function testConnection() {
  const client = await pool.connect();

  try {
    await client.query('SELECT NOW()');
    console.log('PostgreSQL Connected Successfully');
    return true;
  } catch (error) {
    console.error('PostgreSQL Connection Failed:', error.message);
    return false;
  } finally {
    client.release();
  }
}

async function createSchema(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50),
      password_hash TEXT NOT NULL,
      avatar TEXT,
      provider VARCHAR(50) NOT NULL DEFAULT 'email',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id BIGSERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) UNIQUE,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'super_admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id BIGSERIAL PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      session_type VARCHAR(20) NOT NULL,
      user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
      admin_user_id BIGINT REFERENCES admin_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS packages (
      id BIGSERIAL PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      title_bn VARCHAR(255),
      destination VARCHAR(255) NOT NULL,
      destination_bn VARCHAR(255),
      price NUMERIC(12, 2) NOT NULL DEFAULT 0,
      discount_price NUMERIC(12, 2),
      currency VARCHAR(10) NOT NULL DEFAULT 'SAR',
      duration VARCHAR(100) NOT NULL,
      duration_bn VARCHAR(100),
      image_url TEXT,
      category VARCHAR(50) NOT NULL DEFAULT 'holiday',
      rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      max_people INTEGER NOT NULL DEFAULT 10,
      is_popular BOOLEAN NOT NULL DEFAULT FALSE,
      is_featured BOOLEAN NOT NULL DEFAULT FALSE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      description TEXT,
      description_bn TEXT,
      overview TEXT,
      overview_bn TEXT,
      about_destination TEXT,
      about_destination_bn TEXT,
      highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
      included JSONB NOT NULL DEFAULT '[]'::jsonb,
      not_included JSONB NOT NULL DEFAULT '[]'::jsonb,
      itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
      gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS holiday_bookings (
      id BIGSERIAL PRIMARY KEY,
      booking_code VARCHAR(50) NOT NULL UNIQUE,
      user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
      package_id BIGINT REFERENCES packages(id) ON DELETE SET NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50),
      travelers INTEGER NOT NULL DEFAULT 1,
      travel_date DATE NOT NULL,
      special_requests TEXT,
      price_per_person NUMERIC(12, 2) NOT NULL DEFAULT 0,
      total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      source VARCHAR(50) NOT NULL DEFAULT 'contact',
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY,
      site_name VARCHAR(255) NOT NULL,
      site_title VARCHAR(255) NOT NULL,
      tagline VARCHAR(255),
      site_name_ar VARCHAR(255),
      tagline_ar VARCHAR(255),
      logo TEXT,
      favicon TEXT,
      phone VARCHAR(50),
      email VARCHAR(255),
      support_email VARCHAR(255),
      address TEXT,
      address_ar TEXT,
      facebook TEXT,
      twitter TEXT,
      instagram TEXT,
      youtube TEXT,
      footer_text TEXT,
      footer_text_ar TEXT,
      copyright_text TEXT,
      primary_color VARCHAR(20),
      secondary_color VARCHAR(20),
      accent_color VARCHAR(20),
      header_bg VARCHAR(20),
      footer_bg VARCHAR(20),
      use_gradients BOOLEAN NOT NULL DEFAULT TRUE,
      country_code VARCHAR(10) NOT NULL DEFAULT 'SA',
      country_name VARCHAR(100),
      country_name_ar VARCHAR(100),
      default_language VARCHAR(10) NOT NULL DEFAULT 'en',
      secondary_language VARCHAR(10) NOT NULL DEFAULT 'ar',
      currency_code VARCHAR(10) NOT NULL DEFAULT 'SAR',
      currency_symbol VARCHAR(20) NOT NULL DEFAULT '⃁',
      locale VARCHAR(20) NOT NULL DEFAULT 'en-SA',
      company_name VARCHAR(255),
      company_name_ar VARCHAR(255),
      company_address TEXT,
      company_address_ar TEXT,
      vat_number VARCHAR(100),
      cr_number VARCHAR(100),
      tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 15,
      invoice_prefix VARCHAR(20) NOT NULL DEFAULT 'INV',
      invoice_terms TEXT,
      invoice_terms_ar TEXT,
      zatca_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      zatca_phase VARCHAR(20) NOT NULL DEFAULT 'phase1',
      zatca_qr_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      zatca_phase2_enabled BOOLEAN NOT NULL DEFAULT FALSE,
      zatca_environment VARCHAR(20) NOT NULL DEFAULT 'sandbox',
      zatca_device_id TEXT,
      zatca_api_base_url TEXT,
      zatca_otp TEXT,
      zatca_secret TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_name_ar VARCHAR(255)`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS tagline_ar VARCHAR(255)`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address_ar TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_text_ar TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) NOT NULL DEFAULT 'SA'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS country_name VARCHAR(100)`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS country_name_ar VARCHAR(100)`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS default_language VARCHAR(10) NOT NULL DEFAULT 'en'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS secondary_language VARCHAR(10) NOT NULL DEFAULT 'ar'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS currency_code VARCHAR(10) NOT NULL DEFAULT 'SAR'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS currency_symbol VARCHAR(20) NOT NULL DEFAULT '⃁'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS locale VARCHAR(20) NOT NULL DEFAULT 'en-SA'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS company_name VARCHAR(255)`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS company_name_ar VARCHAR(255)`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS company_address TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS company_address_ar TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS vat_number VARCHAR(100)`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS cr_number VARCHAR(100)`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 15`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS invoice_prefix VARCHAR(20) NOT NULL DEFAULT 'INV'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS invoice_terms TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS invoice_terms_ar TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_enabled BOOLEAN NOT NULL DEFAULT TRUE`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_phase VARCHAR(20) NOT NULL DEFAULT 'phase1'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_qr_enabled BOOLEAN NOT NULL DEFAULT TRUE`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_phase2_enabled BOOLEAN NOT NULL DEFAULT FALSE`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_environment VARCHAR(20) NOT NULL DEFAULT 'sandbox'`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_device_id TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_api_base_url TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_otp TEXT`);
  await client.query(`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS zatca_secret TEXT`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS partners (
      id BIGSERIAL PRIMARY KEY,
      category VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      logo TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(category, name)
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id BIGSERIAL PRIMARY KEY,
      invoice_number VARCHAR(100) NOT NULL UNIQUE,
      booking_id BIGINT REFERENCES holiday_bookings(id) ON DELETE SET NULL,
      booking_code VARCHAR(50),
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255),
      customer_phone VARCHAR(50),
      package_title VARCHAR(255),
      package_title_ar VARCHAR(255),
      currency_code VARCHAR(10) NOT NULL DEFAULT 'SAR',
      language_mode VARCHAR(20) NOT NULL DEFAULT 'bilingual',
      issue_date DATE NOT NULL,
      due_date DATE,
      status VARCHAR(50) NOT NULL DEFAULT 'issued',
      payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
      subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
      tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 15,
      tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
      notes TEXT,
      notes_ar TEXT,
      seller_name VARCHAR(255),
      seller_name_ar VARCHAR(255),
      seller_address TEXT,
      seller_address_ar TEXT,
      vat_number VARCHAR(100),
      cr_number VARCHAR(100),
      zatca_qr_payload TEXT,
      zatca_qr_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function seedPackages(client) {
  const existing = await client.query('SELECT COUNT(*)::int AS count FROM packages');

  if (existing.rows[0].count > 0) {
    return;
  }

  for (const pkg of packageSeeds) {
    await client.query(
      `
        INSERT INTO packages (
          slug, title, title_bn, destination, destination_bn, price, discount_price, currency,
          duration, duration_bn, image_url, category, rating, reviews_count, max_people,
          is_popular, is_featured, is_active, description, description_bn, overview, overview_bn,
          about_destination, about_destination_bn, highlights, included, not_included, itinerary, gallery
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22,
          $23, $24, $25::jsonb, $26::jsonb, $27::jsonb, $28::jsonb, $29::jsonb
        )
      `,
      [
        pkg.slug,
        pkg.title,
        pkg.title_bn,
        pkg.destination,
        pkg.destination_bn,
        pkg.originalPrice ?? pkg.price,
        pkg.discountPrice ?? pkg.price,
        pkg.currency,
        pkg.duration,
        pkg.duration_bn,
        pkg.imageUrl,
        pkg.category,
        pkg.rating,
        pkg.reviewsCount,
        pkg.maxPeople,
        pkg.isPopular,
        pkg.isFeatured,
        pkg.isActive,
        pkg.description,
        pkg.description_bn,
        pkg.overview,
        pkg.overview_bn,
        pkg.aboutDestination,
        pkg.aboutDestination_bn,
        JSON.stringify(pkg.highlights),
        JSON.stringify(pkg.included),
        JSON.stringify(pkg.notIncluded),
        JSON.stringify(pkg.itinerary),
        JSON.stringify(pkg.gallery)
      ]
    );
  }
}

async function seedInquiries(client) {
  const existing = await client.query('SELECT COUNT(*)::int AS count FROM contact_inquiries');

  if (existing.rows[0].count > 0) {
    return;
  }

  for (const inquiry of inquirySeeds) {
    await client.query(
      `
        INSERT INTO contact_inquiries (name, email, phone, subject, message, source, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.subject,
        inquiry.message,
        inquiry.source,
        inquiry.status
      ]
    );
  }
}

async function seedSiteSettings(client) {
  const existing = await client.query('SELECT id FROM site_settings WHERE id = 1');

  if (existing.rows[0]) {
    return;
  }

  await client.query(
    `
      INSERT INTO site_settings (
        id, site_name, site_title, tagline, site_name_ar, tagline_ar, logo, favicon, phone, email, support_email, address,
        address_ar, facebook, twitter, instagram, youtube, footer_text, footer_text_ar, copyright_text,
        primary_color, secondary_color, accent_color, header_bg, footer_bg, use_gradients,
        country_code, country_name, country_name_ar, default_language, secondary_language,
        currency_code, currency_symbol, locale, company_name, company_name_ar, company_address, company_address_ar,
        vat_number, cr_number, tax_rate, invoice_prefix, invoice_terms, invoice_terms_ar,
        zatca_enabled, zatca_phase, zatca_qr_enabled, zatca_phase2_enabled, zatca_environment,
        zatca_device_id, zatca_api_base_url, zatca_otp, zatca_secret
      )
      VALUES (
        1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25,
        $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37,
        $38, $39, $40, $41, $42, $43,
        $44, $45, $46, $47, $48,
        $49, $50, $51, $52
      )
    `,
    [
      defaultSiteSettings.siteName,
      defaultSiteSettings.siteTitle,
      defaultSiteSettings.tagline,
      defaultSiteSettings.siteNameAr,
      defaultSiteSettings.taglineAr,
      defaultSiteSettings.logo,
      defaultSiteSettings.favicon,
      defaultSiteSettings.phone,
      defaultSiteSettings.email,
      defaultSiteSettings.supportEmail,
      defaultSiteSettings.address,
      defaultSiteSettings.addressAr,
      defaultSiteSettings.facebook,
      defaultSiteSettings.twitter,
      defaultSiteSettings.instagram,
      defaultSiteSettings.youtube,
      defaultSiteSettings.footerText,
      defaultSiteSettings.footerTextAr,
      defaultSiteSettings.copyrightText,
      defaultSiteSettings.primaryColor,
      defaultSiteSettings.secondaryColor,
      defaultSiteSettings.accentColor,
      defaultSiteSettings.headerBg,
      defaultSiteSettings.footerBg,
      defaultSiteSettings.useGradients,
      defaultSiteSettings.countryCode,
      defaultSiteSettings.countryName,
      defaultSiteSettings.countryNameAr,
      defaultSiteSettings.defaultLanguage,
      defaultSiteSettings.secondaryLanguage,
      defaultSiteSettings.currencyCode,
      defaultSiteSettings.currencySymbol,
      defaultSiteSettings.locale,
      defaultSiteSettings.companyName,
      defaultSiteSettings.companyNameAr,
      defaultSiteSettings.companyAddress,
      defaultSiteSettings.companyAddressAr,
      defaultSiteSettings.vatNumber,
      defaultSiteSettings.crNumber,
      defaultSiteSettings.taxRate,
      defaultSiteSettings.invoicePrefix,
      defaultSiteSettings.invoiceTerms,
      defaultSiteSettings.invoiceTermsAr,
      defaultSiteSettings.zatcaEnabled,
      defaultSiteSettings.zatcaPhase,
      defaultSiteSettings.zatcaQrEnabled,
      defaultSiteSettings.zatcaPhase2Enabled,
      defaultSiteSettings.zatcaEnvironment,
      defaultSiteSettings.zatcaDeviceId,
      defaultSiteSettings.zatcaApiBaseUrl,
      defaultSiteSettings.zatcaOtp,
      defaultSiteSettings.zatcaSecret
    ]
  );
}

async function seedPartners(client) {
  const existing = await client.query('SELECT COUNT(*)::int AS count FROM partners');

  if (existing.rows[0].count > 0) {
    return;
  }

  for (const partner of defaultPartners) {
    await client.query(
      `
        INSERT INTO partners (category, name, logo, active, sort_order)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [partner.category, partner.name, partner.logo, partner.active, partner.sortOrder]
    );
  }
}

async function seedAdminUser(client) {
  await client.query(
    `
      INSERT INTO admin_users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username)
      DO NOTHING
    `,
    ['admin', 'admin@exploreholidays.com', createPasswordHash('admin123'), 'super_admin']
  );
}

async function seedDatabase(client) {
  await seedPackages(client);
  await seedSiteSettings(client);
  await seedPartners(client);
  await seedInquiries(client);
  await seedAdminUser(client);
}

let initializePromise = null;

async function initializeDatabase() {
  if (initializePromise) {
    return initializePromise;
  }

  initializePromise = (async () => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await createSchema(client);
      await seedDatabase(client);
      await client.query('COMMIT');
      console.log('✅ PostgreSQL schema initialized');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ PostgreSQL initialization failed:', error.message);
      throw error;
    } finally {
      client.release();
    }
  })();

  return initializePromise;
}

function mapSiteSettingsRow(row) {
  if (!row) {
    return { ...defaultSiteSettings };
  }

  return {
    siteName: row.site_name,
    siteTitle: row.site_title,
    tagline: row.tagline,
    siteNameAr: row.site_name_ar,
    taglineAr: row.tagline_ar,
    logo: row.logo,
    favicon: row.favicon,
    phone: row.phone,
    email: row.email,
    supportEmail: row.support_email,
    address: row.address,
    addressAr: row.address_ar,
    facebook: row.facebook,
    twitter: row.twitter,
    instagram: row.instagram,
    youtube: row.youtube,
    footerText: row.footer_text,
    footerTextAr: row.footer_text_ar,
    copyrightText: row.copyright_text,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    accentColor: row.accent_color,
    headerBg: row.header_bg,
    footerBg: row.footer_bg,
    useGradients: row.use_gradients,
    countryCode: row.country_code,
    countryName: row.country_name,
    countryNameAr: row.country_name_ar,
    defaultLanguage: row.default_language,
    secondaryLanguage: row.secondary_language,
    currencyCode: row.currency_code,
    currencySymbol: row.currency_symbol,
    locale: row.locale,
    companyName: row.company_name,
    companyNameAr: row.company_name_ar,
    companyAddress: row.company_address,
    companyAddressAr: row.company_address_ar,
    vatNumber: row.vat_number,
    crNumber: row.cr_number,
    taxRate: Number(row.tax_rate || 15),
    invoicePrefix: row.invoice_prefix,
    invoiceTerms: row.invoice_terms,
    invoiceTermsAr: row.invoice_terms_ar,
    zatcaEnabled: row.zatca_enabled,
    zatcaPhase: row.zatca_phase,
    zatcaQrEnabled: row.zatca_qr_enabled,
    zatcaPhase2Enabled: row.zatca_phase2_enabled,
    zatcaEnvironment: row.zatca_environment,
    zatcaDeviceId: row.zatca_device_id,
    zatcaApiBaseUrl: row.zatca_api_base_url,
    zatcaOtp: row.zatca_otp,
    zatcaSecret: row.zatca_secret
  };
}

async function getSiteSettings() {
  const result = await query('SELECT * FROM site_settings WHERE id = 1');
  return mapSiteSettingsRow(result.rows[0]);
}

async function getPartners() {
  const result = await query('SELECT * FROM partners ORDER BY category, sort_order, id');
  return result.rows.reduce(
    (acc, partner) => {
      const item = {
        id: String(partner.id),
        name: partner.name,
        logo: partner.logo,
        active: partner.active
      };

      if (partner.category === 'airlines') {
        acc.airlines.push(item);
      } else {
        acc.banks.push(item);
      }

      return acc;
    },
    { banks: [], airlines: [] }
  );
}

async function upsertUser({ name, email, phone, password }) {
  const result = await query(
    `
      INSERT INTO users (name, email, phone, password_hash, avatar, provider)
      VALUES ($1, $2, $3, $4, $5, 'email')
      RETURNING id, name, email, phone, avatar, provider, created_at
    `,
    [name, email.toLowerCase(), phone || '', createPasswordHash(password), buildAvatarUrl(name)]
  );

  return result.rows[0];
}

module.exports = {
  pool,
  query,
  testConnection,
  initializeDatabase,
  defaultSiteSettings,
  getSiteSettings,
  getPartners,
  upsertUser
};
