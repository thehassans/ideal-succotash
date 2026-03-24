const crypto = require('crypto');

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(':');
  const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');

  return crypto.timingSafeEqual(
    Buffer.from(originalHash, 'hex'),
    Buffer.from(derivedHash, 'hex')
  );
}

function generateSessionToken() {
  return crypto.randomBytes(48).toString('hex');
}

function buildAvatarUrl(name = 'User') {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
}

module.exports = {
  createPasswordHash,
  verifyPassword,
  generateSessionToken,
  buildAvatarUrl
};
