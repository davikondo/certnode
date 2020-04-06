FROM node:10

RUN mkdir -p /usr/share/node_modules && chown -R node:node /usr/share/node
WORKDIR /usr/share/node
COPY package*.json ./
RUN npm install
COPY . .
COPY --chown=node:node . .
USER node
EXPOSE 8080
CMD [ "node", "server.js" ]
