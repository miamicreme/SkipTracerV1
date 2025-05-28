FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy source code
COPY src ./src
COPY healthcheck.sh /usr/local/bin/healthcheck.sh
COPY public ./public

RUN chmod +x /usr/local/bin/healthcheck.sh

# Expose port and healthcheck
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s CMD /usr/local/bin/healthcheck.sh || exit 1

# Start command
CMD ["npm", "start"]
