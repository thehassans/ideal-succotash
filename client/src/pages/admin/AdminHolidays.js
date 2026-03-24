import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Save, X, Image, MapPin, Clock,
  Star, Check, Upload, List, Grid, Search, RotateCcw
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';
import { SAUDI_RIYAL_SYMBOL } from '../../utils/currency';

const normalizeEditorPackage = (pkg) => ({
  ...pkg,
  price: pkg.regularPrice || pkg.originalPrice || pkg.price || 0,
  discountPrice: pkg.discountPrice || pkg.price || pkg.regularPrice || pkg.originalPrice || 0,
  image: pkg.image || pkg.image_url || pkg.images?.[0] || pkg.gallery?.[0] || '',
  gallery: Array.isArray(pkg.gallery) ? pkg.gallery : (Array.isArray(pkg.images) ? pkg.images : []),
  included: Array.isArray(pkg.included) ? pkg.included : [],
  notIncluded: Array.isArray(pkg.notIncluded) ? pkg.notIncluded : [],
  itinerary: Array.isArray(pkg.itinerary)
    ? pkg.itinerary.map((item, index) => ({
        day: item.day || index + 1,
        title: item.title || `Day ${index + 1}`,
        description: item.description || (Array.isArray(item.activities) ? item.activities.join(', ') : '')
      }))
    : []
});

const buildPackagePayload = (pkg) => ({
  ...pkg,
  image_url: pkg.image,
  featured: pkg.featured,
  popular: pkg.popular,
  active: pkg.active,
  itinerary: (pkg.itinerary || []).map((item, index) => ({
    day: item.day || index + 1,
    title: item.title,
    description: item.description
  }))
});

const AdminHolidays = () => {
  // Get theme from localStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('adminTheme');
    return saved ? saved === 'dark' : false;
  });

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const saved = localStorage.getItem('adminTheme');
      setIsDark(saved === 'dark');
    };
    window.addEventListener('storage', checkTheme);
    const interval = setInterval(checkTheme, 500);
    return () => {
      window.removeEventListener('storage', checkTheme);
      clearInterval(interval);
    };
  }, []);
  const { formatCurrency } = useLanguage();
  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('holidayPackages');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Cox\'s Bazar Beach Paradise',
        destination: 'Cox\'s Bazar',
        duration: '3 Days / 2 Nights',
        price: 12000,
        discountPrice: 9999,
        rating: 4.8,
        maxPeople: 20,
        featured: true,
        popular: true,
        active: true,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
        overview: 'Experience the longest natural sea beach in the world.',
        aboutDestination: 'Cox\'s Bazar is famous for its long natural sandy beach.',
        included: ['Hotel Accommodation', 'Daily Breakfast', 'Airport Transfer', 'Guided Tours'],
        notIncluded: ['Air Tickets', 'Personal Expenses'],
        itinerary: [
          { day: 1, title: 'Arrival & Beach', description: 'Check-in, beach walk and sunset.' },
          { day: 2, title: 'Island Hopping', description: 'Visit Saint Martin\'s Island.' },
          { day: 3, title: 'Departure', description: 'Local sightseeing and departure.' },
        ]
      },
      {
        id: 2,
        title: 'Sundarbans Mangrove Adventure',
        destination: 'Sundarbans',
        duration: '4 Days / 3 Nights',
        price: 18000,
        discountPrice: 15000,
        rating: 4.9,
        maxPeople: 15,
        featured: true,
        popular: false,
        active: true,
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
        gallery: [],
        overview: 'Explore the world\'s largest mangrove forest.',
        aboutDestination: 'Home to the Royal Bengal Tiger.',
        included: ['Boat Accommodation', 'All Meals', 'Forest Permits'],
        notIncluded: ['Transport to Khulna', 'Tips'],
        itinerary: [
          { day: 1, title: 'Journey Begins', description: 'Travel to Khulna, board the boat.' },
          { day: 2, title: 'Forest Exploration', description: 'Visit watchtowers, spot wildlife.' },
          { day: 3, title: 'Wildlife Photography', description: 'Bird watching, deer spotting.' },
          { day: 4, title: 'Return', description: 'Return to Khulna.' },
        ]
      },
      {
        id: 3,
        title: 'Magical Maldives Getaway',
        destination: 'Maldives',
        duration: '5 Days / 4 Nights',
        price: 85000,
        discountPrice: 75000,
        rating: 4.9,
        maxPeople: 10,
        featured: true,
        popular: true,
        active: true,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
        gallery: [],
        overview: 'Experience paradise on earth with crystal clear waters.',
        aboutDestination: 'The Maldives is a tropical paradise in the Indian Ocean.',
        included: ['Resort Stay', 'All Meals', 'Speedboat Transfer', 'Snorkeling'],
        notIncluded: ['International Flights', 'Visa Fee'],
        itinerary: [
          { day: 1, title: 'Arrival', description: 'Airport pickup, speedboat to resort.' },
          { day: 2, title: 'Beach Day', description: 'Relaxation, swimming, snorkeling.' },
          { day: 3, title: 'Water Sports', description: 'Diving, parasailing, jet ski.' },
          { day: 4, title: 'Island Hopping', description: 'Visit local islands.' },
          { day: 5, title: 'Departure', description: 'Transfer to airport.' },
        ]
      },
      {
        id: 4,
        title: 'Dubai Luxury Experience',
        destination: 'Dubai',
        duration: '5 Days / 4 Nights',
        price: 65000,
        discountPrice: 55000,
        rating: 4.8,
        maxPeople: 20,
        featured: true,
        popular: true,
        active: true,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        gallery: [],
        overview: 'Experience the luxury and grandeur of Dubai.',
        aboutDestination: 'Dubai is known for luxury shopping and ultramodern architecture.',
        included: ['Hotel Stay', 'Breakfast', 'City Tour', 'Desert Safari'],
        notIncluded: ['Flights', 'Visa', 'Lunch/Dinner'],
        itinerary: [
          { day: 1, title: 'Arrival', description: 'Airport transfer, hotel check-in.' },
          { day: 2, title: 'City Tour', description: 'Burj Khalifa, Dubai Mall, Marina.' },
          { day: 3, title: 'Desert Safari', description: 'Dune bashing, BBQ dinner.' },
          { day: 4, title: 'Free Day', description: 'Shopping, attractions.' },
          { day: 5, title: 'Departure', description: 'Airport transfer.' },
        ]
      },
      {
        id: 5,
        title: 'Thailand Adventure',
        destination: 'Thailand',
        duration: '6 Days / 5 Nights',
        price: 45000,
        discountPrice: 38000,
        rating: 4.7,
        maxPeople: 25,
        featured: false,
        popular: true,
        active: true,
        image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
        gallery: [],
        overview: 'Explore Bangkok and Pattaya beaches.',
        aboutDestination: 'Thailand offers temples, beaches, and vibrant nightlife.',
        included: ['Hotel', 'Breakfast', 'Tours', 'Transfers'],
        notIncluded: ['Flights', 'Visa', 'Personal Expenses'],
        itinerary: [
          { day: 1, title: 'Bangkok Arrival', description: 'Hotel check-in, night market.' },
          { day: 2, title: 'Temple Tour', description: 'Grand Palace, Wat Pho.' },
          { day: 3, title: 'Pattaya', description: 'Transfer to Pattaya.' },
          { day: 4, title: 'Coral Island', description: 'Island tour, water sports.' },
          { day: 5, title: 'Shopping', description: 'Shopping day.' },
          { day: 6, title: 'Departure', description: 'Airport transfer.' },
        ]
      },
      {
        id: 6,
        title: 'Singapore City Tour',
        destination: 'Singapore',
        duration: '4 Days / 3 Nights',
        price: 55000,
        discountPrice: 48000,
        rating: 4.8,
        maxPeople: 20,
        featured: false,
        popular: true,
        active: true,
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
        gallery: [],
        overview: 'Modern city with Gardens by the Bay and Sentosa.',
        aboutDestination: 'Singapore is a global financial hub with tropical climate.',
        included: ['Hotel', 'Breakfast', 'City Tour', 'Universal Studios'],
        notIncluded: ['Flights', 'Visa', 'Meals'],
        itinerary: [
          { day: 1, title: 'Arrival', description: 'Hotel check-in, Marina Bay.' },
          { day: 2, title: 'City Tour', description: 'Gardens by the Bay, Merlion.' },
          { day: 3, title: 'Sentosa', description: 'Universal Studios, beach.' },
          { day: 4, title: 'Departure', description: 'Shopping, airport.' },
        ]
      },
      {
        id: 7,
        title: 'Malaysia Explorer',
        destination: 'Malaysia',
        duration: '5 Days / 4 Nights',
        price: 42000,
        discountPrice: 35000,
        rating: 4.6,
        maxPeople: 25,
        featured: false,
        popular: false,
        active: true,
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
        gallery: [],
        overview: 'Visit Kuala Lumpur and Genting Highlands.',
        aboutDestination: 'Malaysia offers diverse cultures and modern cities.',
        included: ['Hotel', 'Breakfast', 'Tours', 'Genting Cable Car'],
        notIncluded: ['Flights', 'Visa', 'Personal Expenses'],
        itinerary: [
          { day: 1, title: 'KL Arrival', description: 'Hotel, Petronas Towers.' },
          { day: 2, title: 'City Tour', description: 'Batu Caves, shopping.' },
          { day: 3, title: 'Genting', description: 'Cable car, casino.' },
          { day: 4, title: 'Free Day', description: 'Shopping.' },
          { day: 5, title: 'Departure', description: 'Airport.' },
        ]
      },
      {
        id: 8,
        title: 'Sylhet Tea Garden Tour',
        destination: 'Sylhet',
        duration: '3 Days / 2 Nights',
        price: 8500,
        discountPrice: 6999,
        rating: 4.5,
        maxPeople: 30,
        featured: false,
        popular: false,
        active: true,
        image: 'https://images.unsplash.com/photo-1582650949560-e0a3a5e52b47?w=800',
        gallery: [],
        overview: 'Explore beautiful tea gardens and waterfalls.',
        aboutDestination: 'Sylhet is known for tea gardens and natural beauty.',
        included: ['Hotel', 'Meals', 'Transport', 'Guide'],
        notIncluded: ['Personal Expenses'],
        itinerary: [
          { day: 1, title: 'Arrival', description: 'Jaflong, Ratargul.' },
          { day: 2, title: 'Tea Gardens', description: 'Tea estate tour, Lawachara.' },
          { day: 3, title: 'Departure', description: 'Srimangal, return.' },
        ]
      },
      {
        id: 9,
        title: 'Bandarban Hill Adventure',
        destination: 'Bandarban',
        duration: '4 Days / 3 Nights',
        price: 12000,
        discountPrice: 9500,
        rating: 4.7,
        maxPeople: 20,
        featured: false,
        popular: false,
        active: true,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        gallery: [],
        overview: 'Trek through hills and visit tribal villages.',
        aboutDestination: 'Bandarban is the most remote district of Bangladesh.',
        included: ['Hotel', 'Meals', 'Jeep', 'Guide', 'Trekking Permit'],
        notIncluded: ['Personal Items'],
        itinerary: [
          { day: 1, title: 'Arrival', description: 'Nilgiri, Golden Temple.' },
          { day: 2, title: 'Trekking', description: 'Chimbuk, Boga Lake.' },
          { day: 3, title: 'Waterfalls', description: 'Nafakhum, Remakri.' },
          { day: 4, title: 'Return', description: 'Departure.' },
        ]
      },
      {
        id: 10,
        title: 'Rangamati Lake Escape',
        destination: 'Rangamati',
        duration: '3 Days / 2 Nights',
        price: 9000,
        discountPrice: 7500,
        rating: 4.4,
        maxPeople: 25,
        featured: false,
        popular: false,
        active: true,
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
        gallery: [],
        overview: 'Experience serene Kaptai Lake and tribal culture.',
        aboutDestination: 'Rangamati is known for Kaptai Lake and hill tribes.',
        included: ['Hotel', 'Boat Ride', 'Meals', 'Guide'],
        notIncluded: ['Personal Expenses'],
        itinerary: [
          { day: 1, title: 'Arrival', description: 'Kaptai Lake cruise.' },
          { day: 2, title: 'Exploration', description: 'Tribal villages, hanging bridge.' },
          { day: 3, title: 'Return', description: 'Departure.' },
        ]
      }
    ];
  });

  const [loadingPackages, setLoadingPackages] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeEditorTab, setActiveEditorTab] = useState('basic');

  const emptyPackage = {
    title: '',
    destination: '',
    duration: '',
    price: 0,
    discountPrice: 0,
    rating: 0,
    maxPeople: 10,
    featured: false,
    popular: false,
    active: true,
    image: '',
    gallery: [],
    overview: '',
    aboutDestination: '',
    included: [],
    notIncluded: [],
    itinerary: []
  };

  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const response = await axios.get('/api/admin/packages');
      setPackages(response.data.data.map(normalizeEditorPackage));
      localStorage.setItem('holidayPackages', JSON.stringify(response.data.data.map(normalizeEditorPackage)));
    } catch (error) {
      const saved = localStorage.getItem('holidayPackages');
      if (saved) {
        setPackages(JSON.parse(saved));
      }
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSavePackage = async () => {
    try {
      const payload = buildPackagePayload(editingPackage);
      const response = editingPackage.id
        ? await axios.put(`/api/admin/packages/${editingPackage.id}`, payload)
        : await axios.post('/api/admin/packages', payload);

      const updatedPackage = normalizeEditorPackage(response.data.data);

      setPackages(prev => {
        const exists = prev.some(p => p.id === updatedPackage.id);
        const nextPackages = exists
          ? prev.map(p => p.id === updatedPackage.id ? updatedPackage : p)
          : [updatedPackage, ...prev];
        localStorage.setItem('holidayPackages', JSON.stringify(nextPackages));
        return nextPackages;
      });

      setShowEditor(false);
      setEditingPackage(null);
    } catch (error) {
      alert('Failed to save package');
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`/api/admin/packages/${id}`);
        setPackages(prev => {
          const nextPackages = prev.filter(p => p.id !== id);
          localStorage.setItem('holidayPackages', JSON.stringify(nextPackages));
          return nextPackages;
        });
      } catch (error) {
        alert('Failed to delete package');
      }
    }
  };

  const addItineraryDay = () => {
    const newDay = editingPackage.itinerary.length + 1;
    setEditingPackage(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: newDay, title: '', description: '' }]
    }));
  };

  const updateItinerary = (index, field, value) => {
    setEditingPackage(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const removeItineraryDay = (index) => {
    setEditingPackage(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }))
    }));
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle main image upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Image size should be less than 2MB');
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setEditingPackage(prev => ({ ...prev, image: base64 }));
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      }
    }
  };

  // Handle gallery image upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (editingPackage.gallery.length + files.length > 5) {
      alert('Maximum 5 gallery images allowed');
      return;
    }
    
    try {
      const base64Images = await Promise.all(
        files.map(async (file) => {
          if (file.size > 2 * 1024 * 1024) {
            throw new Error(`${file.name} is larger than 2MB`);
          }
          return await fileToBase64(file);
        })
      );
      setEditingPackage(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...base64Images].slice(0, 5)
      }));
    } catch (error) {
      alert(error.message || 'Failed to upload images');
    }
  };

  const addGalleryImageUrl = () => {
    if (editingPackage.gallery.length >= 5) {
      alert('Maximum 5 gallery images allowed');
      return;
    }
    const url = prompt('Enter image URL:');
    if (url) {
      setEditingPackage(prev => ({
        ...prev,
        gallery: [...prev.gallery, url]
      }));
    }
  };

  const removeGalleryImage = (index) => {
    setEditingPackage(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const addIncludedItem = (type) => {
    const item = prompt(`Enter ${type === 'included' ? 'included' : 'not included'} item:`);
    if (item) {
      setEditingPackage(prev => ({
        ...prev,
        [type]: [...prev[type], item]
      }));
    }
  };

  const removeItem = (type, index) => {
    setEditingPackage(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const filteredPackages = packages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const editorTabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'details', label: 'Details' },
    { id: 'itinerary', label: 'Itinerary' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Holiday Packages</h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your travel packages and destinations ({loadingPackages ? '...' : packages.length} packages)</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reload packages from the server?')) {
                  fetchPackages();
                }
              }}
              className={`px-4 py-2.5 font-medium rounded-xl flex items-center gap-2 transition-colors ${
                isDark 
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Defaults
            </button>
            <button
              onClick={() => { setEditingPackage(emptyPackage); setShowEditor(true); setActiveEditorTab('basic'); }}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Add Package
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages..."
              className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-500 text-white' 
                  : isDark ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-500 text-white' 
                  : isDark ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Packages Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredPackages.map(pkg => (
            <motion.div
              key={pkg.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border overflow-hidden shadow-lg ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              } ${viewMode === 'list' ? 'flex' : ''}`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                <img
                  src={pkg.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {pkg.featured && (
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">Featured</span>
                  )}
                  {pkg.popular && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-medium">Popular</span>
                  )}
                </div>
                {!pkg.active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1">
                <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{pkg.title}</h3>
                <div className={`flex items-center gap-2 text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MapPin className="w-4 h-4" />
                  {pkg.destination}
                  <span className="mx-1">•</span>
                  <Clock className="w-4 h-4" />
                  {pkg.duration}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-primary-500 font-bold text-lg">{formatCurrency(pkg.discountPrice)}</span>
                    {pkg.price !== pkg.discountPrice && (
                      <span className={`line-through text-sm ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatCurrency(pkg.price)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className={isDark ? 'text-white' : 'text-gray-700'}>{pkg.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setEditingPackage(pkg); setShowEditor(true); setActiveEditorTab('basic'); }}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 font-medium transition-colors ${
                      isDark 
                        ? 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30' 
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className={`py-2 px-3 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Editor Modal */}
        <AnimatePresence>
          {showEditor && editingPackage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowEditor(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl ${
                  isDark ? 'bg-slate-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Editor Header */}
                <div className={`p-6 border-b flex items-center justify-between ${
                  isDark ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {editingPackage.id ? 'Edit Package' : 'Add New Package'}
                  </h2>
                  <button 
                    onClick={() => setShowEditor(false)} 
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Editor Tabs */}
                <div className={`flex border-b px-6 overflow-x-auto ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                  {editorTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveEditorTab(tab.id)}
                      className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                        activeEditorTab === tab.id
                          ? 'text-primary-500 border-b-2 border-primary-500'
                          : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Editor Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {/* Basic Info Tab */}
                  {activeEditorTab === 'basic' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Package Title</label>
                          <input
                            type="text"
                            value={editingPackage.title}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, title: e.target.value }))}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Destination</label>
                          <input
                            type="text"
                            value={editingPackage.destination}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, destination: e.target.value }))}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Duration</label>
                          <input
                            type="text"
                            value={editingPackage.duration}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, duration: e.target.value }))}
                            placeholder="e.g., 3 Days / 2 Nights"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Max People</label>
                          <input
                            type="number"
                            value={editingPackage.maxPeople}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, maxPeople: parseInt(e.target.value) }))}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                          />
                        </div>
                      </div>
                      {/* Main Image Upload */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Main Image</label>
                        <div className="flex gap-4">
                          {/* Image Preview */}
                          <div className={`w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center ${
                            isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-100'
                          }`}>
                            {editingPackage.image ? (
                              <img src={editingPackage.image} alt="Main" className="w-full h-full object-cover" />
                            ) : (
                              <Upload className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            {/* Upload Button */}
                            <label className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
                              isDark 
                                ? 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30' 
                                : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                            }`}>
                              <Upload className="w-4 h-4" />
                              <span className="font-medium">Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageUpload}
                                className="hidden"
                              />
                            </label>
                            {/* URL Input */}
                            <input
                              type="text"
                              value={editingPackage.image}
                              onChange={(e) => setEditingPackage(prev => ({ ...prev, image: e.target.value }))}
                              placeholder="Or paste image URL..."
                              className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                              }`}
                            />
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Max 2MB • JPG, PNG, WebP</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingPackage.featured}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-gray-300">Featured</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingPackage.popular}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, popular: e.target.checked }))}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-gray-300">Popular</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingPackage.active}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, active: e.target.checked }))}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-gray-300">Active</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Pricing Tab */}
                  {activeEditorTab === 'pricing' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Regular Price ({SAUDI_RIYAL_SYMBOL})</label>
                          <input
                            type="number"
                            value={editingPackage.price}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Discount Price ({SAUDI_RIYAL_SYMBOL})</label>
                          <input
                            type="number"
                            value={editingPackage.discountPrice}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, discountPrice: parseInt(e.target.value) }))}
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Rating (0-5)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={editingPackage.rating}
                            onChange={(e) => setEditingPackage(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gallery Tab */}
                  {activeEditorTab === 'gallery' && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Gallery Images</h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {editingPackage.gallery.length}/5 images • Max 2MB each
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {/* Upload Button */}
                          <label className={`px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                            editingPackage.gallery.length >= 5
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-primary-500 text-white hover:bg-primary-600'
                          }`}>
                            <Upload className="w-4 h-4" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleGalleryUpload}
                              disabled={editingPackage.gallery.length >= 5}
                              className="hidden"
                            />
                          </label>
                          {/* Add URL Button */}
                          <button
                            onClick={addGalleryImageUrl}
                            disabled={editingPackage.gallery.length >= 5}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                              editingPackage.gallery.length >= 5
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : isDark 
                                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            Add URL
                          </button>
                        </div>
                      </div>
                      
                      {/* Gallery Grid */}
                      {editingPackage.gallery.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          {editingPackage.gallery.map((img, index) => (
                            <div key={index} className={`relative group aspect-square rounded-xl overflow-hidden border-2 ${
                              isDark ? 'border-slate-600' : 'border-gray-200'
                            }`}>
                              <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => removeGalleryImage(index)}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center ${
                          isDark ? 'border-slate-600' : 'border-gray-300'
                        }`}>
                          <Image className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                          <p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No gallery images yet</p>
                          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Upload up to 5 images to showcase this package</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Details Tab */}
                  {activeEditorTab === 'details' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Overview</label>
                        <textarea
                          value={editingPackage.overview}
                          onChange={(e) => setEditingPackage(prev => ({ ...prev, overview: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">About Destination</label>
                        <textarea
                          value={editingPackage.aboutDestination}
                          onChange={(e) => setEditingPackage(prev => ({ ...prev, aboutDestination: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-300">What's Included</label>
                            <button onClick={() => addIncludedItem('included')} className="text-primary-400 text-sm">+ Add</button>
                          </div>
                          <div className="space-y-2">
                            {editingPackage.included.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg">
                                <Check className="w-4 h-4 text-green-400" />
                                <span className="flex-1 text-gray-300">{item}</span>
                                <button onClick={() => removeItem('included', index)} className="text-red-400">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-300">Not Included</label>
                            <button onClick={() => addIncludedItem('notIncluded')} className="text-primary-400 text-sm">+ Add</button>
                          </div>
                          <div className="space-y-2">
                            {editingPackage.notIncluded.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg">
                                <X className="w-4 h-4 text-red-400" />
                                <span className="flex-1 text-gray-300">{item}</span>
                                <button onClick={() => removeItem('notIncluded', index)} className="text-red-400">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Itinerary Tab */}
                  {activeEditorTab === 'itinerary' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Daily Itinerary</h3>
                        <button
                          onClick={addItineraryDay}
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Day
                        </button>
                      </div>
                      <div className="space-y-4">
                        {editingPackage.itinerary.map((day, index) => (
                          <div key={index} className="p-4 bg-slate-700 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-3 py-1 bg-primary-500 text-white rounded-full text-sm font-semibold">
                                Day {day.day}
                              </span>
                              <button onClick={() => removeItineraryDay(index)} className="text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                              placeholder="Day Title"
                              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white mb-2"
                            />
                            <textarea
                              value={day.description}
                              onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                              placeholder="Day Description"
                              rows={2}
                              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Editor Footer */}
                <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="px-6 py-3 bg-slate-700 text-white rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePackage}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Package
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminHolidays;
