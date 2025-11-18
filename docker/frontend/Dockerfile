ARG NODE_VERSION=latest
ARG FRONTEND_CONTAINER_PORT=3000

# バージョンを設定
FROM node:${NODE_VERSION}-alpine3.22 AS base

# 依存関係のインストール
FROM base AS dependency
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm ci

# アプリケーションのビルド
FROM base AS builder
WORKDIR /app

COPY --from=dependency /app/node_modules ./node_modules
COPY ./frontend .

# RUN npx prisma generate
RUN npm run build

# 本番環境用イメージの作成
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE ${FRONTEND_CONTAINER_PORT}

ENV PORT ${FRONTEND_CONTAINER_PORT}

CMD HOSTNAME="0.0.0.0" node server.js