# SkipTracerV1 - Production Ready with ScraperAPI

## ScraperAPI Integration

This version proxies all HTTP requests through [ScraperAPI](https://www.scraperapi.com) to handle IP rotation, CAPTCHA, and anti-bot measures.

1. **Set your ScraperAPI key** in `.env`:
   ```
   SCRAPERAPI_KEY=your_scraperapi_key_here
   ```

2. **Axios is configured automatically** via an interceptor in `apps/api/src/index.js`.



# SkipTrace Verifier Real

Production-ready skeleton. See docs/ for details.
