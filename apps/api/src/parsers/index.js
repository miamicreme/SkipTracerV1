import anywho from './anywho.js';
import beenVerified from './beenVerified.js';
import clustrmaps from './clustrmaps.js';
import familytreenow from './familytreenow.js';
import fastpeoplesearch from './fastpeoplesearch.js';
import peoplefinder from './peoplefinder.js';
import rehold from './rehold.js';
import spokeo from './spokeo.js';
import thatsthem from './thatsthem.js';
import truepeoplesearch from './truepeoplesearch.js';
import whitepages from './whitepages.js';
import zabasearch from './zabasearch.js';

const parsersByMode = {
  PHONE: [anywho, beenVerified, clustrmaps, familytreenow, fastpeoplesearch, peoplefinder, rehold, spokeo, thatsthem, truepeoplesearch, whitepages, zabasearch],
  NAME: [anywho, beenVerified, clustrmaps, familytreenow, fastpeoplesearch, peoplefinder, rehold, spokeo, thatsthem, truepeoplesearch, whitepages, zabasearch],
  ADDR: [anywho, beenVerified, clustrmaps, familytreenow, fastpeoplesearch, peoplefinder, rehold, spokeo, thatsthem, truepeoplesearch, whitepages, zabasearch]
};

export function getParsersForMode(mode) {
  const key = (mode || '').toUpperCase();
  return parsersByMode[key] || [];
}

export default Object.values(parsersByMode).flat();
