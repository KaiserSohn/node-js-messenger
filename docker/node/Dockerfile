FROM node:alpine

EXPOSE 3000

WORKDIR /var/application

COPY ./app/ .

RUN npm install

CMD ["npm", "run", "start"]
