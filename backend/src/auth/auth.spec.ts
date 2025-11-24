import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module.js';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login - 正常にログインでき、accessToken が返る (alice)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'alice@prisma.io', password: 'alicepassword' })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(typeof res.body.accessToken).toBe('string');
  });

  it('POST /auth/login - 誤ったパスワードで 401 を返す', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'alice@prisma.io', password: 'wrong-password' })
      .expect(401);
  });
});