export interface UpdatePomodoroSessionDto {
  duration?: number;
  startedAt?: Date | string;
  endedAt?: Date | string | null;
  charaCount?: number;
  // 更新でノート統計は想定外（必要なら拡張）
}