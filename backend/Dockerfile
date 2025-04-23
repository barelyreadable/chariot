FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY src ./src
COPY .env ./.env

EXPOSE 5000
CMD ["node", "src/server.js"]
