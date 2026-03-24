const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array()[0].msg });
      }

      const { name, email, phone = '', subject, message, source = 'contact' } = req.body;
      const result = await query(
        `
          INSERT INTO contact_inquiries (name, email, phone, subject, message, source, status)
          VALUES ($1, $2, $3, $4, $5, $6, 'pending')
          RETURNING id, created_at
        `,
        [name, email.toLowerCase(), phone, subject, message, source]
      );

      res.status(201).json({
        success: true,
        data: {
          id: String(result.rows[0].id),
          createdAt: result.rows[0].created_at
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
