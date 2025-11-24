export interface CreateNoteDto {
  title?: string;
  content?: string | null;
  authorId: string;
}