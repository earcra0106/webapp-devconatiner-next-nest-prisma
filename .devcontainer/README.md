# .devcontainer

このディレクトリには、Visual Studio Code の devcontainer 拡張機能を使用して開発環境を構築するための設定ファイルが含まれています。

## 実行方法

1. 事前に Docker と WSL2 をインストールが必要です。Docker Desktop をインストール・起動し、WSL2 インテグレーションを有効にしてください。

2. wsl 内に配置したプロジェクトのルートディレクトリで、 Visual Studio Code を開きます。

3. .env ファイルを準備します。以下のコマンドを実行して、必要な環境変数ファイルをコピーします。

```bash
cp .env.example .env && \
cp backend/.env.example backend/.env && \
cp frontend/.env.development.example frontend/.env.development && \
cp frontend/.env.production.example frontend/.env.production && \
cp .devcontainer/.env.example .devcontainer/.env
```

4. VSCode のコマンドパレット（`Ctrl + Shift + P`）を開き、「Dev Containers: Reopen in Container」を選択します。自動的に devcontainer がビルドされ、コンテナ内で開発環境が起動します。

5. コンテナ内のターミナルで、各開発サーバを起動します。

```bash
# バックエンドサーバの起動
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npm run start:dev
```

```bash
# Prisma Studioの起動
cd backend
npx prisma studio --port 5555
```

```bash
# フロントエンドサーバの起動
cd frontend
npm install
npm run dev
```

完了後、ブラウザで `http://localhost:3000` にアクセスして、アプリケーションが動作していることを確認してください。

## 参考記事

開発環境構築時に参考にした記事を以下に示します。

devcontainer 構築中に参照  
[モノレポ開発における VSCode Dev Containers を活用した環境構築方法](https://blog.adglobe.co.jp/entry/2025/05/23/100000)

prisma の seed 実行時の問題解決に参照 (公式ドキュメント)  
[Prisma - Changelog](https://www.prisma.io/changelog)

NestJS 環境構築、およびファイルごとの役割理解のため参照  
[【NestJS】ゼロから始めるNestJS、環境構築の全手順（初心者向け🔰） #NestJS - Qiita](https://qiita.com/to3izo/items/9be3c419c9b66e131565)

Vitest を NestJS プロジェクトに導入する際に参照  
[Nest.js × Vitest の環境構築](https://zenn.dev/ot_offcial/articles/6933b5e8be3091)

NestJS の本番環境ビルド時の問題解決に参照  
[Nest.js で start:prod 実行時に Error: Cannot find module 'dist/main' と表示される](https://zenn.dev/cykinso/articles/3c7d590ca1dab1)

NestJS の本番環境ビルド時のDB反映のため参照  
[Prisma Migrate: Docker を使用した移行のデプロイ](https://notiz.dev/blog/prisma-migrate-deploy-with-docker)