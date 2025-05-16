FROM node:20
WORKDIR /app

# Copy .npmrc first (important for caching and avoiding token leak)
COPY .npmrc .npmrc

# Copy package files and install
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
