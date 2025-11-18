ARG NODE_VERSION
ARG BACKEND_CONTAINER_PORT

FROM node:24.11.1-alpine3.22

WORKDIR /backend

COPY ./backend /backend

RUN apk add --no-cache bash

RUN npm install --production

# エラー吐いた (sh: nest: not found)
RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
