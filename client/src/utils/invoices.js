import { SAUDI_RIYAL_CODE, normalizeSaudiCurrencySettings } from './currency';

export const LOCAL_ADMIN_INVOICES_KEY = 'adminInvoices';

function roundAmount(value) {
  return Number(Number(value || 0).toFixed(2));
}

function toSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeText(value, fallback = '') {
  return String(value || fallback || '').trim();
}

function toNumber(...values) {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function generateLocalId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function encodeTlvTag(tag, value) {
  const content = new TextEncoder().encode(String(value ?? ''));
  return Uint8Array.from([tag, content.length, ...content]);
}

export function buildInvoiceNumber(prefix = 'INV', bookingCode = '', existingInvoices = []) {
  const normalizedPrefix = normalizeText(prefix, 'INV').toUpperCase().replace(/[^A-Z0-9-]/g, '') || 'INV';
  const normalizedBookingCode = normalizeText(bookingCode)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(-8);
  const dateSegment = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const base = normalizedBookingCode
    ? `${normalizedPrefix}-${dateSegment}-${normalizedBookingCode}`
    : `${normalizedPrefix}-${dateSegment}`;
  const existingNumbers = new Set(existingInvoices.map((invoice) => invoice.invoiceNumber));

  if (!existingNumbers.has(base)) {
    return base;
  }

  let suffix = 2;
  let candidate = `${base}-${String(suffix).padStart(2, '0')}`;
  while (existingNumbers.has(candidate)) {
    suffix += 1;
    candidate = `${base}-${String(suffix).padStart(2, '0')}`;
  }

  return candidate;
}

export function buildInvoiceAmounts({ subtotal, taxRate }) {
  const normalizedSubtotal = roundAmount(subtotal || 0);
  const normalizedTaxRate = roundAmount(taxRate || 0);
  const taxAmount = roundAmount((normalizedSubtotal * normalizedTaxRate) / 100);
  const totalAmount = roundAmount(normalizedSubtotal + taxAmount);

  return {
    subtotal: normalizedSubtotal,
    taxRate: normalizedTaxRate,
    taxAmount,
    totalAmount
  };
}

export function buildInvoiceLineItems({
  packageTitle,
  packageTitleAr,
  travelers,
  subtotal,
  pricePerPerson,
  currencyCode = SAUDI_RIYAL_CODE
}) {
  const quantity = Math.max(parseInt(travelers || 1, 10), 1);
  const unitPrice = subtotal != null
    ? roundAmount((subtotal || 0) / quantity)
    : roundAmount(pricePerPerson || 0);
  const lineTotal = roundAmount(subtotal ?? unitPrice * quantity);

  return [
    {
      id: 'primary-line',
      description: normalizeText(packageTitle, 'Travel package'),
      description_ar: normalizeText(packageTitleAr, 'باقة سفر'),
      quantity,
      unitPrice,
      lineTotal,
      currency: currencyCode
    }
  ];
}

export function buildZatcaQrPayload({ sellerName, vatNumber, issuedAt, totalAmount, taxAmount }) {
  const chunks = [
    encodeTlvTag(1, sellerName || ''),
    encodeTlvTag(2, vatNumber || ''),
    encodeTlvTag(3, issuedAt || new Date().toISOString()),
    encodeTlvTag(4, roundAmount(totalAmount).toFixed(2)),
    encodeTlvTag(5, roundAmount(taxAmount).toFixed(2))
  ];

  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;

  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });

  return bytesToBase64(merged);
}

export function normalizeAdminBooking(rawBooking = {}) {
  const details = rawBooking.details || {};
  const contactDetails = rawBooking.contactDetails || details.contactDetails || {};
  const travelers = Math.max(parseInt(rawBooking.travelers || details.travelers || rawBooking.persons || rawBooking.totalPassengers || 1, 10), 1);
  const totalAmount = roundAmount(
    toNumber(
      rawBooking.totalAmount,
      rawBooking.amount,
      rawBooking.totalPrice,
      details.totalAmount,
      details.amount,
      details.totalPrice,
      (details.pricePerPerson || rawBooking.pricePerPerson || rawBooking.unitPrice || 0) * travelers
    )
  );
  const pricePerPerson = travelers > 0
    ? roundAmount(toNumber(rawBooking.pricePerPerson, rawBooking.unitPrice, details.pricePerPerson, totalAmount / travelers))
    : roundAmount(toNumber(rawBooking.pricePerPerson, rawBooking.unitPrice, details.pricePerPerson, totalAmount));
  const bookingCode = normalizeText(rawBooking.bookingId || rawBooking.bookingCode || rawBooking.id, generateLocalId('BK').toUpperCase());
  const packageTitle = normalizeText(
    rawBooking.package
    || rawBooking.packageTitle
    || rawBooking.title
    || rawBooking.destination
    || details.packageTitle
    || details.title,
    'Travel service'
  );

  return {
    id: String(rawBooking.id || bookingCode),
    bookingId: String(rawBooking.id || bookingCode),
    bookingCode,
    customerName: normalizeText(
      rawBooking.customerName
      || rawBooking.name
      || rawBooking.fullName
      || details.customerName
      || details.name
      || contactDetails.name,
      'Guest'
    ),
    customerEmail: normalizeText(rawBooking.customerEmail || rawBooking.email || details.customerEmail || contactDetails.email),
    customerPhone: normalizeText(rawBooking.customerPhone || rawBooking.phone || details.customerPhone || contactDetails.phone),
    package: packageTitle,
    packageAr: normalizeText(rawBooking.packageAr || rawBooking.packageTitleAr || details.packageTitleAr || packageTitle, 'باقة سفر'),
    travelDate: normalizeText(rawBooking.travelDate || rawBooking.date || details.travelDate || rawBooking.searchParams?.departDate, getTodayDate()),
    travelers,
    persons: travelers,
    pricePerPerson,
    totalAmount,
    type: normalizeText(rawBooking.type || details.type, 'package').toLowerCase(),
    status: normalizeText(rawBooking.status || details.status, 'confirmed').toLowerCase(),
    paymentStatus: normalizeText(rawBooking.paymentStatus || details.paymentStatus, 'unpaid').toLowerCase(),
    createdAt: rawBooking.createdAt || new Date().toISOString()
  };
}

export function getLocalAdminBookings() {
  const bookings = [];

  try {
    const holidayBookings = JSON.parse(localStorage.getItem('holidayBookings') || '[]');
    bookings.push(...holidayBookings);
  } catch (error) {
  }

  try {
    const flightBookings = JSON.parse(localStorage.getItem('flightBookings') || '[]');
    bookings.push(...flightBookings);
  } catch (error) {
  }

  Object.keys(localStorage)
    .filter((key) => key.startsWith('bookings_'))
    .forEach((key) => {
      try {
        const storedBookings = JSON.parse(localStorage.getItem(key) || '[]');
        bookings.push(...storedBookings.filter((booking) => ['package', 'flight', 'visa'].includes(booking.type)));
      } catch (error) {
      }
    });

  const deduped = new Map();
  bookings.forEach((booking) => {
    const normalized = normalizeAdminBooking(booking);
    deduped.set(normalized.id, normalized);
  });

  return Array.from(deduped.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getLocalAdminInvoices() {
  try {
    const stored = JSON.parse(localStorage.getItem(LOCAL_ADMIN_INVOICES_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

export function saveLocalAdminInvoices(invoices = []) {
  localStorage.setItem(LOCAL_ADMIN_INVOICES_KEY, JSON.stringify(invoices));
}

export function recalculateInvoice(invoice = {}, siteSettings = {}) {
  const settings = normalizeSaudiCurrencySettings(siteSettings);
  const travelerCount = Math.max(parseInt(invoice.travelerCount || invoice.travelers || 1, 10), 1);
  const subtotalFromLines = toSafeArray(invoice.lineItems).reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
  const nextSubtotal = invoice.subtotal ?? subtotalFromLines;
  const taxRate = settings.taxRate ?? invoice.taxRate ?? 15;
  const amounts = buildInvoiceAmounts({ subtotal: nextSubtotal, taxRate });
  const nextLineItems = buildInvoiceLineItems({
    packageTitle: invoice.packageTitle,
    packageTitleAr: invoice.packageTitleAr,
    travelers: travelerCount,
    subtotal: amounts.subtotal,
    pricePerPerson: invoice.pricePerPerson,
    currencyCode: settings.currencyCode || invoice.currencyCode || SAUDI_RIYAL_CODE
  });
  const zatcaQrEnabled = settings.zatcaQrEnabled ?? invoice.zatcaQrEnabled ?? true;
  const sellerName = settings.companyName || settings.siteName || invoice.sellerName || 'Sabir Travels';
  const sellerNameAr = settings.companyNameAr || settings.siteNameAr || invoice.sellerNameAr || 'صبير ترافلز';
  const sellerAddress = settings.companyAddress || settings.address || invoice.sellerAddress || '';
  const sellerAddressAr = settings.companyAddressAr || settings.addressAr || invoice.sellerAddressAr || '';
  const vatNumber = settings.vatNumber || invoice.vatNumber || '';
  const crNumber = settings.crNumber || invoice.crNumber || '';
  const notes = settings.invoiceTerms ?? invoice.notes ?? '';
  const notesAr = settings.invoiceTermsAr ?? invoice.notesAr ?? '';
  const issuedAt = `${invoice.issueDate || getTodayDate()}T00:00:00.000Z`;

  return {
    ...invoice,
    currencyCode: settings.currencyCode || invoice.currencyCode || SAUDI_RIYAL_CODE,
    travelerCount,
    lineItems: nextLineItems,
    subtotal: amounts.subtotal,
    taxRate: amounts.taxRate,
    taxAmount: amounts.taxAmount,
    totalAmount: amounts.totalAmount,
    sellerName,
    sellerNameAr,
    sellerAddress,
    sellerAddressAr,
    vatNumber,
    crNumber,
    notes,
    notesAr,
    issueDate: invoice.issueDate || getTodayDate(),
    dueDate: invoice.dueDate || invoice.travelDate || getTodayDate(),
    languageMode: invoice.languageMode || 'bilingual',
    status: invoice.status || 'issued',
    paymentStatus: invoice.paymentStatus || 'unpaid',
    zatcaQrEnabled,
    zatcaQrPayload: zatcaQrEnabled
      ? buildZatcaQrPayload({
          sellerName: sellerNameAr || sellerName,
          vatNumber,
          issuedAt,
          totalAmount: amounts.totalAmount,
          taxAmount: amounts.taxAmount
        })
      : ''
  };
}

export function buildInvoiceFromBooking(booking, siteSettings = {}, existingInvoices = []) {
  const settings = normalizeSaudiCurrencySettings(siteSettings);
  const normalizedBooking = normalizeAdminBooking(booking);
  const baseInvoice = {
    id: generateLocalId('invoice'),
    bookingId: normalizedBooking.id,
    bookingCode: normalizedBooking.bookingCode,
    invoiceNumber: buildInvoiceNumber(settings.invoicePrefix || 'INV', normalizedBooking.bookingCode, existingInvoices),
    customerName: normalizedBooking.customerName,
    customerEmail: normalizedBooking.customerEmail,
    customerPhone: normalizedBooking.customerPhone,
    packageTitle: normalizedBooking.package,
    packageTitleAr: normalizedBooking.packageAr,
    currencyCode: settings.currencyCode || SAUDI_RIYAL_CODE,
    travelerCount: normalizedBooking.travelers,
    travelers: normalizedBooking.travelers,
    travelDate: normalizedBooking.travelDate,
    pricePerPerson: normalizedBooking.pricePerPerson,
    subtotal: normalizedBooking.totalAmount,
    taxRate: settings.taxRate ?? 15,
    paymentStatus: normalizedBooking.paymentStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'local'
  };

  return recalculateInvoice(baseInvoice, settings);
}

export function buildEmptyInvoice(siteSettings = {}, existingInvoices = []) {
  const settings = normalizeSaudiCurrencySettings(siteSettings);
  const issueDate = getTodayDate();

  return recalculateInvoice({
    id: generateLocalId('invoice'),
    bookingId: '',
    bookingCode: generateLocalId('DIR').toUpperCase().slice(0, 18),
    invoiceNumber: buildInvoiceNumber(settings.invoicePrefix || 'INV', '', existingInvoices),
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    packageTitle: 'Travel service',
    packageTitleAr: 'خدمة سفر',
    currencyCode: settings.currencyCode || SAUDI_RIYAL_CODE,
    travelerCount: 1,
    travelers: 1,
    travelDate: issueDate,
    issueDate,
    dueDate: issueDate,
    pricePerPerson: 0,
    subtotal: 0,
    taxRate: settings.taxRate ?? 15,
    paymentStatus: 'unpaid',
    status: 'draft',
    source: 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, settings);
}
