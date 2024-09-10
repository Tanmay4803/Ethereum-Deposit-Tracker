# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies inside the container
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app will run on (adjust the port if needed)
EXPOSE 3000

# Define environment variables (optional, or better to use docker-compose for this)
# ENV ALCHEMY_URL=<your-alchemy-url>

# Command to run your application
CMD ["node", "index.js"]
