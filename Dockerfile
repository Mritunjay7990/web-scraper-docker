# Stage 1: Node.js Scraper
FROM node:18-alpine AS scraper

# Install Chromium with full dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    udev \
    dbus \
    xvfb \
    tzdata \
    && rm -rf /var/cache/apk/*

# Configure Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    DISPLAY=:99 \
    NODE_ENV=production

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY scrape.js .
ARG SCRAPE_URL
ENV SCRAPE_URL=${SCRAPE_URL}

# Use Xvfb virtual display
RUN Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 & \
    npm start

# Stage 2: Python Server
FROM python:3.10-alpine
WORKDIR /app
COPY --from=scraper /app/scraped_data.json .
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py .
EXPOSE 5000
CMD ["python", "server.py"]
