import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { NoteRepository } from '../../domain/note/note.repository.js';

@Controller('usecase/notes')
export class NoteContentController {
  constructor(private readonly repo: NoteRepository) {}

  // Returns only { id, content } for the given note id.
  @UseGuards(JwtAuthGuard)
  @Get(':id/content')
  async getContent(@Param('id') id: string) {
    const r = await this.repo.findContentById(id);
    if (!r) throw new NotFoundException('note not found');
    return r;
  }
}
