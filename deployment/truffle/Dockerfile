FROM node:14

WORKDIR /truffle

RUN npm install -g truffle
RUN npm config set bin-links false

COPY contracts ./contracts
COPY migrations ./migrations
COPY test ./test
COPY truffle-config.js ./truffle-config.js

ENTRYPOINT truffle compile && truffle migarte
