const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, upsertUser } = require('../config/database');
const { verifyPassword } = require('../utils/security');
const { createSession, deleteSession, getSessionFromRequest } = require('../utils/session');

const router = express.Router();

function mapUserRow(row) {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    avatar: row.avatar || '',
    provider: row.provider || 'email',
    createdAt: row.created_at
  };
}

function validationErrorResponse(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
    return true;
  }

  return false;
}

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res, next) => {
    try {
      if (validationErrorResponse(req, res)) {
        return;
      }

      const { name, email, password, phone } = req.body;
      const normalizedEmail = email.toLowerCase();
      const existingUser = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [normalizedEmail]);

      if (existingUser.rows[0]) {
        return res.status(409).json({ success: false, error: 'Email already registered' });
      }

      const user = await upsertUser({ name, email: normalizedEmail, phone, password });
      const token = await createSession({ sessionType: 'user', userId: user.id });

      res.status(201).json({
        success: true,
        data: {
          token,
          user: mapUserRow(user)
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res, next) => {
    try {
      if (validationErrorResponse(req, res)) {
        return;
      }

      const { email, password } = req.body;
      const result = await query(
        `
          SELECT id, name, email, phone, password_hash, avatar, provider, created_at
          FROM users
          WHERE email = $1
          LIMIT 1
        `,
        [email.toLowerCase()]
      );

      const user = result.rows[0];

      if (!user || !verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const token = await createSession({ sessionType: 'user', userId: user.id });

      res.json({
        success: true,
        data: {
          token,
          user: mapUserRow(user)
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/me', async (req, res, next) => {
  try {
    const sessionData = await getSessionFromRequest(req, 'user');

    if (!sessionData || !sessionData.session.user_record_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: String(sessionData.session.user_record_id),
          name: sessionData.session.user_name,
          email: sessionData.session.user_email,
          phone: sessionData.session.user_phone || '',
          avatar: sessionData.session.user_avatar || '',
          provider: sessionData.session.user_provider || 'email',
          createdAt: sessionData.session.user_created_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const sessionData = await getSessionFromRequest(req, 'user');

    if (sessionData?.token) {
      await deleteSession(sessionData.token);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const result = await query(
      `
        SELECT id, name, email, phone, avatar, provider, created_at
        FROM users
        ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      data: result.rows.map(mapUserRow)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
