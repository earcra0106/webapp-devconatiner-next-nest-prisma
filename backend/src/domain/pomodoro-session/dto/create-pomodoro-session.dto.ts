export interface CreatePomodoroSessionDto {
  userId: string;
  duration: number; // minutes
  startedAt?: Date | string;
  endedAt?: Date | string | null;
  charaCount?: number;
  // 任意でノートごとの文字数を同時作成する場合
  pomodoroNoteStats?: { noteId: string; charaCount?: number }[];
}