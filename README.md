# Webプログラミング 最終課題

2025-11-25 更新

このリポジトリは、Webプログラミングの最終課題として作成されたアプリケーションのソースコードを含んでいます。

## 概要

このアプリケーションは、ユーザーがノートを管理できるシンプルなタスク管理システムです。ユーザーはノートの作成、編集、削除が可能です。
フロントエンドにポモドーロタイマー機能が実験的に実装されています。

## 技術スタック

- バックエンド: NestJS, Prisma, PostgreSQL
- フロントエンド: Next.js, React, Tailwind CSS
- 認証: JWT
- プロキシサーバー: Nginx
- コンテナ管理: Docker, Docker Compose
- 開発環境: Visual Studio Code, devcontainers拡張機能

## 動作環境

起動には WSL2 と Docker が必要です。

## 必要なファイルを準備する

### 1. env ファイルの準備

```bash
cp .env.example .env && \
cp backend/.env.example backend/.env && \
cp frontend/.env.development.example frontend/.env.development && \
cp frontend/.env.production.example frontend/.env.production && \
cp .devcontainer/.env.example .devcontainer/.env
```

### 2. dockerの起動

```bash
docker compose build --no-cache && docker compose up -d
```

### 3. 実行確認

ブラウザで `http://localhost:8080` にアクセスして、アプリケーションが動作していることを確認してください。

実行環境では自動でユーザが作成されており、以下の情報でログインできます。

| メールアドレス       | パスワード   |
|------------------|----------|
| alice@prisma.io | alicepassword |
| bob@prisma.io   | bobpassword   |

### 4. 操作方法

サイドバーには、ノートの一覧が表示されます。ノートをクリックすると、その内容が表示され、編集が可能です。

編集後は、編集せずに3秒間待つことで自動保存されます。 `Ctrl + S` を押すことで、その場で保存することもできます。

ノート一覧の項目にマウスオーバーすると、削除ボタンが表示され、ノートを削除できます。

画面右にはポモドーロタイマーが表示されます。 `Start` ボタンを押すと、25分間の作業タイマーが開始されます。タイマーが終了すると、5分間の休憩タイマーが自動的に開始されます。

### 5. その他

各フォルダ下に README.md がありますので、詳細はそちらをご覧ください。