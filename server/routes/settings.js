const express = require('express');
const { getSiteSettings, getPartners } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const settings = await getSiteSettings();
    const partners = await getPartners();

    res.json({
      success: true,
      data: {
        ...settings,
        partners
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
