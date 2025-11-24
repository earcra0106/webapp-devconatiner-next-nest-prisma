import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PomodoroSessionRepository } from './pomodoro-session.repository.js';
import { UserService } from '../user/user.service.js';
import type { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto.js';
import type { UpdatePomodoroSessionDto } from './dto/update-pomodoro-session.dto.js';
import type { PomodoroSession } from '../../../generated/prisma/client.js';

@Injectable()
export class PomodoroSessionService {
  constructor(
    private readonly repo: PomodoroSessionRepository,
    private readonly userService: UserService,
  ) {}

  async createSession(dto: CreatePomodoroSessionDto): Promise<PomodoroSession> {
    // ユーザー存在確認（UserService を利用）
    await this.userService.getUser(dto.userId);

    if (!dto.duration || dto.duration <= 0) {
      throw new BadRequestException('duration must be a positive number');
    }

    return this.repo.create(dto);
  }

  async listSessions(): Promise<PomodoroSession[]> {
    return this.repo.findAll();
  }

  async listSessionsByUser(userId: string): Promise<PomodoroSession[]> {
    // 存在チェック
    await this.userService.getUser(userId);
    return this.repo.findByUserId(userId);
  }

  async getSession(id: string): Promise<PomodoroSession> {
    const s = await this.repo.findById(id);
    if (!s) throw new NotFoundException('pomodoro session not found');
    return s;
  }

  async updateSession(id: string, dto: UpdatePomodoroSessionDto): Promise<PomodoroSession> {
    await this.getSession(id);
    return this.repo.update(id, dto);
  }

  async deleteSession(id: string): Promise<PomodoroSession> {
    await this.getSession(id);
    return this.repo.delete(id);
  }
}