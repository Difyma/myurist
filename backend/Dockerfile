FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Create uploads directory
RUN mkdir -p uploads/contracts

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "src/server.js"]
