import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { aggregate } from '../src/runAllParsers.js';
import fs from 'fs/promises';
import path from 'path';
import * as parsersIndex from '../src/parsers/index.js';
import axios from 'axios';
import { tmpdir } from 'os';

vi.mock('../src/parsers/index.js');
vi.mock('axios');

describe('aggregate', () => {
  const build = () => 'http://example.com/test';
  const parser = {
    urlBuilder: vi.fn(build),
    parse: vi.fn(async () => ({ ok: true }))
  };

  beforeEach(() => {
    parsersIndex.getParsersForMode.mockReturnValue([parser]);
    axios.get.mockResolvedValue({ data: '<html></html>' });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('writes aggregated parser results to a file', async () => {
    const outFile = path.join(tmpdir(), 'agg.json');
    const returned = await aggregate('PHONE', { query: '123' }, outFile);
    expect(returned).toBe(outFile);
    const data = JSON.parse(await fs.readFile(outFile, 'utf8'));
    expect(data[0].parser).toBe(parser.urlBuilder.name);
    expect(data[0].data).toEqual({ ok: true });
  });
});
