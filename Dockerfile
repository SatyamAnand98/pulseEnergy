FROM node:18.16.1-alpine
LABEL maintainer="Satyam Anand"

WORKDIR /var/www/app/pulse-energy

COPY package.json /var/www/app/pulse-energy
COPY tsconfig.json /var/www/app/pulse-energy

ENV NODE_ENV="production" CLIENT_COUNT=3 DB_URI="mongodb+srv://admin:admin@pulseenergy.2q01dxj.mongodb.net/"
RUN npm install

COPY . /var/www/app/pulse-energy
RUN npm run build

RUN rm -rf src/
EXPOSE 3000

# Command to run when starting the container
CMD ["npm", "run", "start-server"]
