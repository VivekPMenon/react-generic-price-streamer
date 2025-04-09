FROM node:18
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compile both Next.js and Express
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
