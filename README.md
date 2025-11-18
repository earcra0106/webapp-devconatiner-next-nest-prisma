モノレポ開発における VSCode Dev Containers を活用した環境構築方法
https://blog.adglobe.co.jp/entry/2025/05/23/100000

devcntainerに入ったら以下を実行してください

```bash
cd frontend && npm run dev
```
```bash
cd backend && npm run start:dev
```

http://localhost:3000/hello にアクセスしてテスト

本番環境に向けた整備はまだです
本番環境ならnginxでプロキシするので http://localhost:8080 でいいはず