import { Module } from '@nestjs/common';
import { PomodoroNoteStatController } from './pomodoro-note-stat.controller.js';
import { PomodoroNoteStatService } from './pomodoro-note-stat.service.js';
import { PomodoroNoteStatRepository } from './pomodoro-note-stat.repository.js';
import { NoteModule } from '../note/note.module.js';
import { PomodoroSessionModule } from '../pomodoro-session/pomodoro-session.module.js';

@Module({
  imports: [NoteModule, PomodoroSessionModule],
  controllers: [PomodoroNoteStatController],
  providers: [PomodoroNoteStatService, PomodoroNoteStatRepository],
  exports: [PomodoroNoteStatService],
})
export class PomodoroNoteStatModule {}