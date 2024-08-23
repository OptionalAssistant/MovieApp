FROM node:20 AS build

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the backend port
EXPOSE 4444

# Start the backend application
CMD ["npm", "start"]