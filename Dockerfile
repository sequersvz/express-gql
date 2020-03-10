FROM node:13.8.0-stretch

COPY . .
RUN npm install

COPY . /express-gql/

CMD ["npm", "start"]