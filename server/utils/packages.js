function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `package-${Date.now()}`;
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
}

function normalizeTextList(items) {
  return normalizeArray(items)
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }

      if (item && typeof item.text === 'string') {
        return item.text.trim();
      }

      return '';
    })
    .filter(Boolean);
}

function normalizeItinerary(items) {
  return normalizeArray(items).map((item, index) => {
    if (!item || typeof item !== 'object') {
      return {
        day: index + 1,
        title: `Day ${index + 1}`,
        title_bn: `Day ${index + 1}`,
        activities: [],
        activities_bn: []
      };
    }

    const activities = Array.isArray(item.activities)
      ? item.activities
      : normalizeTextList(String(item.description || '').split(','));

    const activitiesBn = Array.isArray(item.activities_bn)
      ? item.activities_bn
      : activities;

    return {
      day: parseInt(item.day || index + 1, 10),
      title: item.title || `Day ${index + 1}`,
      title_bn: item.title_bn || item.title || `Day ${index + 1}`,
      activities,
      activities_bn: activitiesBn
    };
  });
}

function mapPackageRow(row) {
  const regularPrice = Number(row.price || 0);
  const salePrice = Number(row.discount_price || row.price || 0);
  const gallery = normalizeArray(row.gallery);
  const images = gallery.length > 0
    ? gallery
    : (row.image_url ? [row.image_url] : []);
  const includedItems = normalizeArray(row.included);
  const notIncludedItems = normalizeArray(row.not_included);

  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    title_bn: row.title_bn,
    destination: row.destination,
    destination_bn: row.destination_bn,
    price: salePrice,
    regularPrice,
    discountPrice: salePrice,
    originalPrice: regularPrice,
    currency: row.currency,
    duration: row.duration,
    duration_bn: row.duration_bn,
    image_url: row.image_url || images[0] || '',
    image: row.image_url || images[0] || '',
    category: row.category,
    rating: Number(row.rating || 0),
    reviews: row.reviews_count || 0,
    reviews_count: row.reviews_count || 0,
    maxPeople: row.max_people || 0,
    max_people: row.max_people || 0,
    is_popular: !!row.is_popular,
    is_featured: !!row.is_featured,
    isActive: !!row.is_active,
    active: !!row.is_active,
    featured: !!row.is_featured,
    popular: !!row.is_popular,
    description: row.description || '',
    description_bn: row.description_bn || '',
    overview: row.overview || '',
    overview_bn: row.overview_bn || '',
    aboutDestination: row.about_destination || '',
    aboutDestination_bn: row.about_destination_bn || '',
    cityHistory: row.about_destination || '',
    cityHistory_bn: row.about_destination_bn || '',
    highlights: normalizeArray(row.highlights),
    includes: includedItems,
    included: includedItems.map(item => item.text || item),
    notIncluded: notIncludedItems.map(item => item.text || item),
    itinerary: normalizeArray(row.itinerary),
    images,
    gallery: images,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function normalizePackagePayload(payload = {}) {
  const title = payload.title || 'Untitled Package';
  const regularPrice = Number(payload.price || payload.originalPrice || 0);
  const discountPrice = Number(payload.discountPrice || payload.discount_price || payload.salePrice || regularPrice || 0);
  const gallery = normalizeArray(payload.gallery).filter(Boolean);
  const imageUrl = payload.image_url || payload.image || gallery[0] || '';

  return {
    slug: payload.slug || slugify(title),
    title,
    title_bn: payload.title_bn || null,
    destination: payload.destination || '',
    destination_bn: payload.destination_bn || null,
    price: regularPrice,
    discount_price: discountPrice,
    currency: payload.currency || 'SAR',
    duration: payload.duration || '',
    duration_bn: payload.duration_bn || null,
    image_url: imageUrl,
    category: payload.category || 'holiday',
    rating: Number(payload.rating || 0),
    reviews_count: parseInt(payload.reviews || payload.reviews_count || 0, 10),
    max_people: parseInt(payload.maxPeople || payload.max_people || 10, 10),
    is_popular: payload.is_popular ?? payload.popular ?? false,
    is_featured: payload.is_featured ?? payload.featured ?? false,
    is_active: payload.isActive ?? payload.active ?? true,
    description: payload.description || payload.overview || '',
    description_bn: payload.description_bn || null,
    overview: payload.overview || payload.description || '',
    overview_bn: payload.overview_bn || null,
    about_destination: payload.aboutDestination || payload.cityHistory || payload.about_destination || '',
    about_destination_bn: payload.aboutDestination_bn || payload.cityHistory_bn || payload.about_destination_bn || null,
    highlights: normalizeArray(payload.highlights),
    included: normalizeArray(payload.includes).length > 0
      ? normalizeArray(payload.includes)
      : normalizeArray(payload.included).map(item => (
          typeof item === 'string'
            ? { icon: 'Check', text: item, text_bn: item }
            : item
        )),
    not_included: normalizeArray(payload.notIncluded).map(item => (
      typeof item === 'string'
        ? { text: item, text_bn: item }
        : item
    )),
    itinerary: normalizeItinerary(payload.itinerary),
    gallery: gallery.length > 0 ? gallery : (imageUrl ? [imageUrl] : [])
  };
}

module.exports = {
  slugify,
  mapPackageRow,
  normalizePackagePayload
};
