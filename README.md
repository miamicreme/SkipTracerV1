# SkipTracerV1 - Production Ready

## Setup

1. **Install dependencies**  
   ```bash
   cd apps/api
   npm install
   cd ../../
   npm install
   ```

2. **Configure environment**  
   Copy `.env.example` to `.env` and fill in your API keys.

3. **Run locally**  
   ```bash
   docker-compose up
   ```

4. **Deploy**  
   - API: Push to Render, use Dockerfile in `apps/api`.  
   - Frontend: Deploy static on Vercel, use `apps/web`.

## Parser Improvements

- **FastPeopleSearch**: Real parsing of name, age, phones, and address history.  
- **Other parsers**: Stub implementations with TODOs to add specific selector logic.

## Error Handling

- All parsers throw descriptive errors.  
- Job controller has global try/catch for HTTP 500 responses.
