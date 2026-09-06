export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/19DER6kCLD/',
  instagram: 'https://www.instagram.com/farmfresh.dairy?stkn=MTFvM3dyNno4bnV4cg==',
  whatsapp: 'https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk.',
  googleMaps: 'https://maps.app.goo.gl/6py8ur9ibkQ2cSfWA?g_st=aw',
  openStreetMap: 'https://www.openstreetmap.org/?mlat=33.66913&mlon=73.13563#map=16/33.66913/73.13563',
  openStreetMapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=73.1150%2C33.6550%2C73.1550%2C33.6820&layer=mapnik&marker=33.66913%2C73.13563',
  plusCode: 'M49P+M78, Chak Shahzad, Islamabad',
  phoneDisplay: '0310-9361932',
  phoneRaw: '03109361932',
  email: 'farmfreshdairy28@gmail.com',
  address: 'Farm Fresh Dairy Products, Chak Shahzad / Shahzad Town, Islamabad, Pakistan',
};

/**
 * Checks if a delivery area qualifies for 100% FREE doorstep delivery.
 * Free delivery locations:
 * 1. Shahzad Town
 * 2. I-8 Sector (All Sub-sectors)
 * 3. I-9 Sector (All Sub-sectors)
 */
export function isFreeDeliveryArea(name?: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  const isShahzad = lower.includes('shahzad town') && !lower.includes('chak shahzad');
  const isI8 = lower.includes('i-8') || lower.includes('i8');
  const isI9 = lower.includes('i-9') || lower.includes('i9');
  return isShahzad || isI8 || isI9;
}

