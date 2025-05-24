import * as cheerio from 'cheerio';

export const modes = ['PHONE','NAME','ADDR'];

export function urlBuilder(value) {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  // rudimentary builder: decide by length
  if (digitsOnly.length >= 7) {
    return `https://www.truepeoplesearch.com/find/phone/${digitsOnly}`;
  }
  if (value.match(/\d+\s/)) {
    // address
    const addr = encodeURIComponent(value.toLowerCase().replace(/\s+/g,'-'));
    return `https://www.truepeoplesearch.com/find/address/${addr}`;
  }
  // assume name
  const parts = value.trim().split(/\s+/);
  const ln = parts.pop();
  const fn = parts.join(' ');
  return `https://www.truepeoplesearch.com/find/${ln.toLowerCase()}/${fn.toLowerCase()}`;
}

export async function parse(html, context={}) {
  const $ = cheerio.load(html);
  // Try JSON-LD first
  let person = null;
  $('script[type="application/ld+json"]').each((i,el)=>{
    const txt = $(el).html();
    try{
      const json = JSON.parse(txt);
      if(json['@type']==='Person'){
        person = json;
      }
    }catch(e){}
  });
  if(!person){
    return { source:'TruePeopleSearch', error:'no-person-data' };
  }
  const fullName = person.name || '';
  const age = person.age || person['description']?.match(/age\s+(\d+)/i)?.[1] || null;
  const phones = person.telephone || [];
  const emails = person.email || [];
  const currentAddrObj = person.address;
  const addressCurrent = currentAddrObj ? `${currentAddrObj.streetAddress} ${currentAddrObj.addressLocality}, ${currentAddrObj.addressRegion} ${currentAddrObj.postalCode}` : '';
  // previous addresses may appear in description
  const desc = person.description || '';
  const prevMatch = desc.match(/previously lived in ([^.]+)/i);
  const addressPrevious = prevMatch ? [prevMatch[1].trim()] : [];
  return {
    source:'TruePeopleSearch',
    fullName,
    age: age ? parseInt(age):null,
    phones,
    emails,
    addressCurrent,
    addressPrevious
  };
}
