import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PomodoroNoteStatRepository } from './pomodoro-note-stat.repository.js';
import { NoteService } from '../note/note.service.js';
import { PomodoroSessionService } from '../pomodoro-session/pomodoro-session.service.js';
import type { CreatePomodoroNoteStatDto } from './dto/create-pomodoro-note-stat.dto.js';
import type { UpdatePomodoroNoteStatDto } from './dto/update-pomodoro-note-stat.dto.js';
import type { PomodoroNoteStat } from '../../../generated/prisma/client.js';

@Injectable()
export class PomodoroNoteStatService {
  constructor(
    private readonly repo: PomodoroNoteStatRepository,
    private readonly noteService: NoteService,
    private readonly pomodoroSessionService: PomodoroSessionService,
  ) {}

  async createStat(dto: CreatePomodoroNoteStatDto): Promise<PomodoroNoteStat> {
    // 存在チェック
    await this.pomodoroSessionService.getSession(dto.pomodoroSessionId);
    await this.noteService.getNote(dto.noteId);

    // 重複チェック
    const existing = await this.repo.findById(dto.pomodoroSessionId, dto.noteId);
    if (existing) {
      throw new BadRequestException('pomodoro note stat already exists for this session and note');
    }

    return this.repo.create(dto);
  }

  async listStats(): Promise<PomodoroNoteStat[]> {
    return this.repo.findAll();
  }

  async listBySession(pomodoroSessionId: string): Promise<PomodoroNoteStat[]> {
    // 存在チェック
    await this.pomodoroSessionService.getSession(pomodoroSessionId);
    return this.repo.findBySessionId(pomodoroSessionId);
  }

  async listByNote(noteId: string): Promise<PomodoroNoteStat[]> {
    // 存在チェック
    await this.noteService.getNote(noteId);
    return this.repo.findByNoteId(noteId);
  }

  async getStat(pomodoroSessionId: string, noteId: string): Promise<PomodoroNoteStat> {
    const s = await this.repo.findById(pomodoroSessionId, noteId);
    if (!s) throw new NotFoundException('pomodoro note stat not found');
    return s;
  }

  async updateStat(pomodoroSessionId: string, noteId: string, dto: UpdatePomodoroNoteStatDto): Promise<PomodoroNoteStat> {
    await this.getStat(pomodoroSessionId, noteId);
    return this.repo.update(pomodoroSessionId, noteId, dto);
  }

  async deleteStat(pomodoroSessionId: string, noteId: string): Promise<PomodoroNoteStat> {
    await this.getStat(pomodoroSessionId, noteId);
    return this.repo.delete(pomodoroSessionId, noteId);
  }
}