// apps/api/src/parsers/index.js

// 1) Import only the actual parser modules
import fastpeoplesearch   from './fastpeoplesearch.js';
import whitepages         from './whitepages.js';
import zabasearch         from './zabasearch.js';
import truepeoplesearch   from './truepeoplesearch.js';
import anywho             from './anywho.js';
import beenVerified       from './beenVerified.js';
import clustrmaps         from './clustrmaps.js';
import thatsthem          from './thatsthem.js';

// 2) Map modes to parser lists
const parsersByMode = {
  PHONE: [ fastpeoplesearch, whitepages, zabasearch, anywho, beenVerified ],
  NAME:  [ fastpeoplesearch, truepeoplesearch, thatsthem ],
  ADDR:  [ zabasearch, clustrmaps ],
};

// 3) Export lookup
export function getParsersForMode(mode) {
  const key = (mode || '').toUpperCase();
  return parsersByMode[key] || [];
}

// 4) (Optional) default export: flat array of all
export default Object.values(parsersByMode).flat();
