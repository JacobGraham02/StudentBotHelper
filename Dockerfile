# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/studentbothelper

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your application
CMD [ "node", "dist/app.js" ]
