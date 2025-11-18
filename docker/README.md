# /docker フォルダ

このフォルダには、 **アプリケーション** の実行環境を定義する Dockerfile が格納されます。

アプリをビルドする場合は `docker compose up` をプロジェクトルートで実行してください。
ビルド後は [http://localhost:8080/](http://localhost:8080/) でアプリを開けます。

なお開発環境は [devcontainer.json](../.devcontainer/devcontainer.json) で定義されているため、このフォルダは直接関係ありません。

参考

- frontend のビルド
  - [Next.js アプリケーションのイメージサイズを劇的に削減するマルチステージビルドの魔法 #Docker - Qiita](https://qiita.com/s_sei/items/9019cd2ad9c30f4201a7)
