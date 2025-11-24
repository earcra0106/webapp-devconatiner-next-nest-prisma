import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { NoteService } from './note.service.js';
import type { CreateNoteDto } from './dto/create-note.dto.js';
import type { UpdateNoteDto } from './dto/update-note.dto.js';

@Controller('notes')
export class NoteController {
  constructor(private readonly service: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateNoteDto) {
    return this.service.createNote(dto);
  }

  @Get()
  async findAll() {
    return this.service.listNotes();
  }

  @UseGuards(JwtAuthGuard)
  @Get('author/:authorId')
  async findByAuthor(@Param('authorId') authorId: string) {
    return this.service.listNotesByAuthor(authorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.getNote(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.service.updateNote(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.deleteNote(id);
  }
}