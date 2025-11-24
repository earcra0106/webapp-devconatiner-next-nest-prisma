import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { NoteService } from './note.service.js';
import type { CreateNoteDto } from './dto/create-note.dto.js';
import type { UpdateNoteDto } from './dto/update-note.dto.js';

@Controller('notes')
export class NoteController {
  constructor(private readonly service: NoteService) {}

  @Post()
  async create(@Body() dto: CreateNoteDto) {
    return this.service.createNote(dto);
  }

  @Get()
  async findAll() {
    return this.service.listNotes();
  }

  @Get('author/:authorId')
  async findByAuthor(@Param('authorId') authorId: string) {
    return this.service.listNotesByAuthor(authorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.getNote(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.service.updateNote(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.deleteNote(id);
  }
}