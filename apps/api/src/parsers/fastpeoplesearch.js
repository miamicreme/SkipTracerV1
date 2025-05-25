import * as cheerio from 'cheerio';

export const modes = ['PHONE', 'NAME', 'ADDR'];

export function urlBuilder(value) {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  // Phone lookup
  if (digitsOnly.length >= 7) {
    return `https://www.fastpeoplesearch.com/phone/${digitsOnly}`;
  }
  // Address lookup
  if (/\d+\s+/.test(value)) {
    const slug = encodeURIComponent(
      value.toLowerCase().trim().replace(/\s+/g, '-')
    );
    return `https://www.fastpeoplesearch.com/address/${slug}`;
  }
  // Name lookup
  const nameSlug = encodeURIComponent(
    value.toLowerCase().trim().replace(/\s+/g, '-')
  );
  return `https://www.fastpeoplesearch.com/people/${nameSlug}`;
}

export function parse(html) {
  const $ = cheerio.load(html);
  // Attempt JSON-LD
  let profile = null;
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      if (json['@type'] === 'Person') profile = json;
    } catch {}
  });

  // Name and basic info
  const fullName = profile?.name || $('h1').first().text().trim() || '';
  const ageMatch = $('span:contains("Age")').text().match(/(\d+)/);
  const age = ageMatch ? parseInt(ageMatch[1], 10) : null;

  // Phones
  const phones = [];
  $('a[href^="tel:"]').each((i, el) => phones.push($(el).text().trim()));

  // Emails
  const emails = [];
  $('a[href^="mailto:"]').each((i, el) => emails.push($(el).text().trim()));

  // Current address
  let currentAddress = '';
  if (profile?.address) {
    const addr = profile.address;
    currentAddress = typeof addr === 'string'
      ? addr
      : `${addr.streetAddress || ''} ${addr.addressLocality || ''} ${addr.addressRegion || ''} ${addr.postalCode || ''}`.trim();
  } else {
    currentAddress = $('div:contains("Current Address")').next().text().trim();
  }

  return {
    source: 'FastPeopleSearch',
    fullName,
    age,
    phones,
    emails,
    addressCurrent: currentAddress,
    addressPrevious: []
  };
}

// Default export for ESM imports
export default { modes, urlBuilder, parse };
