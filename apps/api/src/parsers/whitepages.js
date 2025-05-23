import cheerio from 'cheerio';
export const modes = ['PHONE','NAME','ADDR'];
export async function parse(html, context={}) {
  const $ = cheerio.load(html);
  // TODO: implement selector extraction
  return { source: 'STUB', phones: [], emails: [], name: '', address: '' };
}
