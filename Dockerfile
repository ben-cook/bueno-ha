ARG BUILD_FROM
FROM $BUILD_FROM

RUN apk add --update nodejs npm

WORKDIR /data

COPY ./ ./

RUN npm install

CMD ["npm", "run", "start"]