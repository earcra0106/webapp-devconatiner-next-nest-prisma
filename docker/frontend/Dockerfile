ARG NODE_VERSION
ARG FRONTEND_CONTAINER_PORT

FROM node:24.11.1-alpine3.22

WORKDIR /frontend

COPY ./frontend /frontend

RUN apk add --no-cache bash

RUN npm install && \
    npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
