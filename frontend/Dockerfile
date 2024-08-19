FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the frontend application
CMD ["npm", "start"]