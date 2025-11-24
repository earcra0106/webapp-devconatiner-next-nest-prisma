import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PomodoroNoteStatService } from './pomodoro-note-stat.service.js';
import type { CreatePomodoroNoteStatDto } from './dto/create-pomodoro-note-stat.dto.js';
import type { UpdatePomodoroNoteStatDto } from './dto/update-pomodoro-note-stat.dto.js';

@Controller('pomodoro-note-stats')
export class PomodoroNoteStatController {
  constructor(private readonly service: PomodoroNoteStatService) {}

  @Post()
  async create(@Body() dto: CreatePomodoroNoteStatDto) {
    return this.service.createStat(dto);
  }

  @Get()
  async findAll() {
    return this.service.listStats();
  }

  @Get('session/:sessionId')
  async findBySession(@Param('sessionId') sessionId: string) {
    return this.service.listBySession(sessionId);
  }

  @Get('note/:noteId')
  async findByNote(@Param('noteId') noteId: string) {
    return this.service.listByNote(noteId);
  }

  @Get(':sessionId/:noteId')
  async findOne(@Param('sessionId') sessionId: string, @Param('noteId') noteId: string) {
    return this.service.getStat(sessionId, noteId);
  }

  @Put(':sessionId/:noteId')
  async update(
    @Param('sessionId') sessionId: string,
    @Param('noteId') noteId: string,
    @Body() dto: UpdatePomodoroNoteStatDto,
  ) {
    return this.service.updateStat(sessionId, noteId, dto);
  }

  @Delete(':sessionId/:noteId')
  async remove(@Param('sessionId') sessionId: string, @Param('noteId') noteId: string) {
    return this.service.deleteStat(sessionId, noteId);
  }
}