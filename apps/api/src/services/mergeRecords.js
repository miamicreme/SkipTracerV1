export function mergeRecords(records){
  if(!records.length) return [];
  // Simple merge: pick first non-empty field, union arrays
  const merged = {};
  for(const rec of records){
    if(rec.error) continue;
    merged.fullName = merged.fullName || rec.fullName;
    merged.age = merged.age || rec.age;
    merged.addressCurrent = merged.addressCurrent || rec.addressCurrent;
    merged.addressPrevious = Array.from(new Set([...(merged.addressPrevious||[]), ...(rec.addressPrevious||[])]));
    merged.phones = Array.from(new Set([...(merged.phones||[]), ...(rec.phones||[])]));
    merged.emails = Array.from(new Set([...(merged.emails||[]), ...(rec.emails||[])]));
  }
  return [merged];
}
