FROM node:18-alpine

WORKDIR /app

COPY package*.json yarn.lock ./

COPY . .

RUN yarn

RUN npx tsc

CMD ["node", "bin/www"]

EXPOSE 3000