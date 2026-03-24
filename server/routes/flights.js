const express = require('express');
const router = express.Router();

// Sample flights data
const sampleFlights = [
  {
    id: 1,
    origin: "Dhaka (DAC)",
    destination: "Dubai (DXB)",
    airline: "Emirates",
    price: 45000,
    currency: "SAR",
    departure_time: "2024-12-20T08:00:00",
    arrival_time: "2024-12-20T12:30:00",
    flight_class: "economy",
    available_seats: 45
  },
  {
    id: 2,
    origin: "Dhaka (DAC)",
    destination: "Singapore (SIN)",
    airline: "Singapore Airlines",
    price: 38000,
    currency: "SAR",
    departure_time: "2024-12-21T14:00:00",
    arrival_time: "2024-12-21T22:00:00",
    flight_class: "economy",
    available_seats: 32
  },
  {
    id: 3,
    origin: "Dhaka (DAC)",
    destination: "Bangkok (BKK)",
    airline: "Thai Airways",
    price: 28000,
    currency: "SAR",
    departure_time: "2024-12-22T10:00:00",
    arrival_time: "2024-12-22T14:30:00",
    flight_class: "economy",
    available_seats: 58
  },
  {
    id: 4,
    origin: "Dhaka (DAC)",
    destination: "Kuala Lumpur (KUL)",
    airline: "Malaysia Airlines",
    price: 32000,
    currency: "SAR",
    departure_time: "2024-12-23T16:00:00",
    arrival_time: "2024-12-23T23:00:00",
    flight_class: "economy",
    available_seats: 28
  }
];

// Popular destinations from Bangladesh
const popularDestinations = [
  { code: "DXB", city: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400" },
  { code: "SIN", city: "Singapore", country: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400" },
  { code: "BKK", city: "Bangkok", country: "Thailand", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400" },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400" },
  { code: "MLE", city: "Male", country: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400" },
  { code: "DEL", city: "Delhi", country: "India", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400" }
];

// Get all flights
router.get('/', (req, res) => {
  res.json({ success: true, data: sampleFlights });
});

// Get popular destinations
router.get('/destinations', (req, res) => {
  res.json({ success: true, data: popularDestinations });
});

// Search flights
router.post('/search', (req, res) => {
  const { origin, destination, departDate, returnDate, passengers, flightClass } = req.body;
  
  let results = [...sampleFlights];
  
  if (origin) {
    results = results.filter(f => 
      f.origin.toLowerCase().includes(origin.toLowerCase())
    );
  }
  if (destination) {
    results = results.filter(f => 
      f.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }
  if (flightClass) {
    results = results.filter(f => f.flight_class === flightClass);
  }
  
  res.json({
    success: true,
    data: results,
    searchParams: { origin, destination, departDate, returnDate, passengers, flightClass }
  });
});

module.exports = router;
