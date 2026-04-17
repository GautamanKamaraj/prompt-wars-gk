# Use official Node.js image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Only copy package files to take advantage of layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy local code to the container image
COPY . .

# Set environment variables
ENV NODE_ENV production
ENV PORT 8080

# Expose port and start the server
EXPOSE 8080
CMD [ "node", "index.js" ]
