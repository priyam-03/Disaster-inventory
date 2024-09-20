# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Install required OS packages for Prisma
RUN apk add --no-cache openssl

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm install

# Copy Prisma schema and generate the Prisma client
COPY . .
RUN npx prisma generate

# Copy the rest of the application


# Build the Next.js application
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install required OS packages for Prisma
RUN apk add --no-cache openssl

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Set environment to production
ENV NODE_ENV=production

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
