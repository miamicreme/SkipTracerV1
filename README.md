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
   - Uses Dockerfile in `apps/api`
   - Exposes port 3000
   - Healthcheck via `healthcheck.sh`

3. Deploy Web:
   - Static build in `apps/web`

4. Parsers:
   - Updated stubs in `apps/api/src/parsers`
   - Dispatch in `parsers/index.js`
