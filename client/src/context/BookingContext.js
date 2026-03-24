import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    return { 
      bookings: [], 
      addBooking: () => {},
      getBookings: () => [],
      getBookingById: () => {},
      cancelBooking: () => {},
      updateBookingStatus: () => {},
      loadBookings: () => {},
      loading: false
    };
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { user, authToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLocalBookingKey = useCallback(() => `bookings_${user?.email}`, [user]);

  const loadLocalBookings = useCallback(() => {
    if (!user) {
      return [];
    }

    const storedBookings = localStorage.getItem(getLocalBookingKey());
    return storedBookings ? JSON.parse(storedBookings) : [];
  }, [getLocalBookingKey, user]);

  const saveLocalBookings = useCallback((nextBookings) => {
    if (!user) {
      return;
    }

    const localOnlyBookings = nextBookings.filter((booking) => booking.source !== 'server');
    localStorage.setItem(getLocalBookingKey(), JSON.stringify(localOnlyBookings));
  }, [getLocalBookingKey, user]);

  const loadBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      return;
    }

    setLoading(true);

    const localBookings = loadLocalBookings();

    try {
      if (!authToken) {
        setBookings(localBookings);
        return;
      }

      const response = await axios.get('/api/bookings', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const serverBookings = response.data.data.map((booking) => ({
        ...booking,
        source: 'server'
      }));

      setBookings([
        ...serverBookings,
        ...localBookings
      ].sort((a, b) => new Date(b.createdAt || b.details?.bookedAt || 0) - new Date(a.createdAt || a.details?.bookedAt || 0)));
    } catch (error) {
      setBookings(localBookings);
    } finally {
      setLoading(false);
    }
  }, [authToken, loadLocalBookings, user]);

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setBookings([]);
    }
  }, [loadBookings, user]);

  const addBooking = useCallback(async (bookingData) => {
    if (bookingData.type === 'package' && authToken) {
      const response = await axios.post('/api/bookings', {
        packageId: bookingData.packageId || bookingData.details?.packageId,
        travelers: bookingData.travelers,
        travelDate: bookingData.date || bookingData.travelDate,
        specialRequests: bookingData.specialRequests || bookingData.details?.specialRequests || ''
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const createdBooking = {
        ...response.data.data,
        source: 'server'
      };

      setBookings((prev) => [createdBooking, ...prev.filter((booking) => booking.id !== createdBooking.id)]);

      return createdBooking;
    }

    const newBooking = {
      id: `BK${Date.now()}`,
      ...bookingData,
      userId: user?.email,
      createdAt: new Date().toISOString(),
      status: bookingData.status || 'confirmed',
      source: 'local'
    };

    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      saveLocalBookings(updated);
      return updated;
    });

    return newBooking;
  }, [authToken, saveLocalBookings, user]);

  const getBookings = useCallback((type = null) => {
    if (type) {
      return bookings.filter(b => b.type === type);
    }
    return bookings;
  }, [bookings]);

  const getBookingById = useCallback((id) => {
    return bookings.find(b => b.id === id);
  }, [bookings]);

  const cancelBooking = useCallback(async (bookingId) => {
    const existingBooking = bookings.find((booking) => booking.id === bookingId);

    if (!existingBooking) {
      return;
    }

    if (existingBooking.source === 'server' && authToken) {
      const response = await axios.patch(`/api/bookings/${bookingId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const updatedBooking = {
        ...response.data.data,
        source: 'server'
      };

      setBookings((prev) => prev.map((booking) => booking.id === bookingId ? updatedBooking : booking));
      return updatedBooking;
    }

    setBookings((prev) => {
      const updated = prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      );
      saveLocalBookings(updated);
      return updated;
    });
  }, [authToken, bookings, saveLocalBookings]);

  const updateBookingStatus = useCallback((bookingId, status) => {
    setBookings(prev => {
      const updated = prev.map(b => 
        b.id === bookingId ? { ...b, status } : b
      );
      saveLocalBookings(updated);
      return updated;
    });
  }, [saveLocalBookings]);

  const value = {
    bookings,
    loading,
    addBooking,
    getBookings,
    getBookingById,
    cancelBooking,
    updateBookingStatus,
    loadBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
