FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Compile both Next.js and Express
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
