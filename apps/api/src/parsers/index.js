// apps/api/src/parsers/index.js

// 1) Import every parser module
import fastpeoplesearch      from './fastpeoplesearch.js';
import whitepages            from './whitepages.js';
import zabasearch            from './zabasearch.js';
import truepeoplesearch      from './truepeoplesearch.js';
import anywho                from './anywho.js';
import beenVerified          from './beenVerified.js';
import clustrmaps            from './clustrmaps.js';
import familytreejs          from './familytreejs.js';
import thatsthem             from './thatsthem.js';

// 2) Map mode names to parser instances
const parsersByMode = {
  PHONE:   [ fastpeoplesearch, whitepages, zabasearch, anywho, beenVerified ],
  NAME:    [ fastpeoplesearch, truepeoplesearch, thatsthem ],
  ADDR:    [ zabasearch, clustrmaps, familytreejs ],
  // …add or tweak these arrays based on your business logic
};

// 3) Export the lookup function
export function getParsersForMode(mode) {
  const key = (mode || '').toUpperCase();
  return parsersByMode[key] || [];
}

// 4) Export all parsers (if you need them en masse)
export default Object.values(parsersByMode).flat();
