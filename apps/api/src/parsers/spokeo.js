import * as cheerio from 'cheerio';

export const modes = ['PHONE', 'NAME', 'ADDR'];

export function urlBuilder(value) {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  // Phone lookup
  if (digitsOnly.length >= 7) {
    return `https://www.spokeo.com/phone/${digitsOnly}`;
  }
  // Address lookup
  if (value.match(/\d+\s/)) {
    const slug = encodeURIComponent(
      value.toLowerCase().trim().replace(/\s+/g, '-')
    );
    return `https://www.spokeo.com/address/${slug}`;
  }
  // Name lookup
  const nameSlug = encodeURIComponent(
    value.toLowerCase().trim().replace(/\s+/g, '-')
  );
  return `https://www.spokeo.com/people/${nameSlug}`;
}

export function parse(html) {
  const $ = cheerio.load(html);
  // Try JSON-LD
  let person = null;
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      if (json['@type'] === 'Person') {
        person = json;
      }
    } catch (e) {
      // ignore
    }
  });

  // Extract fields
  const fullName =
    person?.name || $('h1').first().text().trim() || '';
  const age =
    person?.age ||
    parseInt(
      ($('span:contains("Age")').text().match(/(\d+)/) || [])[0],
      10
    ) ||
    null;

  const phones = [];
  $('a[href^="tel:"]').each((i, el) => {
    phones.push($(el).text().trim());
  });

  const emails = [];
  $('a[href^="mailto:"]').each((i, el) => {
    emails.push($(el).text().trim());
  });

  let addressCurrent = '';
  if (person?.address) {
    const addr = person.address;
    addressCurrent =
      typeof addr === 'string'
        ? addr
        : `${addr.streetAddress || ''} ${addr.addressLocality || ''} ${
            addr.addressRegion || ''
          } ${addr.postalCode || ''}`.trim();
  } else {
    addressCurrent = $('div:contains("Current Address")')
      .next()
      .text()
      .trim();
  }

  return {
    source: 'Spokeo',
    fullName,
    age: age ? parseInt(age, 10) : null,
    phones,
    emails,
    addressCurrent,
    addressPrevious: []
  };
}
