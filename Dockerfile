FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app files to the container
COPY . .

# Expose port 8080 for the app
EXPOSE 8080

RUN npm run build

# Start the app
CMD ["npm", "start"]