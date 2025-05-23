module.exports = {
  scraper: {
    base: 'http://api.scraperapi.com',
    opts: { country_code: 'us', device_type: 'desktop' }
  },
  queue: { concurrency: 5 },
  logging: { level: 'info' }
};
