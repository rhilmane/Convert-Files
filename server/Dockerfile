FROM node:18-bullseye

# Install system dependencies for file conversion
RUN apt-get update && apt-get install -y \
    ffmpeg \
    pandoc \
    texlive-latex-base \
    texlive-fonts-recommended \
    libreoffice \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy app source
COPY . .

# Create necessary directories
RUN mkdir -p uploads processed

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "src/index.js"]
