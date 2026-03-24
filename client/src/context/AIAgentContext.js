import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatSaudiRiyal } from '../utils/currency';

const AIAgentContext = createContext();

const formatAgentAmount = (value) => formatSaudiRiyal(value, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export const useAIAgent = () => {
  const context = useContext(AIAgentContext);
  if (!context) {
    // Fallback when context is not available - default to enabled
    return { 
      isEnabled: true, 
      agentName: 'Support',
      agentAvatar: '',
      sendMessage: () => Promise.resolve('Sorry, please try again later.'),
      isTyping: false,
      chatSettings: {
        queueAssignTime: 12,
        typingStartDelay: 8,
        replyTimePerWord: 2.5,
        followUpTimeout: 60,
        endChatTimeout: 30
      },
      currentAgent: { name: 'Support Agent', name_en: 'Support Agent', avatar: '' },
      saveChat: () => {},
      generateChatId: () => `EH-${Date.now()}`
    };
  }
  return context;
};

// 15 Bangla agent names with South Asian/Bangladeshi profile pictures
const agents = [
  // Male agents with South Asian male faces
  { name: 'রাফি আহমেদ', name_en: 'Rafi Ahmed', avatar: 'https://randomuser.me/api/portraits/men/86.jpg', gender: 'male' },
  { name: 'সাকিব হাসান', name_en: 'Sakib Hasan', avatar: 'https://randomuser.me/api/portraits/men/87.jpg', gender: 'male' },
  { name: 'মাহমুদ হক', name_en: 'Mahmud Hoque', avatar: 'https://randomuser.me/api/portraits/men/88.jpg', gender: 'male' },
  { name: 'আরিফ চৌধুরী', name_en: 'Arif Chowdhury', avatar: 'https://randomuser.me/api/portraits/men/89.jpg', gender: 'male' },
  { name: 'তৌহিদ ইসলাম', name_en: 'Tawhid Islam', avatar: 'https://randomuser.me/api/portraits/men/90.jpg', gender: 'male' },
  { name: 'রাকিব হোসেন', name_en: 'Rakib Hossain', avatar: 'https://randomuser.me/api/portraits/men/91.jpg', gender: 'male' },
  { name: 'শাহরিয়ার কবির', name_en: 'Shahriar Kabir', avatar: 'https://randomuser.me/api/portraits/men/92.jpg', gender: 'male' },
  { name: 'ইমরান হোসাইন', name_en: 'Imran Hossain', avatar: 'https://randomuser.me/api/portraits/men/93.jpg', gender: 'male' },
  // Female agents with South Asian female faces
  { name: 'তানিয়া আক্তার', name_en: 'Tania Akter', avatar: 'https://randomuser.me/api/portraits/women/86.jpg', gender: 'female' },
  { name: 'নুসরাত জাহান', name_en: 'Nusrat Jahan', avatar: 'https://randomuser.me/api/portraits/women/87.jpg', gender: 'female' },
  { name: 'ফারিয়া রহমান', name_en: 'Faria Rahman', avatar: 'https://randomuser.me/api/portraits/women/88.jpg', gender: 'female' },
  { name: 'সুমাইয়া খান', name_en: 'Sumaiya Khan', avatar: 'https://randomuser.me/api/portraits/women/89.jpg', gender: 'female' },
  { name: 'মিথিলা সরকার', name_en: 'Mithila Sarker', avatar: 'https://randomuser.me/api/portraits/women/90.jpg', gender: 'female' },
  { name: 'সাবরিনা ইসলাম', name_en: 'Sabrina Islam', avatar: 'https://randomuser.me/api/portraits/women/91.jpg', gender: 'female' },
  { name: 'তাসনিম ফেরদৌস', name_en: 'Tasnim Ferdous', avatar: 'https://randomuser.me/api/portraits/women/92.jpg', gender: 'female' },
];

// Generate unique chat ID
const generateChatId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `EH-${timestamp}-${random}`.toUpperCase();
};

// Safe localStorage access for mobile compatibility
const safeGetItem = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const safeGetString = (key, defaultValue = '') => {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch {
    return defaultValue;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent fail for localStorage issues on mobile
  }
};

const safeSetString = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silent fail for localStorage issues on mobile
  }
};

export const AIAgentProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(() => safeGetItem('aiAgentEnabled', true));
  
  const [apiKey, setApiKey] = useState(() => safeGetString('geminiApiKey', ''));
  
  const [currentAgent, setCurrentAgent] = useState(() => {
    const randomIndex = Math.floor(Math.random() * agents.length);
    return agents[randomIndex];
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [trainingLogs, setTrainingLogs] = useState(() => safeGetItem('aiTrainingLogs', []));

  // Saved chat sessions for admin panel
  const [savedChats, setSavedChats] = useState(() => safeGetItem('aiSavedChats', []));

  // Configurable timing settings (in seconds)
  const [chatSettings, setChatSettings] = useState(() => safeGetItem('aiChatSettings', {
    queueAssignTime: 12,      // Time before agent is assigned (seconds)
    typingStartDelay: 8,      // Delay before typing indicator starts (seconds)
    replyTimePerWord: 2.5,    // Seconds per word for typing reply
    followUpTimeout: 60,      // Seconds before asking if user needs more help
    endChatTimeout: 30        // Seconds after follow-up before ending chat
  }));

  // Rotate agent randomly
  const rotateAgent = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * agents.length);
    setCurrentAgent(agents[randomIndex]);
  }, []);

  // Save settings to localStorage (with safe access)
  useEffect(() => {
    safeSetItem('aiAgentEnabled', isEnabled);
  }, [isEnabled]);

  useEffect(() => {
    if (apiKey) {
      safeSetString('geminiApiKey', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    safeSetItem('aiTrainingLogs', trainingLogs);
  }, [trainingLogs]);

  useEffect(() => {
    safeSetItem('aiChatSettings', chatSettings);
  }, [chatSettings]);

  useEffect(() => {
    safeSetItem('aiSavedChats', savedChats);
  }, [savedChats]);

  // Save a chat session
  const saveChat = useCallback((chatData) => {
    const chatSession = {
      id: chatData.chatId || generateChatId(),
      agentName: chatData.agentName,
      agentAvatar: chatData.agentAvatar,
      messages: chatData.messages,
      startedAt: chatData.startedAt || new Date().toISOString(),
      endedAt: new Date().toISOString(),
      status: chatData.status || 'completed'
    };
    setSavedChats(prev => [chatSession, ...prev].slice(0, 100)); // Keep last 100 chats
    return chatSession.id;
  }, []);

  // Delete a saved chat
  const deleteChat = useCallback((chatId) => {
    setSavedChats(prev => prev.filter(chat => chat.id !== chatId));
  }, []);

  // Clear all saved chats
  const clearAllChats = useCallback(() => {
    setSavedChats([]);
  }, []);

  // Update chat settings
  const updateChatSettings = useCallback((newSettings) => {
    setChatSettings(prev => ({ ...prev, ...newSettings }));
    addTrainingLog({
      type: 'info',
      message: 'Chat settings updated',
      details: JSON.stringify(newSettings)
    });
  }, []);

  // Add training log
  const addTrainingLog = useCallback((log) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...log
    };
    setTrainingLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  }, []);

  // Train the AI agent (validate API key via backend)
  const trainAgent = useCallback(async (newApiKey) => {
    try {
      const response = await fetch('/api/ai-agent/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newApiKey })
      });

      const data = await response.json();

      if (data.success) {
        setApiKey(newApiKey);
        addTrainingLog({
          type: 'success',
          message: 'API key validated and agent trained successfully',
          details: 'Gemini Pro connected'
        });
        return { success: true, message: 'Agent trained successfully!' };
      } else {
        addTrainingLog({
          type: 'error',
          message: 'API key validation failed',
          details: data.message || 'Unknown error'
        });
        return { success: false, message: data.message || 'Invalid API key' };
      }
    } catch (error) {
      addTrainingLog({
        type: 'error',
        message: 'Connection failed',
        details: error.message
      });
      return { success: false, message: 'Connection failed: ' + error.message };
    }
  }, [addTrainingLog]);

  // Destination-specific package info
  const destinationInfo = {
    maldives: {
      name: 'Maldives',
      name_bn: 'মালদ্বীপ',
      packages: [
        { name: 'Romantic Getaway', name_bn: 'রোমান্টিক গেটওয়ে', days: '4N/5D', price: 85000, includes: 'Resort stay, speedboat transfers, breakfast & dinner, snorkeling' },
        { name: 'Luxury Paradise', name_bn: 'লাক্সারি প্যারাডাইস', days: '5N/6D', price: 120000, includes: 'Water villa, all meals, spa, water sports, island hopping' },
        { name: 'Budget Explorer', name_bn: 'বাজেট এক্সপ্লোরার', days: '3N/4D', price: 55000, includes: 'Guesthouse stay, breakfast, 1 excursion' }
      ],
      highlights: 'crystal clear waters, overwater villas, world-class diving, pristine beaches'
    },
    thailand: {
      name: 'Thailand',
      name_bn: 'থাইল্যান্ড',
      packages: [
        { name: 'Bangkok & Pattaya', name_bn: 'ব্যাংকক ও পাতায়া', days: '5N/6D', price: 45000, includes: 'Hotels, transfers, city tours, Coral Island trip' },
        { name: 'Phuket Beach Holiday', name_bn: 'ফুকেট বীচ হলিডে', days: '4N/5D', price: 55000, includes: 'Beach resort, Phi Phi Island tour, transfers' },
        { name: 'Complete Thailand', name_bn: 'কমপ্লিট থাইল্যান্ড', days: '7N/8D', price: 75000, includes: 'Bangkok, Pattaya, Phuket, all transfers, tours' }
      ],
      highlights: 'temples, street food, beaches, nightlife, shopping'
    },
    dubai: {
      name: 'Dubai',
      name_bn: 'দুবাই',
      packages: [
        { name: 'Dubai Explorer', name_bn: 'দুবাই এক্সপ্লোরার', days: '4N/5D', price: 65000, includes: 'Hotel, Burj Khalifa, Desert Safari, City tour' },
        { name: 'Dubai Premium', name_bn: 'দুবাই প্রিমিয়াম', days: '5N/6D', price: 95000, includes: '5-star hotel, Abu Dhabi tour, Marina cruise, all attractions' },
        { name: 'Dubai Shopping Festival', name_bn: 'দুবাই শপিং ফেস্টিভাল', days: '6N/7D', price: 85000, includes: 'Hotel near malls, shopping tours, attractions' }
      ],
      highlights: 'Burj Khalifa, desert safari, luxury shopping, modern architecture'
    },
    singapore: {
      name: 'Singapore',
      name_bn: 'সিঙ্গাপুর',
      packages: [
        { name: 'Singapore Discovery', name_bn: 'সিঙ্গাপুর ডিসকভারি', days: '4N/5D', price: 52000, includes: 'Hotel, Sentosa, Universal Studios, Night Safari' },
        { name: 'Singapore & Malaysia', name_bn: 'সিঙ্গাপুর ও মালয়েশিয়া', days: '6N/7D', price: 72000, includes: 'Both countries, Genting, all tours' }
      ],
      highlights: 'Universal Studios, Gardens by the Bay, Marina Bay, Sentosa'
    },
    malaysia: {
      name: 'Malaysia',
      name_bn: 'মালয়েশিয়া',
      packages: [
        { name: 'KL & Genting', name_bn: 'কেএল ও গেন্টিং', days: '4N/5D', price: 38000, includes: 'Hotels, Genting Highlands, city tour, Batu Caves' },
        { name: 'Malaysia Complete', name_bn: 'মালয়েশিয়া কমপ্লিট', days: '6N/7D', price: 55000, includes: 'KL, Langkawi, all tours and transfers' }
      ],
      highlights: 'Petronas Towers, Genting casino, Langkawi beaches, food paradise'
    },
    turkey: {
      name: 'Turkey',
      name_bn: 'তুরস্ক',
      packages: [
        { name: 'Istanbul Explorer', name_bn: 'ইস্তাম্বুল এক্সপ্লোরার', days: '5N/6D', price: 75000, includes: 'Hotel, Hagia Sophia, Blue Mosque, Bosphorus cruise' },
        { name: 'Turkey Grand Tour', name_bn: 'তুরস্ক গ্র্যান্ড ট্যুর', days: '8N/9D', price: 110000, includes: 'Istanbul, Cappadocia, Pamukkale, balloon ride' }
      ],
      highlights: 'Hagia Sophia, Cappadocia balloon rides, Turkish cuisine, Bosphorus'
    }
  };

  // Track conversation context
  const [conversationContext, setConversationContext] = useState({
    topic: null, // 'package', 'visa', 'flight', 'hotel', 'booking'
    destination: null,
    travelers: null,
    dates: null
  });

  // Fallback responses when API is not available - now context-aware
  const getFallbackResponse = useCallback((userMessage, language, previousMessages = []) => {
    const lowerMessage = userMessage.toLowerCase();
    const lastAgentMessage = previousMessages.filter(m => m.sender === 'agent').slice(-1)[0]?.text?.toLowerCase() || '';
    
    // Detect destination from message
    const detectDestination = (text) => {
      const destinations = ['maldives', 'thailand', 'dubai', 'singapore', 'malaysia', 'turkey', 'মালদ্বীপ', 'থাইল্যান্ড', 'দুবাই', 'সিঙ্গাপুর', 'মালয়েশিয়া', 'তুরস্ক'];
      const destinationMap = { 'মালদ্বীপ': 'maldives', 'থাইল্যান্ড': 'thailand', 'দুবাই': 'dubai', 'সিঙ্গাপুর': 'singapore', 'মালয়েশিয়া': 'malaysia', 'তুরস্ক': 'turkey' };
      for (const dest of destinations) {
        if (text.includes(dest)) {
          return destinationMap[dest] || dest;
        }
      }
      return null;
    };

    const destination = detectDestination(lowerMessage);
    
    // If user mentions a destination, give detailed package info
    if (destination && destinationInfo[destination]) {
      const info = destinationInfo[destination];
      const destName = language === 'bn' ? info.name_bn : info.name;
      
      let response = language === 'bn' 
        ? `${destName} প্যাকেজ সমূহ:\n\n`
        : `${info.name} Packages:\n\n`;
      
      info.packages.forEach((pkg, i) => {
        const pkgName = language === 'bn' ? pkg.name_bn : pkg.name;
        response += language === 'bn'
          ? `${i+1}. ${pkgName} (${pkg.days})\n   💰 ${formatAgentAmount(pkg.price)}\n   ✅ ${pkg.includes}\n\n`
          : `${i+1}. ${pkgName} (${pkg.days})\n   💰 ${formatAgentAmount(pkg.price)}\n   ✅ ${pkg.includes}\n\n`;
      });
      
      response += language === 'bn'
        ? `🌟 ${destName} হাইলাইটস: ${info.highlights}\n\nকোন প্যাকেজ বুক করতে চান? আপনার পছন্দ জানান।`
        : `🌟 ${info.name} Highlights: ${info.highlights}\n\nWhich package would you like to book? Let me know your preference.`;
      
      setConversationContext(prev => ({ ...prev, topic: 'package', destination }));
      return response;
    }

    // Handle booking intent
    if (lowerMessage.match(/(book|বুক|confirm|কনফার্ম|proceed|এগিয়ে)/)) {
      return language === 'bn'
        ? '✅ لإتمام الحجز نحتاج إلى بعض التفاصيل:\n\n1. كم عدد المسافرين؟\n2. ما تاريخ السفر المفضل؟\n3. ما رقم التواصل؟\n\nأو اتصلوا بنا مباشرة: +966 55 123 4567'
        : '✅ To proceed with booking, I need some details:\n\n1. How many travelers?\n2. Preferred travel dates?\n3. Contact number?\n\nOr call us directly: +966 55 123 4567';
    }

    // Handle number of travelers
    if (lowerMessage.match(/(\d+)\s*(person|people|জন|traveler|পার্সন)/)) {
      const num = lowerMessage.match(/(\d+)/)[1];
      setConversationContext(prev => ({ ...prev, travelers: parseInt(num) }));
      return language === 'bn'
        ? `${num} জনের জন্য নোট করেছি। ভ্রমণের তারিখ কবে পছন্দ করবেন?`
        : `Noted for ${num} travelers. What are your preferred travel dates?`;
    }

    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|হাই|হ্যালো|আসসালামু|assalamu)/)) {
      return language === 'bn' 
        ? 'السلام عليكم! 🌟 أهلاً بكم في Sabir Travels. يمكنني مساعدتكم في:\n\n• باقات العطلات\n• حجز الرحلات الجوية\n• خدمات التأشيرات\n• حجوزات الفنادق\n\nإلى أين ترغبون في السفر؟'
        : 'Hello! 🌟 Welcome to Sabir Travels. I can help you with:\n\n• Holiday Packages\n• Flight Booking\n• Visa Services\n• Hotel Booking\n\nWhere would you like to travel?';
    }
    
    // Package/tour queries
    if (lowerMessage.match(/(package|প্যাকেজ|tour|ট্যুর|holiday|হলিডে|vacation|ছুটি)/)) {
      setConversationContext(prev => ({ ...prev, topic: 'package' }));
      return language === 'bn' 
        ? `🌍 باقاتنا الأكثر طلباً:\n\n🏝️ المالديف - من ${formatAgentAmount(55000)}\n🏖️ تايلاند - من ${formatAgentAmount(45000)}\n🌆 دبي - من ${formatAgentAmount(65000)}\n🎡 سنغافورة - من ${formatAgentAmount(52000)}\n🏔️ ماليزيا - من ${formatAgentAmount(38000)}\n🕌 تركيا - من ${formatAgentAmount(75000)}\n\nما الوجهة التي تهمكم؟ اذكروا اسمها لأعرض التفاصيل.`
        : `🌍 Our Popular Packages:\n\n🏝️ Maldives - from ${formatAgentAmount(55000)}\n🏖️ Thailand - from ${formatAgentAmount(45000)}\n🌆 Dubai - from ${formatAgentAmount(65000)}\n🎡 Singapore - from ${formatAgentAmount(52000)}\n🏔️ Malaysia - from ${formatAgentAmount(38000)}\n🕌 Turkey - from ${formatAgentAmount(75000)}\n\nWhich country interests you? Tell me to see detailed packages.`;
    }
    
    // Visa queries  
    if (lowerMessage.match(/(visa|ভিসা)/)) {
      setConversationContext(prev => ({ ...prev, topic: 'visa' }));
      return language === 'bn'
        ? `📋 خدمات التأشيرات:\n\n🇦🇪 الإمارات - ${formatAgentAmount(5000)} (3-5 أيام)\n🇸🇬 سنغافورة - ${formatAgentAmount(4500)} (5-7 أيام)\n🇹🇭 تايلاند - ${formatAgentAmount(4000)} (3-5 أيام)\n🇲🇾 ماليزيا - ${formatAgentAmount(3500)} (4-6 أيام)\n🇹🇷 تركيا - ${formatAgentAmount(7000)} (7-10 أيام)\n\nما الدولة التي تحتاجون تأشيرتها؟`
        : `📋 Visa Services:\n\n🇦🇪 UAE - ${formatAgentAmount(5000)} (3-5 days)\n🇸🇬 Singapore - ${formatAgentAmount(4500)} (5-7 days)\n🇹🇭 Thailand - ${formatAgentAmount(4000)} (3-5 days)\n🇲🇾 Malaysia - ${formatAgentAmount(3500)} (4-6 days)\n🇹🇷 Turkey - ${formatAgentAmount(7000)} (7-10 days)\n\nWhich country visa do you need?`;
    }
    
    // Flight queries
    if (lowerMessage.match(/(flight|ফ্লাইট|ticket|টিকেট|air|বিমান)/)) {
      setConversationContext(prev => ({ ...prev, topic: 'flight' }));
      return language === 'bn'
        ? '✈️ আমরা সব এয়ারলাইন্সে বুক করি:\n\n• বিমান বাংলাদেশ\n• US-Bangla Airlines\n• Emirates\n• Qatar Airways\n• Singapore Airlines\n\nকোথা থেকে কোথায় যেতে চান? তারিখ জানালে দাম বলতে পারব।'
        : '✈️ We book on all airlines:\n\n• Biman Bangladesh\n• US-Bangla Airlines\n• Emirates\n• Qatar Airways\n• Singapore Airlines\n\nWhere would you like to fly? Tell me dates for pricing.';
    }
    
    // Price/cost queries
    if (lowerMessage.match(/(price|cost|দাম|খরচ|কত|how much)/)) {
      return language === 'bn'
        ? 'দাম জানতে বলুন কোন প্যাকেজ বা গন্তব্য সম্পর্কে জানতে চান। উদাহরণ: "মালদ্বীপ প্যাকেজের দাম", "দুবাই ভিসার খরচ"'
        : 'Please tell me which package or destination you want pricing for. Example: "Maldives package price", "Dubai visa cost"';
    }
    
    // Hotel queries
    if (lowerMessage.match(/(hotel|হোটেল|stay|room|রুম|resort|রিসোর্ট)/)) {
      setConversationContext(prev => ({ ...prev, topic: 'hotel' }));
      return language === 'bn'
        ? '🏨 হোটেল বুকিং:\n\nআমরা সব বড় হোটেল চেইনে বুকিং করি। কোন শহরে এবং কত তারিখে হোটেল দরকার?'
        : '🏨 Hotel Booking:\n\nWe book at all major hotel chains. Which city and dates do you need a hotel for?';
    }
    
    // Thank you / gratitude
    if (lowerMessage.match(/(thank|ধন্যবাদ|thanks|শুকরিয়া)/)) {
      return language === 'bn'
        ? 'على الرحب والسعة! 😊 إذا احتجتم أي مساعدة إضافية فأخبروني. Sabir Travels دائماً في خدمتكم.'
        : 'You\'re welcome! 😊 Let me know if you need any more help. Sabir Travels is always at your service.';
    }
    
    // Yes/confirmation
    if (lowerMessage.match(/^(yes|yeah|হ্যাঁ|জি|ok|ঠিক আছে|sure)/)) {
      if (conversationContext.topic === 'package' && conversationContext.destination) {
        return language === 'bn'
          ? `ممتاز! لحجز ${conversationContext.destination} اتصلوا على: +966 55 123 4567 أو أرسلوا رقمكم وسنتواصل معكم.`
          : `Excellent! For ${conversationContext.destination} booking, call: +966 55 123 4567 or share your number and we'll call you.`;
      }
      return language === 'bn'
        ? 'চমৎকার! কিভাবে এগিয়ে যেতে চান?'
        : 'Great! How would you like to proceed?';
    }
    
    // Contact queries
    if (lowerMessage.match(/(contact|phone|call|যোগাযোগ|ফোন|কল|number|নম্বর)/)) {
      return language === 'bn'
        ? '📞 تواصلوا معنا:\n\n☎️ الهاتف: +966 55 123 4567\n📱 واتساب: +966 55 123 4567\n📧 البريد: info@sabirtravels.sa\n🏢 المكتب: شارع العليا، الرياض\n\n⏰ أوقات العمل: 10 صباحاً - 8 مساءً'
        : '📞 Contact Us:\n\n☎️ Phone: +966 55 123 4567\n📱 WhatsApp: +966 55 123 4567\n📧 Email: info@sabirtravels.sa\n🏢 Office: Olaya Street, Riyadh\n\n⏰ Hours: 10 AM - 8 PM';
    }
    
    // Default - check if it might be a destination name or follow-up
    if (lowerMessage.length < 20 && !lowerMessage.match(/[?.!]/)) {
      // Short message might be a destination or answer
      return language === 'bn' 
        ? 'আমাদের প্যাকেজ গন্তব্য: মালদ্বীপ, থাইল্যান্ড, দুবাই, সিঙ্গাপুর, মালয়েশিয়া, তুরস্ক। কোনটি সম্পর্কে জানতে চান?'
        : 'Our package destinations: Maldives, Thailand, Dubai, Singapore, Malaysia, Turkey. Which one would you like to know about?';
    }
    
    // Default response
    return language === 'bn' 
      ? 'أنا من Sabir Travels. 🌟\n\nيمكنني المساعدة في:\n• باقات العطلات\n• حجز الرحلات الجوية\n• خدمات التأشيرات\n• حجوزات الفنادق\n\nكيف يمكنني مساعدتكم؟'
      : 'I work at Sabir Travels. 🌟\n\nI can help with:\n• Holiday Packages\n• Flight Booking\n• Visa Services\n• Hotel Booking\n\nHow can I assist you?';
  }, [conversationContext]);

  // Send message to AI agent via backend
  const sendMessage = useCallback(async (userMessage, language = 'en') => {
    setIsTyping(true);
    
    // If no API key, use fallback responses immediately
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate typing delay
      setIsTyping(false);
      return getFallbackResponse(userMessage, language);
    }

    try {
      const response = await fetch('/api/ai-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          message: userMessage,
          agentName: currentAgent.name,
          agentNameEn: currentAgent.name_en,
          language,
          chatHistory: chatHistory.slice(-6)
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiResponse = data.response;
        
        // Update chat history
        setChatHistory(prev => [
          ...prev,
          { role: 'user', parts: [{ text: userMessage }] },
          { role: 'model', parts: [{ text: aiResponse }] }
        ].slice(-10)); // Keep last 10 messages

        setIsTyping(false);
        return aiResponse;
      } else {
        setIsTyping(false);
        return getFallbackResponse(userMessage, language);
      }
    } catch (error) {
      console.error('AI Agent Error:', error);
      setIsTyping(false);
      return getFallbackResponse(userMessage, language);
    }
  }, [apiKey, currentAgent, chatHistory, getFallbackResponse]);

  // Toggle agent on/off
  const toggleAgent = useCallback(() => {
    setIsEnabled(prev => !prev);
    addTrainingLog({
      type: 'info',
      message: `Agent ${!isEnabled ? 'enabled' : 'disabled'}`,
      details: 'Status changed by admin'
    });
  }, [isEnabled, addTrainingLog]);

  // Clear chat history
  const clearHistory = useCallback(() => {
    setChatHistory([]);
    rotateAgent(); // Assign new agent on clear
  }, [rotateAgent]);

  // Clear training logs
  const clearLogs = useCallback(() => {
    setTrainingLogs([]);
    localStorage.removeItem('aiTrainingLogs');
  }, []);

  // Save API key without training
  const saveApiKey = useCallback((key) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    addTrainingLog({
      type: 'info',
      message: 'API key saved',
      details: 'Key saved to storage'
    });
  }, [addTrainingLog]);

  // Check if API is connected
  const checkConnection = useCallback(async () => {
    if (!apiKey) {
      return { success: false, message: 'No API key saved' };
    }
    try {
      const response = await fetch('/api/ai-agent/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      const data = await response.json();
      addTrainingLog({
        type: data.success ? 'success' : 'error',
        message: data.success ? 'Connection verified' : 'Connection failed',
        details: data.message
      });
      return data;
    } catch (error) {
      addTrainingLog({
        type: 'error',
        message: 'Connection check failed',
        details: error.message
      });
      return { success: false, message: error.message };
    }
  }, [apiKey, addTrainingLog]);

  const value = {
    isEnabled,
    setIsEnabled,
    apiKey,
    setApiKey,
    currentAgent,
    rotateAgent,
    isTyping,
    sendMessage,
    trainAgent,
    toggleAgent,
    trainingLogs,
    clearHistory,
    clearLogs,
    saveApiKey,
    checkConnection,
    agents,
    chatSettings,
    updateChatSettings,
    savedChats,
    saveChat,
    deleteChat,
    clearAllChats,
    generateChatId
  };

  return (
    <AIAgentContext.Provider value={value}>
      {children}
    </AIAgentContext.Provider>
  );
};

export default AIAgentContext;
