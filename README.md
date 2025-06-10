# SkipTracerV1 - Production Ready with ScraperAPI

## ScraperAPI Integration

This version proxies all HTTP requests through [ScraperAPI](https://www.scraperapi.com) to handle IP rotation, CAPTCHA, and anti-bot measures.

1. **Set your ScraperAPI key** in `.env`:
   ```
   SCRAPER_API_KEY=your_scraperapi_key_here
   ```

2. **Axios is configured automatically** via an interceptor in `apps/api/src/index.js`.



# SkipTrace Verifier Real

Production-ready skeleton. See docs/ for details.

## Production Ready Setup

1. Fill `.env` at project root with:
```
SCRAPER_API_KEY=your_scraperapi_key
OPENAI_API_KEY=your_openai_key
REDIS_URL=redis://user:pass@host:port/0
```

2. Deploy API:
   - Install dependencies and start the service:
     ```
     cd apps/api && npm install && npm start
     ```
   - A Dockerfile is provided in `apps/api` for container deployments.
   - The server listens on port `3000` and exposes a `/health` endpoint used by
     `healthcheck.sh`.

3. Parsers:
   - Updated stubs in `apps/api/src/parsers`
   - Dispatch in `parsers/index.js`

## Local Testing Frontend
A simple HTML page is available at `apps/api/public/test.html` for manually calling the `/run` endpoint. Start the API with the required environment variables and open the page in your browser to submit queries and view the raw response.

## React Frontend
An optional React interface lives in `apps/frontend`. It uses Vite and proxies API requests to the backend.

Run it locally with:

```bash
cd apps/frontend
npm install
npm run dev
```
