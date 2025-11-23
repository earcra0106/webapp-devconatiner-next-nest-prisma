devcntainer に入ったら以下を実行してください

## フロントエンド
```bash
cd frontend && npm install && npm run dev
```

## バックエンド
```bash
cd backend
```

### 環境変数

`.env` ファイルを作成し、以下を記述
```sh
PORT=8000

DATABASE_URL=postgresql://myuser:mypassword@postgres:5432/mydatabase
```

### TypeScript と Prisma インストール
```bash
# TypeScript 環境構築
npm install typescript tsx @types/node --save-dev

# tsconfig.json を作成
npx tsc --init

# Prisma 環境構築
npm install prisma @types/node @types/pg --save-dev

# Prisma クライアントと PostgreSQL ドライバインストール
npm install @prisma/client @prisma/adapter-pg pg dotenv
```
### TypeScript 設定変更
`tsconfig.json` の一部行を以下のように修正
(ignoreDeprecations は `npx tsc -v` で TypeScript バージョン 5.0 以降を使用している場合に追加)

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "5.0"
  }
}
```

`package.json` に以下を追加
(ESM モジュールを使用するため)

```json
{
  "type": "module",
}
```

### Prisma 初期化と設定
```bash
# Prisma 動作確認
npx prisma

# Prisma スキーマの初期化 (schema.prisma と prisma.config.ts を生成)
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

`prisma/schema.prisma` に以下記述
```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma" // Prisma クライアントの出力先
}

datasource db {
  provider = "postgresql"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

```bash
# マイグレーション実行
npx prisma migrate dev --name init

# Prisma クライアント生成
npx prisma generate
```

`lib/prisma.ts` を作成し、以下を記述
```typescript
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
```

### Seed データ投入
`prisma.config.ts` に以下を追加

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts" // ここに追加
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

prisma ディレクトリに `seed.ts` を作成し、以下を記述
```typescript
import { prisma } from '../lib/prisma';
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: true,
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'https://twitter.com/nexusgql',
            published: true,
          },
        ],
      },
    },
  })
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

```bash
# Seed データ投入実行
npx prisma db seed

# Prisma Studio 起動 (localhost:5555で確認)
npx prisma studio --port 5555
```

### NestJS インストールと起動

```bash
cd backend && sudo npm install -g @nestjs/cli

npx nest new . --package-manager npm --skip-git
```

`app.controller.ts` を以下のように修正
```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { prisma } from '../lib/prisma.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  getHelloEndPoint(): object {
    const users = prisma.user.findMany();
    return {
      message: 'Hello World!',
      data: users,
     };
  }
}
```

```bash
npm run start:dev
```

http://localhost:3000/hello にアクセスしてテスト


参考記事

モノレポ開発における VSCode Dev Containers を活用した環境構築方法
https://blog.adglobe.co.jp/entry/2025/05/23/100000

Next.js+PrismaのPrismaのSeed実行時に他のファイルを読み込まなかった。
https://zenn.dev/kyokasuigetu/articles/34da763544ba6a

https://qiita.com/to3izo/items/9be3c419c9b66e131565
https://zenn.dev/ot_offcial/articles/6933b5e8be3091