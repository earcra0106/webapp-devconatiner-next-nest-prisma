import { Module } from '@nestjs/common';
import { PomodoroSessionController } from './pomodoro-session.controller.js';
import { PomodoroSessionService } from './pomodoro-session.service.js';
import { PomodoroSessionRepository } from './pomodoro-session.repository.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [UserModule],
  controllers: [PomodoroSessionController],
  providers: [PomodoroSessionService, PomodoroSessionRepository],
  exports: [PomodoroSessionService],
})
export class PomodoroSessionModule {}