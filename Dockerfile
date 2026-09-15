# ---- Base image ----
FROM node:18-alpine

# ---- Set working directory ----
WORKDIR /usr/src/app

# ---- Install dependencies first (better layer caching) ----
COPY package*.json ./
RUN npm install --production

# ---- Copy application source ----
COPY . .

# ---- App listens on port 8080 ----
EXPOSE 8080
ENV PORT=8080

# ---- Start the app ----
CMD ["node", "server.js"]
