#  Dockerfile for Node Express Backend api (development)
FROM node:latest
RUN mkdir -p /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000

CMD ["npm","start"]


