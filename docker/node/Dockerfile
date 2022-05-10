FROM node:alpine

EXPOSE 3000

RUN mkdir /app

WORKDIR /app

COPY /app .

RUN npm install

CMD ["npm", "run", "start"]
