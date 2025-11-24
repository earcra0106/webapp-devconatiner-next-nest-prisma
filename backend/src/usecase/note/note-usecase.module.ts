import { Module } from '@nestjs/common';
import { NoteRepository } from '../../domain/note/note.repository.js';
import { NoteTitlesController } from './note-titles.controller.js';
import { NoteContentController } from './note-content.controller.js';

/*
  Usecase module
  - Purpose: expose HTTP APIs tailored to frontend use-cases (lightweight payloads)
  - Structure: controllers live here and depend on the domain repository for data access.
  - Rationale: keep domain services/repositories focused on business logic and DB access,
    while the usecase layer composes small, client-specific endpoints (e.g. titles-only).
*/
@Module({
  controllers: [NoteTitlesController, NoteContentController],
  providers: [NoteRepository],
})
export class NoteUsecaseModule {}
