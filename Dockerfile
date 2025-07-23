# Dockerfile
# Gunakan Node.js sebagai base image
FROM node:18-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code
COPY . .

# Build aplikasi Vue.js untuk production
RUN npm run build

# Buat direktori db jika belum ada
RUN mkdir -p db

# Expose port 3001 sesuai server.js kamu
EXPOSE 3001

# Jalankan server.js
CMD ["node", "server.js"]