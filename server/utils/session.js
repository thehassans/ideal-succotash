const { query } = require('../config/database');
const { generateSessionToken } = require('./security');

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || '';

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return req.headers['x-auth-token'] || req.headers['x-admin-token'] || null;
}

async function createSession({ sessionType, userId = null, adminUserId = null, expiresInDays = 7 }) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  await query(
    `
      INSERT INTO auth_sessions (token, session_type, user_id, admin_user_id, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [token, sessionType, userId, adminUserId, expiresAt.toISOString()]
  );

  return token;
}

async function deleteSession(token) {
  if (!token) {
    return;
  }

  await query('DELETE FROM auth_sessions WHERE token = $1', [token]);
}

async function getSession(token, expectedType = null) {
  if (!token) {
    return null;
  }

  const result = await query(
    `
      SELECT
        s.id AS session_id,
        s.token,
        s.session_type,
        s.user_id,
        s.admin_user_id,
        s.expires_at,
        u.id AS user_record_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        u.avatar AS user_avatar,
        u.provider AS user_provider,
        u.created_at AS user_created_at,
        a.id AS admin_record_id,
        a.username AS admin_username,
        a.email AS admin_email,
        a.role AS admin_role,
        a.created_at AS admin_created_at
      FROM auth_sessions s
      LEFT JOIN users u ON u.id = s.user_id
      LEFT JOIN admin_users a ON a.id = s.admin_user_id
      WHERE s.token = $1
        AND s.expires_at > NOW()
      LIMIT 1
    `,
    [token]
  );

  const session = result.rows[0];

  if (!session) {
    return null;
  }

  if (expectedType && session.session_type !== expectedType) {
    return null;
  }

  return session;
}

async function getSessionFromRequest(req, expectedType = null) {
  const token = getTokenFromRequest(req);
  const session = await getSession(token, expectedType);

  if (!session) {
    return null;
  }

  return { token, session };
}

module.exports = {
  getTokenFromRequest,
  createSession,
  deleteSession,
  getSession,
  getSessionFromRequest
};
