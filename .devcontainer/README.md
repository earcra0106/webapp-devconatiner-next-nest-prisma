モノレポ開発における VSCode Dev Containers を活用した環境構築方法
https://blog.adglobe.co.jp/entry/2025/05/23/100000

devcntainer に入ったら以下を実行してください

```bash
cd frontend && npm install && npm run dev
```

```bash
cd backend && sudo npm install -g @nestjs/cli && npm run start:dev
```

http://localhost:3000/hello にアクセスしてテスト
