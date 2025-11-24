import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PomodoroSessionModule } from './pomodoro-session.module';
import { PomodoroSessionService } from './pomodoro-session.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PomodoroSessionService (integration)', () => {
  let moduleRef: TestingModule;
  let service: PomodoroSessionService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PomodoroSessionModule],
    }).compile();

    service = moduleRef.get<PomodoroSessionService>(PomodoroSessionService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('listSessions でシードのセッションを含む配列が返る', async () => {
    const sessions = await service.listSessions();
    expect(Array.isArray(sessions)).toBe(true);
    // seed では charaCount: 1000 のセッションが作られている想定
    const counts = sessions.map((s) => s.charaCount);
    expect(counts).toEqual(expect.arrayContaining([1000]));
  });

  it('listSessionsByUser でユーザーのセッション一覧が取得できる', async () => {
    const sessions = await service.listSessions();
    expect(sessions.length).toBeGreaterThan(0);
    const userId = sessions[0].userId;
    const byUser = await service.listSessionsByUser(userId);
    expect(Array.isArray(byUser)).toBe(true);
    expect(byUser.every((s) => s.userId === userId)).toBe(true);
  });

  it('createSession -> deleteSession の一連動作', async () => {
    const sessions = await service.listSessions();
    expect(sessions.length).toBeGreaterThan(0);
    const userId = sessions[0].userId;

    const created = await service.createSession({
      userId,
      duration: 30,
      startedAt: new Date(),
      charaCount: 123,
    });
    expect(created).toHaveProperty('id');
    expect(created.userId).toBe(userId);

    const deleted = await service.deleteSession(created.id);
    expect(deleted.id).toBe(created.id);
  });

  it('duration が不正な場合 createSession は BadRequestException を投げる', async () => {
    const sessions = await service.listSessions();
    const userId = sessions[0].userId;
    await expect(
      service.createSession({ userId, duration: 0, startedAt: new Date(), charaCount: 0 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('存在しない id で getSession すると NotFoundException を投げる', async () => {
    await expect(service.getSession('non-existing-id')).rejects.toThrow(NotFoundException);
  });
});