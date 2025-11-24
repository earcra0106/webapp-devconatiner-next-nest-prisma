import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NoteModule } from './note.module';
import { NoteService } from './note.service';
import { NotFoundException } from '@nestjs/common';

describe('NoteService (integration)', () => {
  let moduleRef: TestingModule;
  let service: NoteService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [NoteModule],
    }).compile();

    service = moduleRef.get<NoteService>(NoteService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('listNotes でシードノートを含む配列が返る', async () => {
    const notes = await service.listNotes();
    const titles = notes.map((n) => n.title);
    expect(Array.isArray(notes)).toBe(true);
    // シードで作成されるタイトルを検証
    expect(titles).toEqual(expect.arrayContaining(['note1', 'ノート1']));
  });

  it('listNotes -> getNote で取得できる', async () => {
    const notes = await service.listNotes();
    expect(notes.length).toBeGreaterThan(0);
    const note = await service.getNote(notes[0].id);
    expect(note.id).toBe(notes[0].id);
  });

  it('createNote -> deleteNote の一連動作', async () => {
    // 既存ノートから authorId を取得して新規作成に利用
    const notes = await service.listNotes();
    expect(notes.length).toBeGreaterThan(0);
    const authorId = notes[0].authorId;

    const created = await service.createNote({
      title: `test-note-${Date.now()}`,
      content: 'test content',
      authorId,
    });
    expect(created).toHaveProperty('id');
    expect(created.authorId).toBe(authorId);

    const deleted = await service.deleteNote(created.id);
    expect(deleted.id).toBe(created.id);
  });

  it('存在しない id で getNote すると NotFoundException を投げる', async () => {
    await expect(service.getNote('non-existing-id')).rejects.toThrow(NotFoundException);
  });
});