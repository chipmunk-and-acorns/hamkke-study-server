FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN apt-get update && apt-get install -y postgresql-client

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
