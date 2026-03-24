export const SAUDI_RIYAL_SYMBOL = '⃁';
export const SAUDI_RIYAL_TEXT_SYMBOL = 'ر.س';
export const SAUDI_RIYAL_CODE = 'SAR';
export const SAUDI_RIYAL_LOCALE = 'en-SA';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getSaudiLocale(language = 'en') {
  return language === 'bn' ? 'ar-SA' : 'en-SA';
}

export function normalizeSaudiCurrencySettings(settings = {}) {
  return {
    ...settings,
    currencyCode: SAUDI_RIYAL_CODE,
    currencySymbol: SAUDI_RIYAL_SYMBOL,
    locale: settings.locale || SAUDI_RIYAL_LOCALE
  };
}

export function formatCurrencyAmount(amount, options = {}) {
  const numericAmount = toNumber(amount);
  const currencyCode = options.currencyCode || SAUDI_RIYAL_CODE;
  const locale = options.locale || getSaudiLocale(options.language);
  const minimumFractionDigits = options.minimumFractionDigits ?? (currencyCode === SAUDI_RIYAL_CODE ? 0 : 2);
  const maximumFractionDigits = options.maximumFractionDigits ?? (currencyCode === SAUDI_RIYAL_CODE ? 0 : 2);

  if (currencyCode === SAUDI_RIYAL_CODE) {
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits
    }).format(numericAmount);

    const currencySymbol = options.currencySymbol || SAUDI_RIYAL_SYMBOL;
    const symbolPosition = options.symbolPosition || 'prefix';

    return symbolPosition === 'suffix'
      ? `${formattedNumber} ${currencySymbol}`
      : `${currencySymbol} ${formattedNumber}`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(numericAmount);
}

export function formatSaudiRiyal(amount, options = {}) {
  return formatCurrencyAmount(amount, {
    ...options,
    currencyCode: SAUDI_RIYAL_CODE,
    currencySymbol: options.currencySymbol || SAUDI_RIYAL_SYMBOL
  });
}
