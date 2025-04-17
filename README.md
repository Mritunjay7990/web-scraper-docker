# Web Scraper with Node.js + Python Docker

A Dockerized web scraper using:
- **Node.js** with Puppeteer for browser automation
- **Python Flask** to serve scraped data as JSON API

## 🚀 Features
- Multi-stage Docker build
- Dynamic URL scraping via environment variable
- Lightweight Alpine Linux base images
- Headless Chromium configuration

## ⚙️ Setup
1. Build the image:
   ```bash
   docker build --build-arg SCRAPE_URL=https://example.com -t web-scraper .
