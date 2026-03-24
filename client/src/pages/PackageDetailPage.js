import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Check, 
  Heart,
  Share2,
  ChevronRight,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Shield,
  Award,
  Phone,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const includeIconMap = {
  Hotel,
  Utensils,
  Plane,
  Camera,
  Users,
  Shield,
  Check
};

const normalizePackageDetails = (pkg) => ({
  ...pkg,
  originalPrice: pkg.originalPrice || pkg.regularPrice || pkg.price || 0,
  reviews: pkg.reviews || pkg.reviews_count || 0,
  images: Array.isArray(pkg.images) && pkg.images.length > 0
    ? pkg.images
    : [pkg.image || pkg.image_url].filter(Boolean),
  highlights: Array.isArray(pkg.highlights)
    ? pkg.highlights.map((item) => typeof item === 'string' ? { text: item, text_bn: item } : item)
    : [],
  includes: Array.isArray(pkg.includes) && pkg.includes.length > 0
    ? pkg.includes.map((item) => ({
        ...item,
        icon: typeof item.icon === 'string'
          ? includeIconMap[item.icon] || Check
          : item.icon || Check,
        text: item.text || item,
        text_bn: item.text_bn || item.text || item
      }))
    : (Array.isArray(pkg.included) ? pkg.included.map((item) => ({ icon: Check, text: item, text_bn: item })) : []),
  itinerary: Array.isArray(pkg.itinerary)
    ? pkg.itinerary.map((item, index) => ({
        day: item.day || index + 1,
        title: item.title || `Day ${index + 1}`,
        title_bn: item.title_bn || item.title || `Day ${index + 1}`,
        activities: Array.isArray(item.activities) ? item.activities : (item.description ? [item.description] : []),
        activities_bn: Array.isArray(item.activities_bn)
          ? item.activities_bn
          : (Array.isArray(item.activities) ? item.activities : (item.description ? [item.description] : []))
      }))
    : [],
  cityHistory: pkg.cityHistory || pkg.aboutDestination || '',
  cityHistory_bn: pkg.cityHistory_bn || pkg.aboutDestination_bn || '',
  description: pkg.description || pkg.overview || '',
  description_bn: pkg.description_bn || pkg.overview_bn || '',
  destination_bn: pkg.destination_bn || pkg.destination,
  title_bn: pkg.title_bn || pkg.title
});

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { language, formatCurrency } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { addBooking } = useBooking();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    travelers: 1,
    travelDate: '',
    specialRequests: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);
  const [loadingPackage, setLoadingPackage] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoadingPackage(true);
        const response = await axios.get(`/api/packages/${id}`);
        setPackageDetails(normalizePackageDetails(response.data.data));
        setSelectedImage(0);
      } catch (error) {
        setPackageDetails(null);
      } finally {
        setLoadingPackage(false);
      }
    };

    fetchPackage();
  }, [id]);

  const fallbackPackages = {
    1: {
      id: '1',
      title: 'Dubai City Explorer',
      title_bn: 'رحلة استكشاف دبي',
      destination: 'Dubai, UAE',
      destination_bn: 'دبي، الإمارات',
      price: 85000,
      originalPrice: 98000,
      duration: '4 Days / 3 Nights',
      duration_bn: '4 أيام / 3 ليال',
      rating: 4.9,
      reviews: 256,
      maxPeople: 12,
      featured: true,
      popular: true,
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'
      ],
      description: 'Experience Dubai with iconic attractions, premium accommodation, and curated city experiences.',
      description_bn: 'استمتع بأبرز معالم دبي مع إقامة مميزة وتجارب مدينة مختارة بعناية من Sabir Travels.',
      highlights: [
        { text: 'Burj Khalifa Visit', text_bn: 'زيارة برج خليفة' },
        { text: 'Luxury City Hotel', text_bn: 'إقامة فندقية راقية' },
        { text: 'Desert Safari', text_bn: 'سفاري الصحراء' }
      ],
      includes: [
        { icon: Hotel, text: 'Hotel Accommodation', text_bn: 'إقامة فندقية' },
        { icon: Utensils, text: 'Breakfast Included', text_bn: 'إفطار يومي' },
        { icon: Camera, text: 'Sightseeing Tours', text_bn: 'جولات سياحية' }
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Dubai', title_bn: 'الوصول إلى دبي', activities: ['Airport pickup', 'Hotel check-in', 'Evening at Dubai Marina'], activities_bn: ['استقبال من المطار', 'تسجيل الدخول للفندق', 'أمسية في مرسى دبي'] },
        { day: 2, title: 'City Discovery', title_bn: 'استكشاف المدينة', activities: ['Breakfast', 'Burj Khalifa area', 'Dubai Mall'], activities_bn: ['إفطار', 'زيارة منطقة برج خليفة', 'دبي مول'] },
        { day: 3, title: 'Desert Experience', title_bn: 'تجربة الصحراء', activities: ['Desert safari', 'Traditional dinner', 'Cultural show'], activities_bn: ['سفاري الصحراء', 'عشاء تقليدي', 'عرض ثقافي'] },
        { day: 4, title: 'Departure', title_bn: 'المغادرة', activities: ['Free time', 'Check-out', 'Airport transfer'], activities_bn: ['وقت حر', 'تسجيل الخروج', 'الانتقال إلى المطار'] }
      ],
      cityHistory: 'Dubai is a global destination known for luxury hospitality, modern skylines, desert adventures, and world-class shopping.',
      cityHistory_bn: 'دبي وجهة عالمية تجمع بين الحداثة الفاخرة والضيافة الراقية والتجارب الصحراوية والتسوق العالمي.'
    },
    2: {
      id: '2',
      title: 'Maldives Luxury Escape',
      title_bn: 'عطلة فاخرة في المالديف',
      destination: 'Maldives',
      destination_bn: 'المالديف',
      price: 150000,
      originalPrice: 180000,
      duration: '5 Days / 4 Nights',
      duration_bn: '5 أيام / 4 ليال',
      rating: 4.8,
      reviews: 189,
      maxPeople: 6,
      featured: true,
      popular: true,
      images: [
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
        'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800'
      ],
      description: 'Relax in a luxury island resort with turquoise waters, private villa comfort, and unforgettable ocean views.',
      description_bn: 'استرخِ في منتجع جزيري فاخر مع مياه فيروزية وإقامة راقية وإطلالات بحرية لا تُنسى.',
      highlights: [
        { text: 'Overwater Villa Stay', text_bn: 'إقامة في فيلا فوق الماء' },
        { text: 'Snorkeling Experience', text_bn: 'تجربة سنوركلينج' },
        { text: 'Romantic Dinner', text_bn: 'عشاء رومانسي' }
      ],
      includes: [
        { icon: Hotel, text: 'Luxury Resort Stay', text_bn: 'إقامة منتجع فاخر' },
        { icon: Plane, text: 'Transfer Support', text_bn: 'خدمة انتقالات' },
        { icon: Shield, text: 'Premium Assistance', text_bn: 'مساعدة متميزة' }
      ],
      itinerary: [
        { day: 1, title: 'Arrival', title_bn: 'الوصول', activities: ['Airport transfer', 'Resort check-in'], activities_bn: ['استقبال من المطار', 'تسجيل الدخول للمنتجع'] },
        { day: 2, title: 'Island Leisure', title_bn: 'استرخاء على الجزيرة', activities: ['Breakfast', 'Beach time', 'Sunset cruise'], activities_bn: ['إفطار', 'وقت على الشاطئ', 'رحلة غروب بحرية'] },
        { day: 3, title: 'Ocean Activities', title_bn: 'أنشطة بحرية', activities: ['Snorkeling', 'Spa time', 'Free evening'], activities_bn: ['سنوركلينج', 'وقت سبا', 'أمسية حرة'] },
        { day: 4, title: 'Resort Experience', title_bn: 'تجربة المنتجع', activities: ['Water villa stay', 'Fine dining', 'Leisure'], activities_bn: ['إقامة في فيلا مائية', 'عشاء فاخر', 'استرخاء'] },
        { day: 5, title: 'Departure', title_bn: 'المغادرة', activities: ['Check-out', 'Airport transfer'], activities_bn: ['تسجيل الخروج', 'الانتقال إلى المطار'] }
      ],
      cityHistory: 'The Maldives is one of the world\'s leading tropical escapes, celebrated for pristine lagoons, marine life, and private island resorts.',
      cityHistory_bn: 'تعد المالديف من أبرز وجهات الجزر الفاخرة في العالم بفضل بحيراتها الصافية ومنتجعاتها الخاصة وتجاربها البحرية المميزة.'
    },
    3: {
      id: '3',
      title: 'Cairo Heritage Escape',
      title_bn: 'رحلة تراثية إلى القاهرة',
      destination: 'Cairo, Egypt',
      destination_bn: 'القاهرة، مصر',
      price: 72000,
      originalPrice: 86000,
      duration: '5 Days / 4 Nights',
      duration_bn: '5 أيام / 4 ليال',
      rating: 5,
      reviews: 342,
      maxPeople: 14,
      featured: true,
      popular: true,
      images: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800'
      ],
      description: 'Discover Cairo through its ancient wonders, vibrant culture, and guided historical experiences.',
      description_bn: 'اكتشف القاهرة من خلال معالمها التاريخية العريقة وثقافتها النابضة بالحياة وجولاتها الإرشادية المميزة.',
      highlights: [
        { text: 'Pyramids of Giza', text_bn: 'أهرامات الجيزة' },
        { text: 'Nile Dinner Cruise', text_bn: 'رحلة عشاء في النيل' },
        { text: 'Egyptian Museum', text_bn: 'المتحف المصري' }
      ],
      includes: [
        { icon: Hotel, text: 'Hotel Accommodation', text_bn: 'إقامة فندقية' },
        { icon: Camera, text: 'Guided Tours', text_bn: 'جولات مع مرشد' },
        { icon: Utensils, text: 'Breakfast Included', text_bn: 'إفطار يومي' }
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Cairo', title_bn: 'الوصول إلى القاهرة', activities: ['Airport transfer', 'Hotel check-in'], activities_bn: ['استقبال من المطار', 'تسجيل الدخول للفندق'] },
        { day: 2, title: 'Giza Experience', title_bn: 'تجربة الجيزة', activities: ['Visit the pyramids', 'Sphinx stop', 'Local lunch'], activities_bn: ['زيارة الأهرامات', 'التوقف عند أبو الهول', 'غداء محلي'] },
        { day: 3, title: 'Historic Cairo', title_bn: 'القاهرة التاريخية', activities: ['Egyptian Museum', 'Khan El Khalili', 'Nile cruise'], activities_bn: ['المتحف المصري', 'خان الخليلي', 'رحلة نيلية'] },
        { day: 4, title: 'Leisure Day', title_bn: 'يوم حر', activities: ['Free time', 'Optional city tour'], activities_bn: ['وقت حر', 'جولة اختيارية في المدينة'] },
        { day: 5, title: 'Departure', title_bn: 'المغادرة', activities: ['Check-out', 'Airport transfer'], activities_bn: ['تسجيل الخروج', 'الانتقال إلى المطار'] }
      ],
      cityHistory: 'Cairo is one of the oldest great cities in the world, blending Pharaonic heritage, Islamic architecture, and modern urban life.',
      cityHistory_bn: 'القاهرة من أعرق مدن العالم، وتجمع بين الحضارة الفرعونية والعمارة الإسلامية والحياة الحضرية الحديثة.'
    },
    4: {
      id: '4',
      title: 'Thailand Tropical Getaway',
      title_bn: 'عطلة استوائية في تايلاند',
      destination: 'Thailand',
      destination_bn: 'تايلاند',
      price: 65000,
      originalPrice: 76000,
      duration: '5 Days / 4 Nights',
      duration_bn: '5 أيام / 4 ليال',
      rating: 4.7,
      reviews: 221,
      maxPeople: 16,
      featured: false,
      popular: true,
      images: [
        'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800'
      ],
      description: 'Enjoy beaches, markets, and island energy with a balanced Thailand holiday itinerary.',
      description_bn: 'استمتع بالشواطئ والأسواق والأجواء الحيوية في تايلاند عبر برنامج عطلة متوازن وممتع.',
      highlights: [
        { text: 'Island Excursions', text_bn: 'رحلات الجزر' },
        { text: 'Local Markets', text_bn: 'الأسواق المحلية' },
        { text: 'Beach Relaxation', text_bn: 'استرخاء على الشاطئ' }
      ],
      includes: [
        { icon: Hotel, text: 'Hotel Stay', text_bn: 'إقامة فندقية' },
        { icon: Plane, text: 'Airport Transfers', text_bn: 'انتقالات المطار' },
        { icon: Camera, text: 'Sightseeing Support', text_bn: 'دعم الجولات السياحية' }
      ],
      itinerary: [
        { day: 1, title: 'Arrival', title_bn: 'الوصول', activities: ['Hotel check-in', 'Evening rest'], activities_bn: ['تسجيل الدخول للفندق', 'راحة مسائية'] },
        { day: 2, title: 'City & Beach', title_bn: 'المدينة والشاطئ', activities: ['Breakfast', 'Beach visit', 'Evening market'], activities_bn: ['إفطار', 'زيارة الشاطئ', 'سوق مسائي'] },
        { day: 3, title: 'Island Tour', title_bn: 'جولة الجزر', activities: ['Boat trip', 'Swimming', 'Free time'], activities_bn: ['رحلة بحرية', 'سباحة', 'وقت حر'] },
        { day: 4, title: 'Leisure', title_bn: 'يوم حر', activities: ['Optional activities', 'Shopping'], activities_bn: ['أنشطة اختيارية', 'تسوق'] },
        { day: 5, title: 'Departure', title_bn: 'المغادرة', activities: ['Check-out', 'Airport transfer'], activities_bn: ['تسجيل الخروج', 'الانتقال إلى المطار'] }
      ],
      cityHistory: 'Thailand is beloved for its beaches, cuisine, hospitality, and rich blend of culture and leisure travel.',
      cityHistory_bn: 'تشتهر تايلاند بشواطئها ومطبخها وضيافتها ومزيجها الجذاب بين الثقافة والاستجمام.'
    },
    5: {
      id: '5',
      title: 'Singapore Family Fun',
      title_bn: 'مغامرة عائلية في سنغافورة',
      destination: 'Singapore',
      destination_bn: 'سنغافورة',
      price: 95000,
      originalPrice: 108000,
      duration: '4 Days / 3 Nights',
      duration_bn: '4 أيام / 3 ليال',
      rating: 4.8,
      reviews: 198,
      maxPeople: 10,
      featured: true,
      popular: false,
      images: [
        'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
        'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800'
      ],
      description: 'A family-friendly Singapore escape with iconic attractions, clean city comfort, and seamless planning.',
      description_bn: 'رحلة عائلية إلى سنغافورة تشمل أبرز المعالم وتجربة مدينة منظمة ومريحة للجميع.',
      highlights: [
        { text: 'Marina Bay Area', text_bn: 'منطقة مارينا باي' },
        { text: 'Family Attractions', text_bn: 'معالم عائلية' },
        { text: 'City Discovery', text_bn: 'استكشاف المدينة' }
      ],
      includes: [
        { icon: Hotel, text: 'Hotel Accommodation', text_bn: 'إقامة فندقية' },
        { icon: Plane, text: 'Transfer Assistance', text_bn: 'مساعدة في الانتقالات' },
        { icon: Camera, text: 'Attraction Planning', text_bn: 'تنسيق زيارة المعالم' }
      ],
      itinerary: [
        { day: 1, title: 'Arrival', title_bn: 'الوصول', activities: ['Transfer to hotel', 'Evening city walk'], activities_bn: ['الانتقال إلى الفندق', 'جولة مسائية في المدينة'] },
        { day: 2, title: 'Iconic Singapore', title_bn: 'معالم سنغافورة', activities: ['Breakfast', 'Marina Bay', 'Gardens by the Bay'], activities_bn: ['إفطار', 'مارينا باي', 'حدائق الخليج'] },
        { day: 3, title: 'Family Leisure', title_bn: 'أنشطة عائلية', activities: ['Attraction visit', 'Shopping time'], activities_bn: ['زيارة معلم سياحي', 'وقت للتسوق'] },
        { day: 4, title: 'Departure', title_bn: 'المغادرة', activities: ['Check-out', 'Airport transfer'], activities_bn: ['تسجيل الخروج', 'الانتقال إلى المطار'] }
      ],
      cityHistory: 'Singapore is a modern city-state known for efficiency, family attractions, multicultural food, and world-class urban design.',
      cityHistory_bn: 'سنغافورة مدينة حديثة معروفة بالتنظيم العالي والمعالم العائلية والتنوع الثقافي والتصميم الحضري المتقدم.'
    },
    6: {
      id: '6',
      title: 'Istanbul Cultural Journey',
      title_bn: 'رحلة ثقافية إلى إسطنبول',
      destination: 'Istanbul, Turkey',
      destination_bn: 'إسطنبول، تركيا',
      price: 88000,
      originalPrice: 99000,
      duration: '4 Days / 3 Nights',
      duration_bn: '4 أيام / 3 ليال',
      rating: 4.9,
      reviews: 275,
      maxPeople: 14,
      featured: false,
      popular: true,
      images: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
        'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800'
      ],
      description: 'Explore Istanbul through its mosques, bazaars, Bosphorus views, and timeless cultural atmosphere.',
      description_bn: 'اكتشف إسطنبول عبر مساجدها التاريخية وأسواقها الشهيرة وإطلالاتها على البوسفور وأجوائها الثقافية الفريدة.',
      highlights: [
        { text: 'Historic Mosques', text_bn: 'المساجد التاريخية' },
        { text: 'Grand Bazaar', text_bn: 'البازار الكبير' },
        { text: 'Bosphorus Moments', text_bn: 'إطلالات البوسفور' }
      ],
      includes: [
        { icon: Hotel, text: 'Central Hotel Stay', text_bn: 'إقامة فندقية وسط المدينة' },
        { icon: Camera, text: 'Guided City Tour', text_bn: 'جولة مدينة مع مرشد' },
        { icon: Utensils, text: 'Breakfast Included', text_bn: 'إفطار يومي' }
      ],
      itinerary: [
        { day: 1, title: 'Arrival', title_bn: 'الوصول', activities: ['Airport transfer', 'Check-in', 'Evening walk'], activities_bn: ['استقبال من المطار', 'تسجيل الدخول', 'جولة مسائية'] },
        { day: 2, title: 'Old Istanbul', title_bn: 'إسطنبول القديمة', activities: ['Blue Mosque', 'Hagia Sophia', 'Local lunch'], activities_bn: ['الجامع الأزرق', 'آيا صوفيا', 'غداء محلي'] },
        { day: 3, title: 'Markets & Bosphorus', title_bn: 'الأسواق والبوسفور', activities: ['Grand Bazaar', 'Bosphorus cruise'], activities_bn: ['البازار الكبير', 'رحلة في البوسفور'] },
        { day: 4, title: 'Departure', title_bn: 'المغادرة', activities: ['Free time', 'Airport transfer'], activities_bn: ['وقت حر', 'الانتقال إلى المطار'] }
      ],
      cityHistory: 'Istanbul bridges Europe and Asia and remains one of the world\'s most historic and culturally layered cities.',
      cityHistory_bn: 'تمثل إسطنبول جسرًا بين آسيا وأوروبا، وهي من أكثر مدن العالم ثراءً بالتاريخ والثقافة.'
    }
  };

  const pkg = packageDetails || fallbackPackages[id] || fallbackPackages[1];

  const tabs = [
    { id: 'overview', label: 'Overview', label_bn: 'نظرة عامة' },
    { id: 'itinerary', label: 'Itinerary', label_bn: 'برنامج الرحلة' },
    { id: 'includes', label: "What's Included", label_bn: 'يشمل العرض' },
    { id: 'history', label: 'About Destination', label_bn: 'عن الوجهة' },
  ];

  // Handle booking submission
  const handleBooking = async () => {
    if (!bookingData.travelDate) {
      alert(language === 'bn' ? 'يرجى اختيار تاريخ السفر' : 'Please select a travel date');
      return;
    }

    const totalAmount = pkg.price * bookingData.travelers;

    try {
      await addBooking({
        type: 'package',
        packageId: pkg.id || id,
        title: language === 'bn' ? pkg.title_bn : pkg.title,
        destination: pkg.destination,
        date: bookingData.travelDate,
        travelers: bookingData.travelers,
        amount: totalAmount,
        image: pkg.images?.[0] || pkg.image_url,
        specialRequests: bookingData.specialRequests,
        details: {
          packageId: pkg.id || id,
          packageTitle: pkg.title,
          destination: pkg.destination,
          customerName: user?.name || 'Guest',
          customerEmail: user?.email || '',
          customerPhone: user?.phone || '',
          travelers: bookingData.travelers,
          travelDate: bookingData.travelDate,
          specialRequests: bookingData.specialRequests,
          pricePerPerson: pkg.price,
          totalAmount
        }
      });

      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        setBookingData({ travelers: 1, travelDate: '', specialRequests: '' });
      }, 3000);
    } catch (error) {
      alert(language === 'bn' ? 'تعذر إرسال الحجز' : 'Failed to submit booking');
    }
  };

  if (loadingPackage && !packageDetails) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {language === 'bn' ? 'جارٍ تحميل تفاصيل الباقة...' : 'Loading package details...'}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{language === 'bn' ? pkg.title_bn : pkg.title} | Sabir Travels</title>
      </Helmet>

      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {/* Hero Section with Image Gallery */}
        <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
          <motion.img
            key={selectedImage}
            src={pkg.images[selectedImage]}
            alt={pkg.title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Top Bar - Badges and Action Buttons aligned with content */}
          <div className="absolute top-20 left-0 right-0 px-4 sm:px-6 lg:px-8 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              {/* Badges - Left side aligned with content */}
              <div className="flex gap-2">
                {pkg.popular && (
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-current" /> {language === 'bn' ? 'شائع' : 'Popular'}
                  </span>
                )}
                {pkg.featured && (
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
                    {language === 'bn' ? 'مميز' : 'Featured'}
                  </span>
                )}
              </div>
              
              {/* Action Buttons - Right side aligned with content */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                    if (!isWishlisted) {
                      wishlist.push({ id, title: pkg.title, image: pkg.images[0], price: pkg.price });
                      localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    } else {
                      const filtered = wishlist.filter(item => item.id !== id);
                      localStorage.setItem('wishlist', JSON.stringify(filtered));
                    }
                  }}
                  className={`w-11 h-11 rounded-xl backdrop-blur-md shadow-lg border transition-all flex items-center justify-center ${
                    isWishlisted 
                      ? 'bg-red-500 text-white border-red-400' 
                      : 'bg-white/90 text-gray-700 border-white/50 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: pkg.title,
                        text: `Check out this amazing package: ${pkg.title}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert(language === 'bn' ? 'تم نسخ الرابط' : 'Link copied to clipboard!');
                    }
                  }}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg border border-white/20 flex items-center justify-center hover:shadow-xl transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Title Overlay - Aligned with content */}
          <div className="absolute bottom-24 left-0 right-0 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span>{language === 'bn' ? pkg.destination_bn : pkg.destination}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
                  {language === 'bn' ? pkg.title_bn : pkg.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <span className="font-semibold">{pkg.rating}</span>
                    <span className="text-white/60">({pkg.reviews} {language === 'bn' ? 'مراجعة' : 'reviews'})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{language === 'bn' ? pkg.duration_bn : pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-5 h-5" />
                    <span>{language === 'bn' ? `حتى ${pkg.maxPeople} أشخاص` : `Max ${pkg.maxPeople} people`}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          {/* Thumbnail Gallery - Full width aligned row */}
          <div className="flex gap-2 mb-6">
            {pkg.images.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shadow-lg ${
                  selectedImage === idx 
                    ? 'border-primary-500 ring-2 ring-primary-500/50' 
                    : isDark ? 'border-slate-600 bg-slate-800' : 'border-white bg-white'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className={`rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl p-2 mb-8`}>
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                          : isDark
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {language === 'bn' ? tab.label_bn : tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl p-8`}
              >
                {activeTab === 'overview' && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'bn' ? 'وصف الباقة' : 'Package Description'}
                    </h2>
                    <p className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {language === 'bn' ? pkg.description_bn : pkg.description}
                    </p>
                    
                    <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'bn' ? 'أبرز المزايا' : 'Highlights'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pkg.highlights.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`flex items-center gap-3 p-4 rounded-xl ${
                            isDark ? 'bg-slate-700/50' : 'bg-gray-50'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                            {language === 'bn' ? item.text_bn : item.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'bn' ? 'البرنامج اليومي' : 'Day by Day Itinerary'}
                    </h2>
                    {pkg.itinerary.map((day, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative pl-8 pb-8 border-l-2 ${
                          isDark ? 'border-slate-600' : 'border-gray-200'
                        } last:border-0`}
                      >
                        <div className="absolute left-0 top-0 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                          {day.day}
                        </div>
                        <div className={`ml-6 p-6 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {language === 'bn' ? day.title_bn : day.title}
                          </h3>
                          <ul className="space-y-2">
                            {(language === 'bn' ? day.activities_bn : day.activities).map((activity, actIdx) => (
                              <li key={actIdx} className={`flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <ChevronRight className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'bn' ? 'ما يشمله العرض' : "What's Included"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pkg.includes.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex items-center gap-4 p-5 rounded-2xl ${
                              isDark ? 'bg-slate-700/50' : 'bg-gray-50'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                              {language === 'bn' ? item.text_bn : item.text}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'bn' ? 'عن الوجهة' : 'About the Destination'}
                    </h2>
                    <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-gradient-to-br from-primary-50 to-secondary-50'}`}>
                      <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {language === 'bn' ? pkg.cityHistory_bn : pkg.cityHistory}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`sticky top-24 rounded-3xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-2xl p-8`}
              >
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(pkg.price)}
                    </span>
                    <span className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatCurrency(pkg.originalPrice)}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {language === 'bn' ? 'لكل شخص' : 'per person'}
                  </p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                  </div>
                </div>

                {/* Quick Info */}
                <div className={`space-y-4 mb-6 pb-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                      <Clock className="w-4 h-4 inline mr-2" />
                      {language === 'bn' ? 'المدة' : 'Duration'}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'bn' ? pkg.duration_bn : pkg.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                      <Users className="w-4 h-4 inline mr-2" />
                      {language === 'bn' ? 'الحد الأقصى' : 'Max People'}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {pkg.maxPeople}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                      <Star className="w-4 h-4 inline mr-2" />
                      {language === 'bn' ? 'التقييم' : 'Rating'}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {pkg.rating} ({pkg.reviews})
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <motion.button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: `/holidays/${id}` } });
                    } else {
                      setShowBookingModal(true);
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {language === 'bn' ? 'احجز الآن' : 'Book Now'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Contact */}
                <div className="mt-6 text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                    {language === 'bn' ? 'هل تحتاج إلى مساعدة؟' : 'Need help?'}
                  </p>
                  <a
                    href="tel:+966551234567"
                    className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    +966 55 123 4567
                  </a>
                </div>

                {/* Trust Badges */}
                <div className={`mt-6 pt-6 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <Shield className="w-8 h-8 mx-auto text-green-500 mb-1" />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{language === 'bn' ? 'آمن' : 'Secure'}</span>
                    </div>
                    <div className="text-center">
                      <Award className="w-8 h-8 mx-auto text-amber-500 mb-1" />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{language === 'bn' ? 'أفضل سعر' : 'Best Price'}</span>
                    </div>
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto text-blue-500 mb-1" />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>24/7</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-20" />

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => !bookingSuccess && setShowBookingModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
                  isDark ? 'bg-slate-800' : 'bg-white'
                }`}
              >
                {bookingSuccess ? (
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'bn' ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}
                    </h2>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {language === 'bn' ? 'تم إرسال حجزك بنجاح. سنتواصل معك قريبًا.' : 'Your booking has been submitted. We\'ll contact you shortly.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Modal Header */}
                    <div className="relative h-32 bg-gradient-to-r from-primary-500 to-secondary-500">
                      <button
                        onClick={() => setShowBookingModal(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-6 text-white">
                        <h3 className="text-xl font-bold">{language === 'bn' ? 'احجز هذه الباقة' : 'Book This Package'}</h3>
                        <p className="text-white/80 text-sm">{language === 'bn' ? pkg.title_bn : pkg.title}</p>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4">
                      {/* Price Summary */}
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{language === 'bn' ? 'السعر لكل شخص' : 'Price per person'}</span>
                          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(pkg.price)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{language === 'bn' ? `الإجمالي (${bookingData.travelers} مسافرين)` : `Total (${bookingData.travelers} travelers)`}</span>
                          <span className="font-bold text-primary-500 text-xl">{formatCurrency(pkg.price * bookingData.travelers)}</span>
                        </div>
                      </div>

                      {/* Travelers */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {language === 'bn' ? 'عدد المسافرين' : 'Number of Travelers'}
                        </label>
                        <select
                          value={bookingData.travelers}
                          onChange={(e) => setBookingData({...bookingData, travelers: parseInt(e.target.value)})}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>{language === 'bn' ? `${n} ${n === 1 ? 'مسافر' : 'مسافرين'}` : `${n} ${n === 1 ? 'Person' : 'People'}`}</option>
                          ))}
                        </select>
                      </div>

                      {/* Travel Date */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {language === 'bn' ? 'تاريخ السفر' : 'Travel Date'}
                        </label>
                        <input
                          type="date"
                          value={bookingData.travelDate}
                          onChange={(e) => setBookingData({...bookingData, travelDate: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>

                      {/* Special Requests */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {language === 'bn' ? 'طلبات خاصة (اختياري)' : 'Special Requests (Optional)'}
                        </label>
                        <textarea
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                          rows={3}
                          placeholder={language === 'bn' ? 'أي متطلبات خاصة...' : 'Any special requirements...'}
                          className={`w-full px-4 py-3 rounded-xl border resize-none ${
                            isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        onClick={handleBooking}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl shadow-lg"
                      >
                        {language === 'bn' ? 'تأكيد الحجز' : 'Confirm Booking'}
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PackageDetailPage;
