# Production Build

# Stage 1: Build react client
FROM node:latest as client

# Working directory be app
WORKDIR /usr/app/client/

COPY client/package*.json ./

# Install dependencies
RUN npm install

# copy local files to app folder
COPY client/ ./

RUN npm build

# Stage 2 : Build Server

FROM node:latest

WORKDIR /usr/src/app/
COPY --from=client /usr/app/client/build/ ./client/build/

WORKDIR /usr/src/app/server/
COPY server/package*.json ./
RUN npm install -qy
COPY server/ ./

ENV PORT 5000

EXPOSE 5000

CMD ["npm", "start"]