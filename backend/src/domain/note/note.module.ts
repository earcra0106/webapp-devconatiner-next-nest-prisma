import { Module } from '@nestjs/common';
import { NoteController } from './note.controller.js';
import { NoteService } from './note.service.js';
import { NoteRepository } from './note.repository.js';

@Module({
  controllers: [NoteController],
  providers: [NoteService, NoteRepository],
  exports: [NoteService],
})
export class NoteModule {}