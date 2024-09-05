FROM node:22.8-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Run Next.js in development mode
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]