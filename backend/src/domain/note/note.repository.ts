import { Injectable } from '@nestjs/common';
import { prisma } from '../../../lib/prisma.js';
import type { Note } from '../../../generated/prisma/client.js';
import type { CreateNoteDto } from './dto/create-note.dto.js';
import type { UpdateNoteDto } from './dto/update-note.dto.js';

@Injectable()
export class NoteRepository {
  async create(data: CreateNoteDto): Promise<Note> {
    return prisma.note.create({
      data,
    });
  }

  async findAll(): Promise<Note[]> {
    return prisma.note.findMany({
      include: { author: true },
    });
  }

  async findById(id: string): Promise<Note | null> {
    return prisma.note.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async findByAuthorId(authorId: string): Promise<Note[]> {
    return prisma.note.findMany({
      where: { authorId },
      include: { author: true },
    });
  }

  async findTitlesByAuthorId(authorId: string): Promise<Pick<Note, 'id' | 'title'>[]> {
    return prisma.note.findMany({
      where: { authorId },
      select: { id: true, title: true },
      orderBy: { id: 'desc' },
    });
  }

  async findContentById(id: string): Promise<Pick<Note, 'id' | 'content'> | null> {
    return prisma.note.findUnique({
      where: { id },
      select: { id: true, content: true },
    });
  }

  async update(id: string, data: UpdateNoteDto): Promise<Note> {
    return prisma.note.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Note> {
    return prisma.note.delete({
      where: { id },
    });
  }
}