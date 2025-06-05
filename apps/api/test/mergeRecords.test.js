import { describe, it, expect } from 'vitest';
import { mergeRecords } from '../src/services/mergeRecords.js';

describe('mergeRecords', () => {
  it('merges multiple records, picking first non-empty values and union of arrays', () => {
    const record1 = {
      fullName: 'John Doe',
      age: 30,
      addressCurrent: '123 A St',
      addressPrevious: ['456 B St'],
      phones: ['111'],
      emails: ['a@x.com']
    };
    const record2 = {
      fullName: '',
      age: 31,
      addressCurrent: '',
      addressPrevious: ['789 C St'],
      phones: ['222'],
      emails: ['b@x.com']
    };
    const [result] = mergeRecords([record1, record2]);
    expect(result.fullName).toBe('John Doe');
    expect(result.age).toBe(30);
    expect(result.addressCurrent).toBe('123 A St');
    expect(result.addressPrevious).toEqual(['456 B St', '789 C St']);
    expect(result.phones).toEqual(['111', '222']);
    expect(result.emails).toEqual(['a@x.com', 'b@x.com']);
  });

  it('returns empty array when no records are provided', () => {
    expect(mergeRecords([])).toEqual([]);
  });
});
