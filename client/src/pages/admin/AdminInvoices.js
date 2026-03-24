import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { FileText, Plus, Printer, RefreshCw, Save, Receipt, QrCode, CalendarDays } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrencyAmount, normalizeSaudiCurrencySettings } from '../../utils/currency';
import {
  buildEmptyInvoice,
  buildInvoiceFromBooking,
  getLocalAdminBookings,
  getLocalAdminInvoices,
  normalizeAdminBooking,
  recalculateInvoice,
  saveLocalAdminInvoices
} from '../../utils/invoices';

const defaultInvoiceSettings = normalizeSaudiCurrencySettings({
  companyName: 'Sabir Travels',
  companyNameAr: 'صبير ترافلز',
  companyAddress: 'Olaya Street, Riyadh 12214, Saudi Arabia',
  companyAddressAr: 'شارع العليا، الرياض 12214، المملكة العربية السعودية',
  vatNumber: '300000000000003',
  crNumber: '1010000000',
  currencyCode: 'SAR',
  invoicePrefix: 'INV',
  invoiceTerms: 'Thank you for choosing Sabir Travels.',
  invoiceTermsAr: 'شكراً لاختياركم صبير ترافلز.',
  taxRate: 15,
  zatcaQrEnabled: true,
  zatcaEnabled: true
});

const readLocalInvoiceSettings = () => {
  try {
    return normalizeSaudiCurrencySettings({
      ...defaultInvoiceSettings,
      ...JSON.parse(localStorage.getItem('siteSettings') || '{}')
    });
  } catch (error) {
    return defaultInvoiceSettings;
  }
};

const mergeInvoices = (...collections) => {
  const invoiceMap = new Map();

  collections.flat().filter(Boolean).forEach((invoice) => {
    const key = String(invoice.id || `${invoice.invoiceNumber || 'invoice'}-${invoice.bookingId || 'standalone'}`);
    invoiceMap.set(key, invoice);
  });

  return Array.from(invoiceMap.values()).sort((a, b) => {
    const dateA = new Date(b.updatedAt || b.createdAt || b.issueDate || 0);
    const dateB = new Date(a.updatedAt || a.createdAt || a.issueDate || 0);
    return dateA - dateB;
  });
};

const mergeBookings = (...collections) => {
  const bookingMap = new Map();

  collections.flat().filter(Boolean).forEach((booking) => {
    const normalizedBooking = normalizeAdminBooking(booking);
    bookingMap.set(String(normalizedBooking.id), normalizedBooking);
  });

  return Array.from(bookingMap.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

const AdminInvoices = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('adminTheme');
    return saved ? saved === 'dark' : false;
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState(null);
  const [settings, setSettings] = useState(() => readLocalInvoiceSettings());
  const [qrImage, setQrImage] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    const checkTheme = () => {
      const saved = localStorage.getItem('adminTheme');
      setIsDark(saved === 'dark');
    };
    const interval = setInterval(checkTheme, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const localBookings = getLocalAdminBookings();
      const localInvoices = getLocalAdminInvoices();
      const localSettings = readLocalInvoiceSettings();

      try {
        const [bookingsResponse, invoicesResponse, settingsResponse] = await Promise.all([
          axios.get('/api/admin/bookings').catch(() => null),
          axios.get('/api/admin/invoices').catch(() => null),
          axios.get('/api/admin/settings').catch(() => null)
        ]);

        const apiBookings = bookingsResponse?.data?.data || [];
        const apiInvoices = invoicesResponse?.data?.data || [];
        const siteSettings = settingsResponse?.data?.data?.data || settingsResponse?.data?.data;
        const { partners, ...settingsPayload } = siteSettings || {};
        const nextBookings = mergeBookings(apiBookings, localBookings);
        const nextInvoices = mergeInvoices(apiInvoices, localInvoices);
        const nextSettings = normalizeSaudiCurrencySettings({
          ...localSettings,
          ...settingsPayload
        });

        setBookings(nextBookings);
        setInvoices(nextInvoices);
        setSettings(nextSettings);
        saveLocalAdminInvoices(nextInvoices);
        localStorage.setItem('siteSettings', JSON.stringify(nextSettings));

        if (nextInvoices.length > 0) {
          const firstInvoice = nextInvoices[0];
          setSelectedInvoiceId(firstInvoice.id);
          setInvoiceForm(firstInvoice);
        } else {
          setSelectedInvoiceId(null);
          setInvoiceForm(buildEmptyInvoice(nextSettings, nextInvoices));
        }
      } catch (error) {
        setBookings(localBookings);
        setInvoices(localInvoices);
        setSettings(localSettings);

        if (localInvoices.length > 0) {
          setSelectedInvoiceId(localInvoices[0].id);
          setInvoiceForm(localInvoices[0]);
        } else {
          setSelectedInvoiceId(null);
          setInvoiceForm(buildEmptyInvoice(localSettings, localInvoices));
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const previewInvoice = useMemo(() => {
    if (!invoiceForm) {
      return null;
    }

    return recalculateInvoice(invoiceForm, settings);
  }, [invoiceForm, settings]);

  useEffect(() => {
    if (!previewInvoice?.zatcaQrPayload || previewInvoice?.zatcaQrEnabled === false) {
      setQrImage('');
      return;
    }

    let active = true;

    QRCode.toDataURL(previewInvoice.zatcaQrPayload, { margin: 1, width: 180 })
      .then((dataUrl) => {
        if (active) {
          setQrImage(dataUrl);
        }
      })
      .catch(() => {
        if (active) {
          setQrImage('');
        }
      });

    return () => {
      active = false;
    };
  }, [previewInvoice]);

  const openInvoice = async (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    const localInvoice = invoices.find((invoice) => String(invoice.id) === String(invoiceId));

    if (localInvoice) {
      setInvoiceForm(localInvoice);
    }

    try {
      const response = await axios.get(`/api/admin/invoices/${invoiceId}`);
      const fetchedInvoice = response.data.data;
      const nextInvoices = mergeInvoices([fetchedInvoice], invoices);
      setInvoices(nextInvoices);
      saveLocalAdminInvoices(nextInvoices);
      setInvoiceForm(fetchedInvoice);
    } catch (error) {
    }
  };

  const handleCreateBlankInvoice = () => {
    const draftInvoice = buildEmptyInvoice(settings, invoices);
    setSelectedInvoiceId(null);
    setInvoiceForm(draftInvoice);
  };

  const handleCreateInvoice = async (bookingId) => {
    const existingInvoice = bookingInvoiceMap[bookingId];
    if (existingInvoice) {
      openInvoice(existingInvoice.id);
      return;
    }

    const sourceBooking = bookings.find((booking) => String(booking.id) === String(bookingId));
    if (!sourceBooking) {
      alert('Booking not found');
      return;
    }

    setCreating(true);
    try {
      const response = await axios.post('/api/admin/invoices', { bookingId });
      const createdInvoice = response.data.data;
      const nextInvoices = mergeInvoices([createdInvoice], invoices);
      setInvoices(nextInvoices);
      saveLocalAdminInvoices(nextInvoices);
      setSelectedInvoiceId(createdInvoice.id);
      setInvoiceForm(createdInvoice);
    } catch (error) {
      const createdInvoice = buildInvoiceFromBooking(sourceBooking, settings, invoices);
      const nextInvoices = mergeInvoices([createdInvoice], invoices);
      setInvoices(nextInvoices);
      saveLocalAdminInvoices(nextInvoices);
      setSelectedInvoiceId(createdInvoice.id);
      setInvoiceForm(createdInvoice);
    } finally {
      setCreating(false);
    }
  };

  const handleSaveInvoice = async () => {
    if (!invoiceForm?.id) {
      return;
    }

    setSaving(true);
    try {
      const nextInvoice = {
        ...previewInvoice,
        updatedAt: new Date().toISOString()
      };
      const response = await axios.put(`/api/admin/invoices/${invoiceForm.id}`, nextInvoice);
      const updatedInvoice = response.data.data;
      const nextInvoices = mergeInvoices([updatedInvoice], invoices);
      setInvoiceForm(updatedInvoice);
      setInvoices(nextInvoices);
      saveLocalAdminInvoices(nextInvoices);
    } catch (error) {
      const updatedInvoice = {
        ...previewInvoice,
        updatedAt: new Date().toISOString()
      };
      const nextInvoices = mergeInvoices([updatedInvoice], invoices.filter((invoice) => invoice.id !== updatedInvoice.id));
      setInvoiceForm(updatedInvoice);
      setInvoices(nextInvoices);
      saveLocalAdminInvoices(nextInvoices);
    } finally {
      setSaving(false);
    }
  };

  const bookingInvoiceMap = useMemo(() => {
    return invoices.reduce((acc, invoice) => {
      if (invoice.bookingId) {
        acc[invoice.bookingId] = invoice;
      }
      return acc;
    }, {});
  }, [invoices]);

  const bookingsWithoutInvoice = useMemo(() => {
    return bookings.filter((booking) => !bookingInvoiceMap[booking.id]);
  }, [bookingInvoiceMap, bookings]);

  const invoiceSummary = useMemo(() => {
    if (!previewInvoice) {
      return null;
    }

    return {
      subtotal: Number(previewInvoice.subtotal || 0),
      taxAmount: Number(previewInvoice.taxAmount || 0),
      totalAmount: Number(previewInvoice.totalAmount || 0)
    };
  }, [previewInvoice]);

  const renderedInvoice = previewInvoice || invoiceForm;

  const formatAmount = (amount) => {
    return formatCurrencyAmount(amount, {
      language,
      currencyCode: settings.currencyCode || 'SAR',
      currencySymbol: settings.currencySymbol,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 print:space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Invoices</h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create bilingual Arabic/English invoices with Saudi VAT and optional ZATCA QR.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateBlankInvoice}
              className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 font-semibold flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
            <button
              onClick={handleSaveInvoice}
              disabled={!invoiceForm || saving}
              className="px-5 py-3 rounded-xl bg-primary-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Invoice'}
            </button>
            <button
              onClick={() => window.print()}
              disabled={!invoiceForm}
              className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[380px,1fr] gap-6">
            <div className="space-y-6 print:hidden">
              <div className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="w-5 h-5 text-primary-500" />
                  <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create from Booking</h2>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {bookings.length === 0 && (
                    <div className={`rounded-xl border border-dashed p-4 text-sm ${isDark ? 'border-slate-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                      No bookings found yet. You can still create a manual invoice from this page.
                    </div>
                  )}
                  {bookings.map((booking) => {
                    const existingInvoice = bookingInvoiceMap[booking.id];
                    return (
                      <div key={booking.id} className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900/60' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{booking.bookingCode}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{booking.customerName}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{booking.package}</p>
                            <div className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              <span>{booking.travelDate}</span>
                              <span>{booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}</span>
                              <span>{formatAmount(booking.totalAmount)}</span>
                            </div>
                          </div>
                          {existingInvoice ? (
                            <button
                              onClick={() => openInvoice(existingInvoice.id)}
                              className="px-3 py-2 rounded-lg bg-primary-500/10 text-primary-500 text-sm font-medium"
                            >
                              Open
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCreateInvoice(booking.id)}
                              disabled={creating}
                              className="px-3 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                              Create
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handleCreateBlankInvoice}
                  className={`mt-4 w-full px-4 py-3 rounded-xl border border-dashed font-medium ${isDark ? 'border-slate-600 text-gray-300 hover:bg-slate-700/40' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Create Manual Invoice
                </button>
              </div>

              <div className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary-500" />
                  <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Invoice List</h2>
                </div>
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {invoices.length === 0 && (
                    <div className={`rounded-xl border border-dashed p-4 text-sm ${isDark ? 'border-slate-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                      No invoices created yet.
                    </div>
                  )}
                  {invoices.map((invoice) => (
                    <motion.button
                      key={invoice.id}
                      onClick={() => openInvoice(invoice.id)}
                      whileHover={{ y: -1 }}
                      className={`w-full text-left rounded-xl border p-4 transition-all ${selectedInvoiceId === invoice.id ? 'border-primary-500 bg-primary-500/10' : isDark ? 'border-slate-700 bg-slate-900/60' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{invoice.invoiceNumber}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{invoice.customerName || 'Draft customer'}</p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{formatAmount(invoice.totalAmount || invoice.subtotal || 0)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {invoice.paymentStatus}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {!invoiceForm ? (
                <div className={`rounded-2xl border p-10 ${isDark ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}>
                  <div className="max-w-xl mx-auto text-center">
                    <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Create invoice here</h2>
                    <p>Select an existing booking from the left, or start a direct invoice with automatic numbering, Saudi VAT, and SAR totals.</p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={handleCreateBlankInvoice}
                        className="px-5 py-3 rounded-xl bg-primary-500 text-white font-semibold flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Blank Invoice
                      </button>
                      {bookingsWithoutInvoice[0] && (
                        <button
                          onClick={() => handleCreateInvoice(bookingsWithoutInvoice[0].id)}
                          className={`px-5 py-3 rounded-xl border font-semibold ${isDark ? 'border-slate-600 text-gray-200' : 'border-gray-300 text-gray-700'}`}
                        >
                          Create from {bookingsWithoutInvoice[0].bookingCode}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 print:hidden`}>
                    <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Invoice Number</p>
                      <p className={`mt-2 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{invoiceForm.invoiceNumber}</p>
                    </div>
                    <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Issue Date</p>
                      <div className="mt-2 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary-500" />
                        <input
                          type="date"
                          value={invoiceForm.issueDate || ''}
                          onChange={(e) => setInvoiceForm((prev) => ({ ...prev, issueDate: e.target.value }))}
                          className={`w-full bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`}
                        />
                      </div>
                    </div>
                    <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Due Date</p>
                      <div className="mt-2 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary-500" />
                        <input
                          type="date"
                          value={invoiceForm.dueDate || ''}
                          onChange={(e) => setInvoiceForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                          className={`w-full bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`}
                        />
                      </div>
                    </div>
                    <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Language Mode</p>
                      <select
                        value={invoiceForm.languageMode || 'bilingual'}
                        onChange={(e) => setInvoiceForm((prev) => ({ ...prev, languageMode: e.target.value }))}
                        className={`mt-2 w-full bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`}
                      >
                        <option value="bilingual">Bilingual</option>
                        <option value="english">English</option>
                        <option value="arabic">Arabic</option>
                      </select>
                    </div>
                    <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Payment Status</p>
                      <select
                        value={invoiceForm.paymentStatus || 'unpaid'}
                        onChange={(e) => setInvoiceForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                        className={`mt-2 w-full bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden`}>
                    <div className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer Details</h3>
                      <div className="space-y-4">
                        <input value={invoiceForm.customerName || ''} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, customerName: e.target.value }))} placeholder="Customer name" className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                        <input value={invoiceForm.customerEmail || ''} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, customerEmail: e.target.value }))} placeholder="Customer email" className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                        <input value={invoiceForm.customerPhone || ''} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, customerPhone: e.target.value }))} placeholder="Customer phone" className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Service Details</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input value={invoiceForm.bookingCode || ''} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, bookingCode: e.target.value }))} placeholder="Booking reference" className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                          <input type="date" value={invoiceForm.travelDate || ''} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, travelDate: e.target.value }))} className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                        </div>
                        <input value={invoiceForm.packageTitle || ''} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, packageTitle: e.target.value }))} placeholder="Service / package title" className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                        <input value={invoiceForm.packageTitleAr || ''} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, packageTitleAr: e.target.value }))} placeholder="اسم الخدمة بالعربية" className={`w-full px-4 py-3 rounded-xl border text-right ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="number" min="1" value={invoiceForm.travelerCount || invoiceForm.travelers || 1} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, travelerCount: Number(e.target.value || 1), travelers: Number(e.target.value || 1) }))} placeholder="Travelers" className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                          <input type="number" min="0" step="0.01" value={invoiceForm.subtotal || 0} onChange={(e) => setInvoiceForm((prev) => ({ ...prev, subtotal: Number(e.target.value || 0) }))} placeholder="Subtotal" className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-5 print:hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Invoice settings</p>
                    <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Company details, VAT number, CR number, tax rate, invoice footer, and ZATCA QR are managed from Admin Settings and applied automatically to this print preview.
                    </p>
                  </div>

                  <div className={`rounded-3xl border p-8 print:p-6 ${isDark ? 'bg-white border-gray-200 shadow-xl' : 'bg-white border-gray-200 shadow-xl'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-primary-500 font-semibold">Tax Invoice</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">{invoiceForm.invoiceNumber}</h2>
                        <p className="text-gray-500 mt-2">Booking Ref: {invoiceForm.bookingCode}</p>
                      </div>
                      <div className="md:text-right" dir="rtl">
                        <p className="text-sm uppercase tracking-[0.2em] text-primary-500 font-semibold">فاتورة ضريبية</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">{invoiceForm.invoiceNumber}</h2>
                        <p className="text-gray-500 mt-2">مرجع الحجز: {invoiceForm.bookingCode}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      <div className="rounded-2xl bg-gray-50 p-5">
                        <p className="text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase">Seller</p>
                        <p className="mt-3 font-bold text-gray-900">{renderedInvoice?.sellerName}</p>
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{renderedInvoice?.sellerAddress}</p>
                        <p className="text-sm text-gray-600 mt-2">VAT: {renderedInvoice?.vatNumber}</p>
                        <p className="text-sm text-gray-600">CR: {renderedInvoice?.crNumber}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-5" dir="rtl">
                        <p className="text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase">البائع</p>
                        <p className="mt-3 font-bold text-gray-900">{renderedInvoice?.sellerNameAr}</p>
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{renderedInvoice?.sellerAddressAr}</p>
                        <p className="text-sm text-gray-600 mt-2">الرقم الضريبي: {renderedInvoice?.vatNumber}</p>
                        <p className="text-sm text-gray-600">رقم السجل التجاري: {renderedInvoice?.crNumber}</p>
                      </div>
                      <div className="rounded-2xl bg-primary-50 p-5">
                        <p className="text-xs font-semibold tracking-[0.15em] text-primary-600 uppercase">Bill To / العميل</p>
                        <p className="mt-3 font-bold text-gray-900">{invoiceForm.customerName}</p>
                        <p className="text-sm text-gray-600 mt-2">{invoiceForm.customerEmail}</p>
                        <p className="text-sm text-gray-600">{invoiceForm.customerPhone}</p>
                        <p className="text-sm text-gray-600 mt-2">Issue Date: {invoiceForm.issueDate}</p>
                        <p className="text-sm text-gray-600">Due Date: {invoiceForm.dueDate}</p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-200 mb-8">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-left font-semibold text-gray-700">Description</th>
                            <th className="p-4 text-right font-semibold text-gray-700">Qty</th>
                            <th className="p-4 text-right font-semibold text-gray-700">Unit Price</th>
                            <th className="p-4 text-right font-semibold text-gray-700">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {((previewInvoice?.lineItems || invoiceForm.lineItems) || []).map((item) => (
                            <tr key={item.id || item.description} className="border-t border-gray-200">
                              <td className="p-4">
                                <p className="font-medium text-gray-900">{item.description}</p>
                                <p className="text-gray-500 mt-1" dir="rtl">{item.description_ar}</p>
                              </td>
                              <td className="p-4 text-right text-gray-700">{item.quantity}</td>
                              <td className="p-4 text-right text-gray-700">{formatAmount(item.unitPrice)}</td>
                              <td className="p-4 text-right text-gray-900 font-semibold">{formatAmount(item.lineTotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-gray-50 p-5">
                          <p className="text-sm font-semibold text-gray-900">Notes</p>
                          <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{renderedInvoice?.notes}</p>
                          <div className="mt-4 border-t border-gray-200 pt-4" dir="rtl">
                            <p className="text-sm font-semibold text-gray-900">ملاحظات</p>
                            <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{renderedInvoice?.notesAr}</p>
                          </div>
                        </div>
                        {renderedInvoice?.zatcaQrEnabled !== false && qrImage && (
                          <div className="rounded-2xl bg-gray-50 p-5 inline-flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2 text-primary-600 font-semibold">
                              <QrCode className="w-4 h-4" />
                              ZATCA QR
                            </div>
                            <img src={qrImage} alt="ZATCA QR" className="w-40 h-40" />
                          </div>
                        )}
                      </div>
                      <div className="rounded-2xl bg-slate-900 text-white p-6">
                        <div className="flex items-center justify-between py-2 border-b border-white/10">
                          <span className="text-white/70">Subtotal</span>
                          <span>{formatAmount(invoiceSummary?.subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/10">
                          <span className="text-white/70">VAT ({previewInvoice?.taxRate || invoiceForm.taxRate || 0}%)</span>
                          <span>{formatAmount(invoiceSummary?.taxAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 text-lg font-bold">
                          <span>Total</span>
                          <span>{formatAmount(invoiceSummary?.totalAmount)}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 text-right" dir="rtl">
                          <p className="text-white/70">الإجمالي شامل الضريبة</p>
                          <p className="text-2xl font-bold mt-2">{formatAmount(invoiceSummary?.totalAmount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
