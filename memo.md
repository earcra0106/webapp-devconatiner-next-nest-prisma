# 開発記録

## 20251118 1:09

.env からうまく環境変数を読み込めず、compose up ができない状態。
とりあえずすべてハードコーディングして、さっさと開発に入る。

## 20251118 14:00

開発環境が完成。プロキシサーバーの整備は未完成のため、本番環境で動かすのはまだ。

## 20251119 4:23

プロダクションのインフラが汲めていないので、nginx の設定を要編集。

以下のプロダクションビルド中エラーに対応する。

```
 => ERROR [backend builder 6/6] RUN npm run build                                                  5.2s
------
 > [backend builder 6/6] RUN npm run build:
0.732
0.732 > backend@0.0.1 build
0.732 > nest build
0.732
4.948 src/main.ts:6:20 - error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
4.948
4.948 6   await app.listen(process.env.PORT ?? 8000);
4.948                      ~~~~~~~
4.948
4.948 Found 1 error(s).
4.948
------
Dockerfile:20

--------------------

  18 |     RUN npm i -g @nestjs/cli

  19 |     COPY ./backend .

  20 | >>> RUN npm run build

  21 |

  22 |     # 本番環境用イメージの作成

--------------------

target backend: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

```

## 20251119 12:26

本番環境も動くようになった。
MySQLの整備を行う。これが終わったら開発できるぜ！
devはコンテナの中にそのままインストールする。
本番環境はcomposeにdbコンテナを含める。


prisma環境構築
https://tech-lab.sios.jp/archives/45377

```bash
cd backend

npm install prisma --save-dev

# npx prisma init

npm i --save @nestjs/config

npx prisma migrate dev --name init

npx prisma studio
```

## 20251124 18:32
touch src/domain/pomodoro-note-stat/dto/create-pomodoro-note-stat.dto.ts && \
touch src/domain/pomodoro-note-stat/dto/update-pomodoro-note-stat.dto.ts && \
touch src/domain/pomodoro-note-stat/pomodoro-note-stat.repository.ts && \
touch src/domain/pomodoro-note-stat/pomodoro-note-stat.service.ts && \
touch src/domain/pomodoro-note-stat/pomodoro-note-stat.controller.ts && \
touch src/domain/pomodoro-note-stat/pomodoro-note-stat.module.ts

## 20251125 7:53
シードデータを消そうとしてもできないみたい。
ノートに紐づいているポモドーロ統計データがあると、ノートを消せない。
APIを改善して、ノートを消すときに紐づいているポモドーロ統計データも一緒に消すようにする必要があるが、時間がかかりそうなので後回しにする。