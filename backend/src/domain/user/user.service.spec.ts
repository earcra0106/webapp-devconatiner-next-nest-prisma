import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService (integration)', () => {
  let moduleRef: TestingModule;
  let service: UserService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('listUsers でシードユーザーを含む配列が返る', async () => {
    const users = await service.listUsers();
    const emails = users.map((u) => u.email);
    expect(Array.isArray(users)).toBe(true);
    expect(emails).toEqual(expect.arrayContaining(['alice@prisma.io', 'bob@prisma.io']));
  });

  it('既存メールで createUser すると BadRequestException を投げる', async () => {
    await expect(
      service.createUser({ email: 'alice@prisma.io', password: 'dummy', name: 'Alice Dup' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('createUser -> deleteUser の一連動作', async () => {
    const email = `test+${Date.now()}@example.com`;
    const created = await service.createUser({ email, password: 'p', name: 'Test' });
    expect(created).toHaveProperty('id');
    expect(created.email).toBe(email);

    const deleted = await service.deleteUser(created.id);
    expect(deleted.id).toBe(created.id);
  });

  it('存在しない id で getUser すると NotFoundException を投げる', async () => {
    await expect(service.getUser('non-existing-id')).rejects.toThrow(NotFoundException);
  });
});