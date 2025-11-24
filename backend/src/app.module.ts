import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './domain/user/user.module.js';
import { NoteModule } from './domain/note/note.module.js';
import { PomodoroSessionModule } from './domain/pomodoro-session/pomodoro-session.module.js';
import { PomodoroNoteStatModule } from './domain/pomodoro-note-stat/pomodoro-note-stat.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [UserModule, NoteModule, PomodoroSessionModule, PomodoroNoteStatModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
