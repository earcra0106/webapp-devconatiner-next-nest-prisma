import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PomodoroNoteStatModule } from './pomodoro-note-stat.module';
import { PomodoroNoteStatService } from './pomodoro-note-stat.service';
import { NoteService } from '../note/note.service';
import { PomodoroSessionService } from '../pomodoro-session/pomodoro-session.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PomodoroNoteStatService (integration)', () => {
  let moduleRef: TestingModule;
  let service: PomodoroNoteStatService;
  let noteService: NoteService;
  let sessionService: PomodoroSessionService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PomodoroNoteStatModule],
    }).compile();

    service = moduleRef.get<PomodoroNoteStatService>(PomodoroNoteStatService);
    noteService = moduleRef.get<NoteService>(NoteService);
    sessionService = moduleRef.get<PomodoroSessionService>(PomodoroSessionService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('listStats でシードの統計を含む配列が返る', async () => {
    const stats = await service.listStats();
    expect(Array.isArray(stats)).toBe(true);
    // seed では少なくとも 2 件の pomodoro note stat が作成されている想定
    expect(stats.length).toBeGreaterThanOrEqual(2);
  });

  it('listBySession と listByNote でフィルタ取得できる', async () => {
    const sessions = await sessionService.listSessions();
    expect(sessions.length).toBeGreaterThan(0);
    const sessionId = sessions[0].id;
    const statsBySession = await service.listBySession(sessionId);
    expect(Array.isArray(statsBySession)).toBe(true);

    const notes = await noteService.listNotes();
    expect(notes.length).toBeGreaterThan(0);
    const noteId = notes[0].id;
    const statsByNote = await service.listByNote(noteId);
    expect(Array.isArray(statsByNote)).toBe(true);
  });

  it('createStat -> deleteStat の一連動作', async () => {
    // 新しい note を作成して、その note と既存 session を紐づける
    const sessions = await sessionService.listSessions();
    expect(sessions.length).toBeGreaterThan(0);
    const sessionId = sessions[0].id;

    const notes = await noteService.listNotes();
    const authorId = notes[0].authorId;
    const newNote = await noteService.createNote({
      title: `test-note-${Date.now()}`,
      content: 'tmp',
      authorId,
    });

    const created = await service.createStat({
      pomodoroSessionId: sessionId,
      noteId: newNote.id,
      charaCount: 10,
    });
    expect(created).toHaveProperty('pomodoroSessionId');
    expect(created.noteId).toBe(newNote.id);

    const deleted = await service.deleteStat(sessionId, newNote.id);
    expect(deleted.pomodoroSessionId).toBe(sessionId);
    expect(deleted.noteId).toBe(newNote.id);
  });

  it('既存の組み合わせで createStat すると BadRequestException を投げる', async () => {
    // seed に存在する組み合わせを利用して重複作成を試みる
    const stats = await service.listStats();
    expect(stats.length).toBeGreaterThan(0);
    const s = stats[0];
    await expect(
      service.createStat({ pomodoroSessionId: s.pomodoroSessionId, noteId: s.noteId, charaCount: s.charaCount }),
    ).rejects.toThrow(BadRequestException);
  });

  it('存在しない組み合わせで getStat すると NotFoundException を投げる', async () => {
    await expect(service.getStat('non-session', 'non-note')).rejects.toThrow(NotFoundException);
  });
});