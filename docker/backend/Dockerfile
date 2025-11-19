ARG NODE_VERSION=latest
ARG BACKEND_CONTAINER_PORT=8000

# バージョンを設定
FROM node:${NODE_VERSION}-alpine3.22 AS base

# 依存関係のインストール
FROM base AS dependency
WORKDIR /app

COPY ./backend/package*.json ./
RUN npm ci --only=production

# アプリケーションのビルド
FROM base AS builder
WORKDIR /app

COPY ./backend/package*.json ./
RUN npm ci --only=production
RUN npm install --save-dev @types/node
RUN npm i -g @nestjs/cli
COPY ./backend .
RUN npm run build

# 本番環境用イメージの作成
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY --from=dependency /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE ${BACKEND_CONTAINER_PORT}

CMD [ "npm", "run", "start:prod" ]