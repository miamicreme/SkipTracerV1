import axios from 'axios';
import cheerio from 'cheerio';

export function urlBuilder({ query }) {
  return `https://www.truepeoplesearch.com/search?q=${encodeURIComponent(query)}`;
}

export async function parse(html) {
  try {
    const $ = cheerio.load(html);
    // TODO: implement actual parsing logic for truepeoplesearch
    const results = [];
    $('div.result').each((i, el) => {
      results.push($(el).text().trim());
    });
    return { results };
  } catch (error) {
    throw new Error(`truepeoplesearch parse error: ${error.message}`);
  }
}

export default { urlBuilder, parse };