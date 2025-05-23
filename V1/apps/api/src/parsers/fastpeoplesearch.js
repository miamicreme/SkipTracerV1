import cheerio from 'cheerio';

export const modes = ['PHONE','NAME','ADDR'];

export function urlBuilder(value){
  const digitsOnly = value.replace(/[^0-9]/g,'');
  if(digitsOnly.length>=7){
    return `https://www.fastpeoplesearch.com/phone-number/${digitsOnly}`;
  }
  if(value.match(/\d+\s/)){
    const slug = encodeURIComponent(value.toLowerCase().replace(/\s+/g,'-'));
    return `https://www.fastpeoplesearch.com/address/${slug}`;
  }
  const parts = value.trim().split(/\s+/);
  const ln = parts.pop();
  const fn = parts.join(' ');
  return `https://www.fastpeoplesearch.com/name/${fn}-${ln}`;
}

export async function parse(html, context={}){
  const $ = cheerio.load(html);
  const fullName = $('h1').first().text().trim() || $('title').text().split('|')[0].trim();
  const age = $('.Age').first().text().match(/\d+/)?.[0];
  const phones = [];
  $('a[href^="/phone/"]').each((i,el)=>phones.push($(el).text().trim()));
  const emails=[];
  // fastpeoplesearch rarely shows emails; leave blank
  const addressCurrent = $('a[href^="/address/"]').first().text().trim();
  const addressPrevious = [];
  $('section:contains("Previous Addresses") a[href^="/address/"]').each((i,el)=>{
    addressPrevious.push($(el).text().trim());
  });
  return {source:'FastPeopleSearch',fullName,age:age?parseInt(age):null,phones,emails,addressCurrent,addressPrevious};
}
