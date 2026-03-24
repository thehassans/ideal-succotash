const express = require('express');
const { query } = require('../config/database');
const { mapPackageRow } = require('../utils/packages');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { category, popular, featured, limit, includeInactive, search } = req.query;
    const where = [];
    const values = [];

    if (includeInactive !== 'true') {
      where.push('is_active = TRUE');
    }

    if (category && category !== 'all') {
      values.push(category);
      where.push(`category = $${values.length}`);
    }

    if (popular === 'true') {
      where.push('is_popular = TRUE');
    }

    if (featured === 'true') {
      where.push('is_featured = TRUE');
    }

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      where.push(`(LOWER(title) LIKE $${values.length} OR LOWER(destination) LIKE $${values.length})`);
    }

    let sql = 'SELECT * FROM packages';

    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }

    sql += ' ORDER BY is_featured DESC, is_popular DESC, id ASC';

    if (limit) {
      values.push(parseInt(limit, 10));
      sql += ` LIMIT $${values.length}`;
    }

    const result = await query(sql, values);

    res.json({
      success: true,
      data: result.rows.map(mapPackageRow)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/search', async (req, res, next) => {
  try {
    const { destination, departDate, returnDate, passengers } = req.body;
    const values = [];
    let sql = 'SELECT * FROM packages WHERE is_active = TRUE';

    if (destination) {
      values.push(`%${destination.toLowerCase()}%`);
      sql += ` AND LOWER(destination) LIKE $${values.length}`;
    }

    sql += ' ORDER BY is_featured DESC, is_popular DESC, id ASC';

    const result = await query(sql, values);

    res.json({
      success: true,
      data: result.rows.map(mapPackageRow),
      searchParams: { destination, departDate, returnDate, passengers }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const identifier = req.params.id;
    const isNumericId = /^\d+$/.test(identifier);
    const result = await query(
      isNumericId
        ? 'SELECT * FROM packages WHERE id = $1 LIMIT 1'
        : 'SELECT * FROM packages WHERE slug = $1 LIMIT 1',
      [identifier]
    );

    const pkg = result.rows[0];

    if (!pkg) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    res.json({ success: true, data: mapPackageRow(pkg) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
