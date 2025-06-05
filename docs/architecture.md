# Architecture

This project exposes a small Express based API under `apps/api`.

## API structure

- **Entry point**: `apps/api/src/index.js` sets up an Express server with CORS and a `/run` endpoint.
- **Controllers**: The `/run` endpoint calls `runJob` from `controllers/job.controller.js` which orchestrates a data collection job.
- **Parsers**: Parsers under `src/parsers` implement `urlBuilder` and `parse` functions. `runAllParsers` iterates over parsers for the selected mode (PHONE, NAME, or ADDR) and fetches HTML using Axios. Requests are automatically proxied through ScraperAPI if configured.
- **AI processing**: Raw parser results are passed to `processWithAI.organizeAndRate`, which uses the OpenAI API to deduplicate and score each record. The output is a ranked JSON file.

## Data flow

1. **Client request**: A client POSTs to `/run` with `{ mode, query }` or detailed name/address fields.
2. **Aggregation**: `runJob` invokes `aggregate` in `runAllParsers.js`, which fetches data from each configured parser and writes a raw JSON file.
3. **AI ranking**: `organizeAndRate` reads the raw file, sends a prompt to OpenAI and saves the ranked results.
4. **Response**: The ranked JSON file is returned as a downloadable response.

Environment variables such as `SCRAPER_API_KEY` and `OPENAI_API_KEY` control external integrations.
