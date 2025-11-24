import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteRepository } from './note.repository.js';
import type { CreateNoteDto } from './dto/create-note.dto.js';
import type { UpdateNoteDto } from './dto/update-note.dto.js';
import type { Note } from '../../../generated/prisma/client.js';

@Injectable()
export class NoteService {
  constructor(private readonly repo: NoteRepository) {}

  async createNote(dto: CreateNoteDto): Promise<Note> {
    const payload = {
      title: dto.title ?? 'Untitled',
      content: dto.content,
      authorId: dto.authorId,
    };
    return this.repo.create(payload);
  }

  async listNotes(): Promise<Note[]> {
    return this.repo.findAll();
  }

  async listNotesByAuthor(authorId: string): Promise<Note[]> {
    return this.repo.findByAuthorId(authorId);
  }

  async getNote(id: string): Promise<Note> {
    const note = await this.repo.findById(id);
    if (!note) throw new NotFoundException('note not found');
    return note;
  }

  async updateNote(id: string, dto: UpdateNoteDto): Promise<Note> {
    await this.getNote(id);
    return this.repo.update(id, dto);
  }

  async deleteNote(id: string): Promise<Note> {
    await this.getNote(id);
    return this.repo.delete(id);
  }
}