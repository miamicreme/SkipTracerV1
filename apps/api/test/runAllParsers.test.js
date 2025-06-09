import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

vi.mock('../src/parsers/index.js', () => ({
  getParsersForMode: vi.fn(),
}));
vi.mock('axios');

import { getParsersForMode } from '../src/parsers/index.js';
import axios from 'axios';
import { aggregate } from '../src/runAllParsers.js';

describe('aggregate', () => {
  let tmpDir;
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agg-'));
  });
  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('runs parsers and writes aggregated results', async () => {
    function url1() { return 'http://one'; }
    const parser1 = { urlBuilder: url1, parse: vi.fn().mockResolvedValue('A') };
    function url2() { return 'http://two'; }
    const parser2 = { urlBuilder: url2, parse: vi.fn().mockResolvedValue('B') };
    getParsersForMode.mockReturnValue([parser1, parser2]);
    axios.get.mockResolvedValue({ data: '<html>' });

    const outFile = path.join(tmpDir, 'out.json');
    const full = await aggregate('PHONE', { query: 'x' }, outFile);

    expect(full).toBe(path.resolve(process.cwd(), outFile));
    const data = JSON.parse(await fs.readFile(full, 'utf-8'));
    expect(data).toEqual([
      { parser: 'url1', data: 'A' },
      { parser: 'url2', data: 'B' }
    ]);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(parser1.parse).toHaveBeenCalled();
    expect(parser2.parse).toHaveBeenCalled();
  });
});
