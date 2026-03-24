const express = require('express');
const { query, getSiteSettings, getPartners } = require('../config/database');
const { verifyPassword } = require('../utils/security');
const { createSession } = require('../utils/session');
const { mapPackageRow, normalizePackagePayload } = require('../utils/packages');
const { buildInvoiceNumber, buildInvoiceLineItems, buildInvoiceAmounts, buildZatcaQrPayload } = require('../utils/invoices');

const router = express.Router();

function mapInquiryRow(row) {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    subject: row.subject,
    message: row.message,
    source: row.source,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapAdminBooking(row) {
  return {
    id: String(row.id),
    bookingId: row.booking_code,
    customerName: row.customer_name,
    email: row.customer_email,
    phone: row.customer_phone || '',
    package: row.package_title || 'Unknown Package',
    packageId: row.package_id ? String(row.package_id) : null,
    persons: row.travelers,
    travelers: row.travelers,
    totalAmount: Number(row.total_amount || 0),
    status: row.status,
    paymentStatus: row.payment_status,
    travelDate: row.travel_date,
    createdAt: row.created_at
  };
}

function mapInvoiceRow(row) {
  return {
    id: String(row.id),
    invoiceNumber: row.invoice_number,
    bookingId: row.booking_id ? String(row.booking_id) : null,
    bookingCode: row.booking_code,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    packageTitle: row.package_title,
    packageTitleAr: row.package_title_ar,
    currencyCode: row.currency_code,
    languageMode: row.language_mode,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    status: row.status,
    paymentStatus: row.payment_status,
    subtotal: Number(row.subtotal || 0),
    taxRate: Number(row.tax_rate || 0),
    taxAmount: Number(row.tax_amount || 0),
    totalAmount: Number(row.total_amount || 0),
    lineItems: Array.isArray(row.line_items) ? row.line_items : [],
    notes: row.notes || '',
    notesAr: row.notes_ar || '',
    sellerName: row.seller_name || '',
    sellerNameAr: row.seller_name_ar || '',
    sellerAddress: row.seller_address || '',
    sellerAddressAr: row.seller_address_ar || '',
    vatNumber: row.vat_number || '',
    crNumber: row.cr_number || '',
    zatcaQrPayload: row.zatca_qr_payload || '',
    zatcaQrEnabled: row.zatca_qr_enabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getBookingForInvoice(bookingId) {
  const result = await query(
    `
      SELECT
        hb.*,
        p.title AS package_title,
        p.title_bn AS package_title_ar,
        p.destination,
        p.image_url
      FROM holiday_bookings hb
      LEFT JOIN packages p ON p.id = hb.package_id
      WHERE hb.id = $1
      LIMIT 1
    `,
    [bookingId]
  );

  return result.rows[0] || null;
}

async function createOrFetchInvoiceFromBooking(bookingId, overrides = {}) {
  const existingInvoice = await query('SELECT * FROM invoices WHERE booking_id = $1 LIMIT 1', [bookingId]);

  if (existingInvoice.rows[0]) {
    return mapInvoiceRow(existingInvoice.rows[0]);
  }

  const booking = await getBookingForInvoice(bookingId);

  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  const settings = await getSiteSettings();
  const pricePerPerson = Number(booking.price_per_person || 0);
  const lineItems = buildInvoiceLineItems({
    packageTitle: booking.package_title,
    travelers: booking.travelers,
    pricePerPerson,
    currency: settings.currencyCode || 'SAR'
  });
  const amounts = buildInvoiceAmounts({
    subtotal: booking.total_amount || lineItems.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0),
    taxRate: overrides.taxRate ?? settings.taxRate ?? 15
  });
  const issueDate = overrides.issueDate || new Date().toISOString().split('T')[0];
  const qrPayload = settings.zatcaEnabled && settings.zatcaQrEnabled
    ? buildZatcaQrPayload({
        sellerName: settings.companyNameAr || settings.companyName || settings.siteName,
        vatNumber: settings.vatNumber,
        issuedAt: `${issueDate}T00:00:00.000Z`,
        totalAmount: amounts.totalAmount,
        taxAmount: amounts.taxAmount
      })
    : null;

  const insertResult = await query(
    `
      INSERT INTO invoices (
        invoice_number, booking_id, booking_code, customer_name, customer_email, customer_phone,
        package_title, package_title_ar, currency_code, language_mode, issue_date, due_date,
        status, payment_status, subtotal, tax_rate, tax_amount, total_amount, line_items,
        notes, notes_ar, seller_name, seller_name_ar, seller_address, seller_address_ar,
        vat_number, cr_number, zatca_qr_payload, zatca_qr_enabled
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19::jsonb,
        $20, $21, $22, $23, $24, $25,
        $26, $27, $28, $29
      )
      RETURNING *
    `,
    [
      overrides.invoiceNumber || buildInvoiceNumber(settings.invoicePrefix, booking.booking_code),
      booking.id,
      booking.booking_code,
      booking.customer_name,
      booking.customer_email,
      booking.customer_phone || '',
      booking.package_title || '',
      booking.package_title_ar || '',
      settings.currencyCode || 'SAR',
      overrides.languageMode || 'bilingual',
      issueDate,
      overrides.dueDate || booking.travel_date,
      overrides.status || 'issued',
      overrides.paymentStatus || booking.payment_status || 'unpaid',
      amounts.subtotal,
      amounts.taxRate,
      amounts.taxAmount,
      amounts.totalAmount,
      JSON.stringify(lineItems),
      overrides.notes || settings.invoiceTerms || '',
      overrides.notesAr || settings.invoiceTermsAr || '',
      settings.companyName || settings.siteName || '',
      settings.companyNameAr || settings.siteNameAr || '',
      settings.companyAddress || settings.address || '',
      settings.companyAddressAr || settings.addressAr || '',
      settings.vatNumber || '',
      settings.crNumber || '',
      qrPayload,
      settings.zatcaQrEnabled !== false
    ]
  );

  return mapInvoiceRow(insertResult.rows[0]);
}

async function updateSiteSettings(payload) {
  await query(
    `
      UPDATE site_settings
      SET site_name = $1,
          site_title = $2,
          tagline = $3,
          site_name_ar = $4,
          tagline_ar = $5,
          logo = $6,
          favicon = $7,
          phone = $8,
          email = $9,
          support_email = $10,
          address = $11,
          address_ar = $12,
          facebook = $13,
          twitter = $14,
          instagram = $15,
          youtube = $16,
          footer_text = $17,
          footer_text_ar = $18,
          copyright_text = $19,
          primary_color = $20,
          secondary_color = $21,
          accent_color = $22,
          header_bg = $23,
          footer_bg = $24,
          use_gradients = $25,
          country_code = $26,
          country_name = $27,
          country_name_ar = $28,
          default_language = $29,
          secondary_language = $30,
          currency_code = $31,
          currency_symbol = $32,
          locale = $33,
          company_name = $34,
          company_name_ar = $35,
          company_address = $36,
          company_address_ar = $37,
          vat_number = $38,
          cr_number = $39,
          tax_rate = $40,
          invoice_prefix = $41,
          invoice_terms = $42,
          invoice_terms_ar = $43,
          zatca_enabled = $44,
          zatca_phase = $45,
          zatca_qr_enabled = $46,
          zatca_phase2_enabled = $47,
          zatca_environment = $48,
          zatca_device_id = $49,
          zatca_api_base_url = $50,
          zatca_otp = $51,
          zatca_secret = $52,
          updated_at = NOW()
      WHERE id = 1
    `,
    [
      payload.siteName,
      payload.siteTitle,
      payload.tagline,
      payload.siteNameAr,
      payload.taglineAr,
      payload.logo,
      payload.favicon,
      payload.phone,
      payload.email,
      payload.supportEmail,
      payload.address,
      payload.addressAr,
      payload.facebook,
      payload.twitter,
      payload.instagram,
      payload.youtube,
      payload.footerText,
      payload.footerTextAr,
      payload.copyrightText,
      payload.primaryColor,
      payload.secondaryColor,
      payload.accentColor,
      payload.headerBg,
      payload.footerBg,
      payload.useGradients,
      payload.countryCode,
      payload.countryName,
      payload.countryNameAr,
      payload.defaultLanguage,
      payload.secondaryLanguage,
      payload.currencyCode,
      payload.currencySymbol,
      payload.locale,
      payload.companyName,
      payload.companyNameAr,
      payload.companyAddress,
      payload.companyAddressAr,
      payload.vatNumber,
      payload.crNumber,
      payload.taxRate,
      payload.invoicePrefix,
      payload.invoiceTerms,
      payload.invoiceTermsAr,
      payload.zatcaEnabled,
      payload.zatcaPhase,
      payload.zatcaQrEnabled,
      payload.zatcaPhase2Enabled,
      payload.zatcaEnvironment,
      payload.zatcaDeviceId,
      payload.zatcaApiBaseUrl,
      payload.zatcaOtp,
      payload.zatcaSecret
    ]
  );
}

async function replacePartners(partners) {
  await query('DELETE FROM partners');

  const items = [
    ...(partners.banks || []).map((partner, index) => ({ ...partner, category: 'banks', sortOrder: index + 1 })),
    ...(partners.airlines || []).map((partner, index) => ({ ...partner, category: 'airlines', sortOrder: index + 1 }))
  ];

  for (const partner of items) {
    await query(
      `
        INSERT INTO partners (category, name, logo, active, sort_order)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [partner.category, partner.name, partner.logo || '', partner.active !== false, partner.sortOrder]
    );
  }
}

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await query(
      'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = $1 OR email = $1 LIMIT 1',
      [username]
    );

    const admin = result.rows[0];

    if (!admin || !verifyPassword(password, admin.password_hash)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = await createSession({ sessionType: 'admin', adminUserId: admin.id });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: String(admin.id),
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard', async (req, res, next) => {
  try {
    const [queriesResult, bookingsResult, packageResult, usersResult, revenueResult] = await Promise.all([
      query('SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = \'pending\')::int AS pending FROM contact_inquiries'),
      query('SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = \'confirmed\')::int AS confirmed FROM holiday_bookings'),
      query('SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active FROM packages'),
      query('SELECT COUNT(*)::int AS total FROM users'),
      query("SELECT COALESCE(SUM(total_amount) FILTER (WHERE payment_status = 'paid'), 0)::numeric AS revenue FROM holiday_bookings")
    ]);

    const stats = {
      totalQueries: queriesResult.rows[0].total,
      pendingQueries: queriesResult.rows[0].pending,
      totalBookings: bookingsResult.rows[0].total,
      confirmedBookings: bookingsResult.rows[0].confirmed,
      totalRevenue: Number(revenueResult.rows[0].revenue || 0),
      activePackages: packageResult.rows[0].active,
      totalPackages: packageResult.rows[0].total,
      totalUsers: usersResult.rows[0].total
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

router.get('/queries', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows.map(mapInquiryRow) });
  } catch (error) {
    next(error);
  }
});

router.put('/queries/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await query(
      `
        UPDATE contact_inquiries
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `,
      [status, req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    res.json({ success: true, data: mapInquiryRow(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.delete('/queries/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM contact_inquiries WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Query deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/bookings', async (req, res, next) => {
  try {
    const result = await query(
      `
        SELECT
          hb.*,
          p.title AS package_title
        FROM holiday_bookings hb
        LEFT JOIN packages p ON p.id = hb.package_id
        ORDER BY hb.created_at DESC
      `
    );

    res.json({ success: true, data: result.rows.map(mapAdminBooking) });
  } catch (error) {
    next(error);
  }
});

router.put('/bookings/:id', async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const result = await query(
      `
        UPDATE holiday_bookings
        SET status = COALESCE($1, status),
            payment_status = COALESCE($2, payment_status),
            updated_at = NOW()
        WHERE id = $3
        RETURNING id
      `,
      [status || null, paymentStatus || null, req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = await query(
      `
        SELECT
          hb.*,
          p.title AS package_title
        FROM holiday_bookings hb
        LEFT JOIN packages p ON p.id = hb.package_id
        WHERE hb.id = $1
        LIMIT 1
      `,
      [result.rows[0].id]
    );

    res.json({ success: true, data: mapAdminBooking(booking.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.get('/packages', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM packages ORDER BY updated_at DESC, id DESC');
    res.json({ success: true, data: result.rows.map(mapPackageRow) });
  } catch (error) {
    next(error);
  }
});

router.post('/packages', async (req, res, next) => {
  try {
    const payload = normalizePackagePayload(req.body);
    const result = await query(
      `
        INSERT INTO packages (
          slug, title, title_bn, destination, destination_bn, price, discount_price, currency,
          duration, duration_bn, image_url, category, rating, reviews_count, max_people,
          is_popular, is_featured, is_active, description, description_bn, overview, overview_bn,
          about_destination, about_destination_bn, highlights, included, not_included, itinerary, gallery,
          created_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22,
          $23, $24, $25::jsonb, $26::jsonb, $27::jsonb, $28::jsonb, $29::jsonb,
          NOW(), NOW()
        )
        RETURNING *
      `,
      [
        payload.slug,
        payload.title,
        payload.title_bn,
        payload.destination,
        payload.destination_bn,
        payload.price,
        payload.discount_price,
        payload.currency,
        payload.duration,
        payload.duration_bn,
        payload.image_url,
        payload.category,
        payload.rating,
        payload.reviews_count,
        payload.max_people,
        payload.is_popular,
        payload.is_featured,
        payload.is_active,
        payload.description,
        payload.description_bn,
        payload.overview,
        payload.overview_bn,
        payload.about_destination,
        payload.about_destination_bn,
        JSON.stringify(payload.highlights),
        JSON.stringify(payload.included),
        JSON.stringify(payload.not_included),
        JSON.stringify(payload.itinerary),
        JSON.stringify(payload.gallery)
      ]
    );

    res.status(201).json({ success: true, data: mapPackageRow(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.put('/packages/:id', async (req, res, next) => {
  try {
    const existing = await query('SELECT * FROM packages WHERE id = $1 LIMIT 1', [req.params.id]);

    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const mergedPayload = normalizePackagePayload({
      ...mapPackageRow(existing.rows[0]),
      ...req.body,
      slug: req.body.slug || existing.rows[0].slug
    });

    const result = await query(
      `
        UPDATE packages
        SET slug = $1,
            title = $2,
            title_bn = $3,
            destination = $4,
            destination_bn = $5,
            price = $6,
            discount_price = $7,
            currency = $8,
            duration = $9,
            duration_bn = $10,
            image_url = $11,
            category = $12,
            rating = $13,
            reviews_count = $14,
            max_people = $15,
            is_popular = $16,
            is_featured = $17,
            is_active = $18,
            description = $19,
            description_bn = $20,
            overview = $21,
            overview_bn = $22,
            about_destination = $23,
            about_destination_bn = $24,
            highlights = $25::jsonb,
            included = $26::jsonb,
            not_included = $27::jsonb,
            itinerary = $28::jsonb,
            gallery = $29::jsonb,
            updated_at = NOW()
        WHERE id = $30
        RETURNING *
      `,
      [
        mergedPayload.slug,
        mergedPayload.title,
        mergedPayload.title_bn,
        mergedPayload.destination,
        mergedPayload.destination_bn,
        mergedPayload.price,
        mergedPayload.discount_price,
        mergedPayload.currency,
        mergedPayload.duration,
        mergedPayload.duration_bn,
        mergedPayload.image_url,
        mergedPayload.category,
        mergedPayload.rating,
        mergedPayload.reviews_count,
        mergedPayload.max_people,
        mergedPayload.is_popular,
        mergedPayload.is_featured,
        mergedPayload.is_active,
        mergedPayload.description,
        mergedPayload.description_bn,
        mergedPayload.overview,
        mergedPayload.overview_bn,
        mergedPayload.about_destination,
        mergedPayload.about_destination_bn,
        JSON.stringify(mergedPayload.highlights),
        JSON.stringify(mergedPayload.included),
        JSON.stringify(mergedPayload.not_included),
        JSON.stringify(mergedPayload.itinerary),
        JSON.stringify(mergedPayload.gallery),
        req.params.id
      ]
    );

    res.json({ success: true, data: mapPackageRow(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.delete('/packages/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM packages WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/invoices', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM invoices ORDER BY created_at DESC, id DESC');
    res.json({ success: true, data: result.rows.map(mapInvoiceRow) });
  } catch (error) {
    next(error);
  }
});

router.post('/invoices', async (req, res, next) => {
  try {
    const invoice = await createOrFetchInvoiceFromBooking(req.body.bookingId, req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
});

router.get('/invoices/:id', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM invoices WHERE id = $1 LIMIT 1', [req.params.id]);

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: mapInvoiceRow(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.put('/invoices/:id', async (req, res, next) => {
  try {
    const existingResult = await query('SELECT * FROM invoices WHERE id = $1 LIMIT 1', [req.params.id]);

    if (!existingResult.rows[0]) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const existing = existingResult.rows[0];
    const nextTaxRate = req.body.taxRate ?? existing.tax_rate;
    const nextSubtotal = req.body.subtotal ?? existing.subtotal;
    const amounts = buildInvoiceAmounts({ subtotal: nextSubtotal, taxRate: nextTaxRate });
    const settings = await getSiteSettings();
    const qrPayload = (req.body.zatcaQrEnabled ?? existing.zatca_qr_enabled)
      ? buildZatcaQrPayload({
          sellerName: req.body.sellerNameAr || existing.seller_name_ar || settings.companyNameAr || settings.companyName,
          vatNumber: req.body.vatNumber || existing.vat_number || settings.vatNumber,
          issuedAt: `${req.body.issueDate || existing.issue_date}T00:00:00.000Z`,
          totalAmount: amounts.totalAmount,
          taxAmount: amounts.taxAmount
        })
      : null;

    const result = await query(
      `
        UPDATE invoices
        SET language_mode = $1,
            issue_date = $2,
            due_date = $3,
            status = $4,
            payment_status = $5,
            subtotal = $6,
            tax_rate = $7,
            tax_amount = $8,
            total_amount = $9,
            notes = $10,
            notes_ar = $11,
            seller_name = $12,
            seller_name_ar = $13,
            seller_address = $14,
            seller_address_ar = $15,
            vat_number = $16,
            cr_number = $17,
            zatca_qr_payload = $18,
            zatca_qr_enabled = $19,
            updated_at = NOW()
        WHERE id = $20
        RETURNING *
      `,
      [
        req.body.languageMode || existing.language_mode,
        req.body.issueDate || existing.issue_date,
        req.body.dueDate || existing.due_date,
        req.body.status || existing.status,
        req.body.paymentStatus || existing.payment_status,
        amounts.subtotal,
        amounts.taxRate,
        amounts.taxAmount,
        amounts.totalAmount,
        req.body.notes ?? existing.notes,
        req.body.notesAr ?? existing.notes_ar,
        req.body.sellerName ?? existing.seller_name,
        req.body.sellerNameAr ?? existing.seller_name_ar,
        req.body.sellerAddress ?? existing.seller_address,
        req.body.sellerAddressAr ?? existing.seller_address_ar,
        req.body.vatNumber ?? existing.vat_number,
        req.body.crNumber ?? existing.cr_number,
        qrPayload,
        req.body.zatcaQrEnabled ?? existing.zatca_qr_enabled,
        req.params.id
      ]
    );

    res.json({ success: true, data: mapInvoiceRow(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.get('/settings', async (req, res, next) => {
  try {
    const settings = await getSiteSettings();
    const partners = await getPartners();
    res.json({ success: true, data: { ...settings, partners } });
  } catch (error) {
    next(error);
  }
});

router.put('/settings', async (req, res, next) => {
  try {
    const settingsPayload = req.body.settings || req.body;
    const partnersPayload = req.body.partners || req.body.partners || (req.body.banks || req.body.airlines ? {
      banks: req.body.banks || [],
      airlines: req.body.airlines || []
    } : null);

    await updateSiteSettings(settingsPayload);

    if (partnersPayload) {
      await replacePartners(partnersPayload);
    }

    const settings = await getSiteSettings();
    const partners = await getPartners();

    res.json({
      success: true,
      data: { ...settings, partners },
      message: 'Settings updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
