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

# 自動生成物が存在する場合は削除して、クリーンな状態で生成を行う
RUN rm -rf ./generated

# Prisma Clientの生成
RUN npx prisma generate

# アプリケーションのビルド
RUN npm run build

# 本番環境用イメージの作成
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/schema.prisma ./dist/prisma/schema.prisma
COPY --from=builder /app/prisma/migrations ./dist/prisma/migrations
COPY --from=dependency /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE ${BACKEND_CONTAINER_PORT}

CMD [ "npm", "run", "start:migrate:seed:prod" ]