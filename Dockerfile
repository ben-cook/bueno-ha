FROM ghcr.io/hassio-addons/base-nodejs:0.1.4

WORKDIR /app

COPY / /app

RUN npm install

RUN chmod a+x /app/run.sh

CMD [ "/app/run.sh" ]