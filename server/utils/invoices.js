function roundAmount(value) {
  return Number(Number(value || 0).toFixed(2));
}

function buildInvoiceNumber(prefix = 'INV', bookingCode = '') {
  const normalizedPrefix = String(prefix || 'INV').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '') || 'INV';
  const normalizedBookingCode = String(bookingCode || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(-8);

  if (normalizedBookingCode) {
    return `${normalizedPrefix}-${normalizedBookingCode}`;
  }

  const timestampSuffix = String(Date.now()).slice(-8);
  return `${normalizedPrefix}-${timestampSuffix}`;
}

function buildInvoiceLineItems({ packageTitle, travelers, pricePerPerson, currency = 'SAR' }) {
  const quantity = Math.max(parseInt(travelers || 1, 10), 1);
  const unitPrice = roundAmount(pricePerPerson || 0);
  const lineTotal = roundAmount(unitPrice * quantity);

  return [
    {
      id: 'primary-line',
      description: packageTitle || 'Travel package',
      description_ar: packageTitle || 'باقة سفر',
      quantity,
      unitPrice,
      lineTotal,
      currency
    }
  ];
}

function buildInvoiceAmounts({ subtotal, taxRate }) {
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

function encodeTlvTag(tag, value) {
  const content = Buffer.from(String(value ?? ''), 'utf8');
  return Buffer.concat([Buffer.from([tag]), Buffer.from([content.length]), content]);
}

function buildZatcaQrPayload({ sellerName, vatNumber, issuedAt, totalAmount, taxAmount }) {
  const payload = Buffer.concat([
    encodeTlvTag(1, sellerName || ''),
    encodeTlvTag(2, vatNumber || ''),
    encodeTlvTag(3, issuedAt || new Date().toISOString()),
    encodeTlvTag(4, roundAmount(totalAmount).toFixed(2)),
    encodeTlvTag(5, roundAmount(taxAmount).toFixed(2))
  ]);

  return payload.toString('base64');
}

module.exports = {
  roundAmount,
  buildInvoiceNumber,
  buildInvoiceLineItems,
  buildInvoiceAmounts,
  buildZatcaQrPayload
};
