import axios from 'axios';
import cheerio from 'cheerio';

export function urlBuilder({ firstName, lastName }) {
  const fname = encodeURIComponent(firstName.trim());
  const lname = encodeURIComponent(lastName.trim());
  return `https://www.fastpeoplesearch.com/name/${lname}/${fname}`;
}

export async function parse(html) {
  try {
    const $ = cheerio.load(html);
    const header = $('h1').first().text().trim().split(',');
    const name = header[0] || '';
    const ageMatch = $('h1 span').text().match(/\d+/);
    const age = ageMatch ? ageMatch[0] : '';
    const phones = [];
    $('a[href^="tel:"]').each((i, el) => {
      phones.push($(el).text().trim());
    });
    const addresses = [];
    $('section:contains("Address History") li').each((i, el) => {
      addresses.push($(el).text().trim());
    });
    return { name, age, phones, addresses };
  } catch (error) {
    throw new Error(`FastPeopleSearch parse error: ${error.message}`);
  }
}

export default { urlBuilder, parse };