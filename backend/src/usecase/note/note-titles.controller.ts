import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { NoteRepository } from '../../domain/note/note.repository.js';

@Controller('usecase/notes')
export class NoteTitlesController {
  constructor(private readonly repo: NoteRepository) {}

  // Returns only { id, title } for the given author.
//   @UseGuards(JwtAuthGuard)
  @Get('titles/:authorId')
  async listTitles(@Param('authorId') authorId: string) {
    return this.repo.findTitlesByAuthorId(authorId);
  }
}
