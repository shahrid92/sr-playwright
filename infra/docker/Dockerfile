FROM mcr.microsoft.com/playwright:v1.50.1-noble

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci
COPY . ./
ENTRYPOINT ["sh", "-c", "echo 'PWD:' && pwd && echo 'LS:' && ls -al && exec \"$@\"", "--"]

EXPOSE 6379

CMD ["sh", "-c", "node bull-mq/consumer/consumer.js"]

