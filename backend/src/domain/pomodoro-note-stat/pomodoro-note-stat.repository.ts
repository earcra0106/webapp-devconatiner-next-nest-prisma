import { Injectable } from '@nestjs/common';
import { prisma } from '../../../lib/prisma.js';
import type { PomodoroNoteStat } from '../../../generated/prisma/client.js';
import type { CreatePomodoroNoteStatDto } from './dto/create-pomodoro-note-stat.dto.js';
import type { UpdatePomodoroNoteStatDto } from './dto/update-pomodoro-note-stat.dto.js';

@Injectable()
export class PomodoroNoteStatRepository {
  async create(data: CreatePomodoroNoteStatDto): Promise<PomodoroNoteStat> {
    return prisma.pomodoroNoteStat.create({
      data: {
        pomodoroSessionId: data.pomodoroSessionId,
        noteId: data.noteId,
        charaCount: data.charaCount ?? 0,
      },
      include: { pomodoroSession: true, note: true },
    });
  }

  async findAll(): Promise<PomodoroNoteStat[]> {
    return prisma.pomodoroNoteStat.findMany({
      include: { pomodoroSession: true, note: true },
    });
  }

  async findById(pomodoroSessionId: string, noteId: string): Promise<PomodoroNoteStat | null> {
    return prisma.pomodoroNoteStat.findUnique({
      where: { pomodoroSessionId_noteId: { pomodoroSessionId, noteId } },
      include: { pomodoroSession: true, note: true },
    });
  }

  async findBySessionId(pomodoroSessionId: string): Promise<PomodoroNoteStat[]> {
    return prisma.pomodoroNoteStat.findMany({
      where: { pomodoroSessionId },
      include: { pomodoroSession: true, note: true },
    });
  }

  async findByNoteId(noteId: string): Promise<PomodoroNoteStat[]> {
    return prisma.pomodoroNoteStat.findMany({
      where: { noteId },
      include: { pomodoroSession: true, note: true },
    });
  }

  async update(pomodoroSessionId: string, noteId: string, data: UpdatePomodoroNoteStatDto): Promise<PomodoroNoteStat> {
    return prisma.pomodoroNoteStat.update({
      where: { pomodoroSessionId_noteId: { pomodoroSessionId, noteId } },
      data,
      include: { pomodoroSession: true, note: true },
    });
  }

  async delete(pomodoroSessionId: string, noteId: string): Promise<PomodoroNoteStat> {
    return prisma.pomodoroNoteStat.delete({
      where: { pomodoroSessionId_noteId: { pomodoroSessionId, noteId } },
    });
  }
}