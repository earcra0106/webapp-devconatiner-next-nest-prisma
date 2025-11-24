import { Injectable } from '@nestjs/common';
import { prisma } from '../../../lib/prisma.js';
import type { PomodoroSession } from '../../../generated/prisma/client.js';
import type { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto.js';
import type { UpdatePomodoroSessionDto } from './dto/update-pomodoro-session.dto.js';

@Injectable()
export class PomodoroSessionRepository {
  async create(data: CreatePomodoroSessionDto): Promise<PomodoroSession> {
    const payload: any = {
      userId: data.userId,
      duration: data.duration,
      startedAt: data.startedAt ? new Date(data.startedAt) : new Date(),
      endedAt: data.endedAt ? new Date(data.endedAt) : null,
      charaCount: data.charaCount ?? 0,
    };

    if (data.pomodoroNoteStats && data.pomodoroNoteStats.length > 0) {
      payload.pomodoroNoteStats = {
        create: data.pomodoroNoteStats.map((s) => ({
          noteId: s.noteId,
          charaCount: s.charaCount ?? 0,
        })),
      };
    }

    return prisma.pomodoroSession.create({
      data: payload,
      include: { pomodoroNoteStats: true },
    });
  }

  async findAll(): Promise<PomodoroSession[]> {
    return prisma.pomodoroSession.findMany({
      include: { pomodoroNoteStats: true, user: true },
    });
  }

  async findById(id: string): Promise<PomodoroSession | null> {
    return prisma.pomodoroSession.findUnique({
      where: { id },
      include: { pomodoroNoteStats: true, user: true },
    });
  }

  async findByUserId(userId: string): Promise<PomodoroSession[]> {
    return prisma.pomodoroSession.findMany({
      where: { userId },
      include: { pomodoroNoteStats: true, user: true },
    });
  }

  async update(id: string, data: UpdatePomodoroSessionDto): Promise<PomodoroSession> {
    const payload: any = { ...data };
    if (data.startedAt) payload.startedAt = new Date(data.startedAt);
    if (data.endedAt !== undefined) payload.endedAt = data.endedAt ? new Date(data.endedAt) : null;
    return prisma.pomodoroSession.update({
      where: { id },
      data: payload,
      include: { pomodoroNoteStats: true, user: true },
    });
  }

  async delete(id: string): Promise<PomodoroSession> {
    return prisma.pomodoroSession.delete({
      where: { id },
    });
  }
}