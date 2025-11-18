# ssp web proj

本番環境に向けた整備はまだです
本番環境なら nginx でプロキシするので http://localhost:8080 でいいはず

本番環境のビルドは以下を実行

```bash
docker compose down --rmi all && docker compose build --no-cache && docker compose up -d
```
