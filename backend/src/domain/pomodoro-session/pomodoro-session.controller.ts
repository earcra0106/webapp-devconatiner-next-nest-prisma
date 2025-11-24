import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PomodoroSessionService } from './pomodoro-session.service.js';
import type { CreatePomodoroSessionDto } from './dto/create-pomodoro-session.dto.js';
import type { UpdatePomodoroSessionDto } from './dto/update-pomodoro-session.dto.js';

@Controller('pomodoro-sessions')
export class PomodoroSessionController {
  constructor(private readonly service: PomodoroSessionService) {}

  @Post()
  async create(@Body() dto: CreatePomodoroSessionDto) {
    return this.service.createSession(dto);
  }

  @Get()
  async findAll() {
    return this.service.listSessions();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.service.listSessionsByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.getSession(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePomodoroSessionDto) {
    return this.service.updateSession(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.deleteSession(id);
  }
}