import * as tps from './truepeoplesearch.js';
import * as fps from './fastpeoplesearch.js';

const registry = [tps, fps];

export function getParsersForMode(mode){
  return registry.filter(p=>p.modes.includes(mode));
}
