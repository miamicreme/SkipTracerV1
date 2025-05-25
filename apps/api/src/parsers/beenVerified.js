import * as cheerio from 'cheerio';

export const modes = ['PHONE', 'NAME', 'ADDR'];

export function urlBuilder(value) {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  // Phone lookup
  if (digitsOnly.length >= 7) {
    return `https://www.beenverified.com/phone/${digitsOnly}`;
  }
  // Address lookup
  if (/\d+\s+/.test(value)) {
    const slug = encodeURIComponent(
      value.toLowerCase().trim().replace(/\s+/g, '-')
    );
    return `https://www.beenverified.com/address/${slug}`;
  }
  // Name lookup
  const nameSlug = encodeURIComponent(
    value.toLowerCase().trim().replace(/\s+/g, '-')
  );
  return `https://www.beenverified.com/people/${nameSlug}`;
}

export function parse(html) {
  const $ = cheerio.load(html);
  // Attempt JSON-LD extraction
  let profile = null;
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      if (json['@type'] === 'Person') {
        profile = json;
      }
    } catch (err) {
      // ignore parse errors
    }
  });

  const fullName =
    profile?.name || $('h1.profile-name').text().trim() || '';
  const ageMatch = $('span.age').text().match(/(\d+)/);
  const age = ageMatch ? parseInt(ageMatch[1], 10) : null;

  const phones = [];
  $('a[href^="tel:"]').each((i, el) => {
    phones.push($(el).text().trim());
  });

  const emails = [];
  $('a[href^="mailto:"]').each((i, el) => {
    emails.push($(el).text().trim());
  });

  let currentAddress = '';
  if (profile?.address) {
    const addr = profile.address;
    currentAddress =
      typeof addr === 'string'
        ? addr
        : `${addr.streetAddress || ''} ${addr.addressLocality || ''} ${
            addr.addressRegion || ''
          } ${addr.postalCode || ''}`.trim();
  } else {
    currentAddress = $('div.current-address').text().trim();
  }

  return {
    source: 'BeenVerified',
    fullName,
    age,
    phones,
    emails,
    addressCurrent: currentAddress,
    addressPrevious: []
  };
}
