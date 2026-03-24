const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { getSessionFromRequest } = require('../utils/session');

const router = express.Router();

function mapBookingRow(row) {
  return {
    id: String(row.id),
    bookingId: row.booking_code,
    bookingCode: row.booking_code,
    type: 'package',
    title: row.package_title,
    packageTitle: row.package_title,
    destination: row.destination,
    date: row.travel_date,
    travelDate: row.travel_date,
    travelers: row.travelers,
    amount: Number(row.total_amount || 0),
    totalAmount: Number(row.total_amount || 0),
    image: row.image_url || '',
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    details: {
      id: String(row.id),
      bookingId: row.booking_code,
      packageId: row.package_id ? String(row.package_id) : null,
      packageTitle: row.package_title,
      destination: row.destination,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      travelers: row.travelers,
      travelDate: row.travel_date,
      specialRequests: row.special_requests,
      pricePerPerson: Number(row.price_per_person || 0),
      totalAmount: Number(row.total_amount || 0),
      status: row.status,
      paymentStatus: row.payment_status,
      bookedAt: row.created_at
    }
  };
}

function buildBookingCode() {
  return `EH-${Date.now()}`;
}

async function requireUser(req, res) {
  const sessionData = await getSessionFromRequest(req, 'user');

  if (!sessionData || !sessionData.session.user_record_id) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return null;
  }

  return sessionData;
}

router.get('/', async (req, res, next) => {
  try {
    const sessionData = await requireUser(req, res);

    if (!sessionData) {
      return;
    }

    const result = await query(
      `
        SELECT
          hb.*,
          p.title AS package_title,
          p.destination,
          p.image_url
        FROM holiday_bookings hb
        LEFT JOIN packages p ON p.id = hb.package_id
        WHERE hb.user_id = $1
        ORDER BY hb.created_at DESC
      `,
      [sessionData.session.user_record_id]
    );

    res.json({
      success: true,
      data: result.rows.map(mapBookingRow)
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  [
    body('packageId').notEmpty().withMessage('Package is required'),
    body('travelers').isInt({ min: 1 }).withMessage('At least one traveler is required'),
    body('travelDate').notEmpty().withMessage('Travel date is required')
  ],
  async (req, res, next) => {
    try {
      const sessionData = await requireUser(req, res);

      if (!sessionData) {
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array()[0].msg });
      }

      const { packageId, travelers, travelDate, specialRequests = '' } = req.body;
      const packageResult = await query(
        'SELECT id, title, destination, price, discount_price, image_url FROM packages WHERE id = $1 AND is_active = TRUE LIMIT 1',
        [packageId]
      );

      const selectedPackage = packageResult.rows[0];

      if (!selectedPackage) {
        return res.status(404).json({ success: false, error: 'Package not found' });
      }

      const salePrice = Number(selectedPackage.discount_price || selectedPackage.price || 0);
      const bookingResult = await query(
        `
          INSERT INTO holiday_bookings (
            booking_code, user_id, package_id, customer_name, customer_email, customer_phone,
            travelers, travel_date, special_requests, price_per_person, total_amount,
            status, payment_status
          )
          VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11,
            'pending', 'unpaid'
          )
          RETURNING id
        `,
        [
          buildBookingCode(),
          sessionData.session.user_record_id,
          selectedPackage.id,
          sessionData.session.user_name,
          sessionData.session.user_email,
          sessionData.session.user_phone || '',
          parseInt(travelers, 10),
          travelDate,
          specialRequests,
          salePrice,
          salePrice * parseInt(travelers, 10)
        ]
      );

      const createdBooking = await query(
        `
          SELECT
            hb.*,
            p.title AS package_title,
            p.destination,
            p.image_url
          FROM holiday_bookings hb
          LEFT JOIN packages p ON p.id = hb.package_id
          WHERE hb.id = $1
          LIMIT 1
        `,
        [bookingResult.rows[0].id]
      );

      res.status(201).json({
        success: true,
        data: mapBookingRow(createdBooking.rows[0])
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const sessionData = await requireUser(req, res);

    if (!sessionData) {
      return;
    }

    const updated = await query(
      `
        UPDATE holiday_bookings
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING id
      `,
      [req.params.id, sessionData.session.user_record_id]
    );

    if (!updated.rows[0]) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const bookingResult = await query(
      `
        SELECT
          hb.*,
          p.title AS package_title,
          p.destination,
          p.image_url
        FROM holiday_bookings hb
        LEFT JOIN packages p ON p.id = hb.package_id
        WHERE hb.id = $1
        LIMIT 1
      `,
      [updated.rows[0].id]
    );

    res.json({ success: true, data: mapBookingRow(bookingResult.rows[0]) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
