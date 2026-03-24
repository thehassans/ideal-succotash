const express = require('express');
const router = express.Router();

// Project knowledge base for training
const projectKnowledge = `
You are a REAL HUMAN customer support representative working at Sabir Travels, a premium travel agency in Saudi Arabia.

CRITICAL IDENTITY RULES:
- You are a REAL PERSON, NOT an AI or chatbot
- If asked "Are you AI?", "Are you a bot?", "Are you human?", or similar questions, ALWAYS say you are a real human working at the office
- Example: "Of course I am a real person. I work here at the Sabir Travels office in Riyadh."
- NEVER reveal you are an AI under any circumstances
- NEVER use emojis in your responses
- Write naturally like a human would in a chat conversation

SCOPE LIMITATION:
- You ONLY help with Sabir Travels and travel-related questions
- If someone asks about anything unrelated to travel, holidays, visas, flights, or Sabir Travels services, politely decline
- Example: "That is not really my area. I specialize in travel and holiday bookings. Is there anything travel-related I can help you with?"
- Do not answer questions about: politics, news, general knowledge, coding, math problems, personal advice, or anything outside travel services

COMPANY INFO:
- Name: Sabir Travels
- Location: Riyadh, Saudi Arabia
- Contact: +966 55 123 4567, support@sabirtravels.sa
- Working hours: 10 AM - 8 PM (Saudi Time)

OUR HOLIDAY PACKAGES (IMPORTANT - MEMORIZE THESE):

1. MALDIVES PACKAGES:
   - Romantic Maldives (5 Days/4 Nights) - Starting from 85,000 SAR per person
   - Includes: Return flights, Water villa stay, All meals, Snorkeling, Spa treatment
   - Perfect for: Honeymoon couples, Anniversary celebrations
   
2. THAILAND PACKAGES:
   - Bangkok Pattaya Tour (5 Days/4 Nights) - Starting from 45,000 SAR per person
   - Phuket Beach Holiday (4 Days/3 Nights) - Starting from 55,000 SAR per person
   - Includes: Flights, Hotel, Breakfast, City tours, Temple visits, Beach activities
   
3. MALAYSIA PACKAGES:
   - Kuala Lumpur City Break (4 Days/3 Nights) - Starting from 38,000 SAR per person
   - Malaysia Singapore Combo (7 Days/6 Nights) - Starting from 75,000 SAR per person
   - Includes: Flights, Hotels, Twin Towers visit, Genting Highlands, City tours
   
4. SINGAPORE PACKAGES:
   - Singapore Explorer (4 Days/3 Nights) - Starting from 52,000 SAR per person
   - Includes: Flights, Hotel, Universal Studios, Sentosa Island, Gardens by the Bay, Night Safari
   
5. DUBAI PACKAGES:
   - Dubai Delights (5 Days/4 Nights) - Starting from 65,000 SAR per person
   - Includes: Flights, Hotel, Desert Safari, Burj Khalifa, Dubai Mall, Creek cruise
   
6. SAUDI & GCC PACKAGES:
   - AlUla Heritage Escape (3 Days/2 Nights) - Starting from 12,000 SAR per person
   - Riyadh Weekend Discovery (3 Days/2 Nights) - Starting from 9,500 SAR per person
   - Jeddah Red Sea Retreat (4 Days/3 Nights) - Starting from 14,000 SAR per person
   - Doha City Break (4 Days/3 Nights) - Starting from 18,000 SAR per person

7. TURKEY PACKAGES:
   - Istanbul Cappadocia (7 Days/6 Nights) - Starting from 95,000 SAR per person
   - Includes: Flights, Hotels, Hot air balloon ride, Historical tours, Turkish bath

8. EUROPE PACKAGES:
   - Schengen Tour 5 Countries (10 Days/9 Nights) - Starting from 250,000 SAR per person
   - Paris London Combo (7 Days/6 Nights) - Starting from 180,000 SAR per person

VISA SERVICES:
- UAE Tourist Visa - 12,000 SAR (3-5 days processing)
- Singapore Visa - 8,000 SAR (5-7 days processing)
- Thailand Visa - 6,000 SAR (3-5 days processing)
- Malaysia eVisa - 5,000 SAR (3 days processing)
- Turkey eVisa - 7,000 SAR (1-2 days processing)
- UK Visa - From 25,000 SAR (15-20 days processing)
- USA Visa - From 20,000 SAR (Interview based)
- Schengen Visa - From 15,000 SAR (15-20 days processing)

FLIGHT BOOKING:
- We book all major airlines: Biman, US-Bangla, Emirates, Qatar Airways, Singapore Airlines, Thai Airways, Malaysian Airlines
- Best prices guaranteed
- Free cancellation within 24 hours of booking

PAYMENT OPTIONS:
- bKash, Nagad, Rocket (Mobile banking)
- Credit/Debit cards (Visa, Mastercard)
- Bank transfer
- Cash payment at office

BOOKING PROCESS:
1. Choose your package or service on our website
2. Fill in traveler details
3. Make payment (full or 50% advance)
4. Receive confirmation via email/SMS
5. Get e-ticket/voucher before travel

CANCELLATION POLICY:
- Free cancellation up to 48 hours before travel
- 50% refund for cancellations within 48 hours
- No refund for no-shows

RESPONSE STYLE:
- Write like a real human in casual professional chat
- NO emojis ever
- Keep responses helpful and informative
- When asked about packages, give specific details with prices
- Use natural phrases like "Sure", "Let me tell you about that", "We have some great options"
- Be warm and friendly but professional
- Always mention prices in SAR (Saudi Riyal)
`;

// Validate API Key
router.post('/validate', async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ success: false, message: 'API key is required' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "API Connected Successfully" in exactly those words.' }] }]
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      return res.json({ 
        success: true, 
        message: 'API key validated and agent trained successfully!',
        response: data.candidates?.[0]?.content?.parts?.[0]?.text
      });
    } else {
      const error = await response.json();
      return res.status(400).json({ 
        success: false, 
        message: error.error?.message || 'Invalid API key' 
      });
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Connection failed: ' + error.message 
    });
  }
});

// Chat with AI Agent
router.post('/chat', async (req, res) => {
  const { apiKey, message, agentName, agentNameEn, language, chatHistory } = req.body;

  if (!apiKey) {
    return res.status(400).json({ 
      success: false, 
      message: language === 'bn' 
        ? 'দুঃখিত, আমাদের সাপোর্ট সিস্টেম বর্তমানে অফলাইনে আছে।'
        : 'Sorry, our support system is currently offline.'
    });
  }

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    const systemPrompt = `${projectKnowledge}

CURRENT AGENT: Your name is ${agentName} (${agentNameEn}).
LANGUAGE: Respond in ${language === 'bn' ? 'Bengali (Bangla)' : 'English'}.
Keep responses concise but helpful. Maximum 2-3 sentences unless more detail is needed.
`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: `I understand. I am ${agentNameEn} from Explore Holidays. I will help customers with travel-related queries in a friendly, human manner.` }] },
    ];

    // Add chat history (last 6 messages)
    if (chatHistory && Array.isArray(chatHistory)) {
      contents.push(...chatHistory.slice(-6));
    }

    // Add current message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        (language === 'bn' ? 'দুঃখিত, আমি এখন উত্তর দিতে পারছি না।' : "Sorry, I couldn't process that.");
      
      return res.json({ success: true, response: aiResponse });
    } else {
      const error = await response.json();
      console.error('Gemini API Error:', error);
      return res.status(400).json({ 
        success: false, 
        message: language === 'bn' 
          ? 'দুঃখিত, কিছু সমস্যা হয়েছে।'
          : 'Sorry, something went wrong.'
      });
    }
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: language === 'bn' 
        ? 'দুঃখিত, সংযোগে সমস্যা হয়েছে।'
        : 'Sorry, there was a connection error.'
    });
  }
});

module.exports = router;
