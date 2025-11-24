"use client";
import { useEffect, useState, useRef } from 'react';
import { fetchNoteContentRequest } from '../lib/api';

type Props = {
  token?: string | null;
  selectedId: string | null;
  initialTitle?: string;
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  saved: boolean;
  setSaved: (v: boolean) => void;
  onSave: (forceId?: string | null) => Promise<void>;
};

export default function NoteEditor({ token, selectedId, initialTitle, title, setTitle, content, setContent, saved, setSaved, onSave }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  // セーブを実行するまでのタイマーを管理するための変数
  const saveTimerRef = useRef<number | null>(null);

  // フェッチ中はユーザーの編集を無視するためのフラグ
  const isPopulatingRef = useRef(false);

  // ユーザによる編集を検知するためのフラグ
  const userEditedRef = useRef(false);

  // fetch content when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setTitle('');
      setContent('');
      setSaved(true);
      return;
    }

    isPopulatingRef.current = true;
    setTitle(initialTitle ?? '');
    setContent('');

    (async () => {
      try {
        const d = await fetchNoteContentRequest(selectedId, token);
        setContent(d.content ?? '');
        setSaved(true);
        userEditedRef.current = false;
      } catch (e) {
        console.error('failed fetching content', e);
      } finally {
        window.setTimeout(() => {
          isPopulatingRef.current = false;
        }, 0);
      }
    })();
  }, [selectedId]);

  // タイトルか内容が編集されたときの処理
  useEffect(() => {
    // フェッチによって変更された場合は終了
    if (isPopulatingRef.current) return;

    // ユーザによる変更でない場合は終了
    if (!userEditedRef.current) return;

    // 未セーブに更新
    if (saved) setSaved(false);

    // オートセーブ実行タイマーをセット
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    saveTimerRef.current = window.setTimeout(() => void onSave(), 3000);
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [title, content]);

  // セーブの実行
  const doSaveLocal = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setSaved(true);
      userEditedRef.current = false;
    } catch (e) {
      console.error('save failed', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Ctrl+S handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (saveTimerRef.current) {
          window.clearTimeout(saveTimerRef.current);
          saveTimerRef.current = null;
        }
        void doSaveLocal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, title, content, token]);

  if (!selectedId) {
    return <div className="text-sm text-zinc-500">No note selected</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center gap-4 px-16">
        <input
            value={title}
            onChange={(e) => {
            userEditedRef.current = true;
            setTitle(e.target.value);
            }}
            placeholder="title"
            className="text-2xl font-semibold border-b pb-2 mb-4 focus:outline-none"
        />
        <div className="mt-3 text-xs text-zinc-500">{saved ? 'saved' : 'saving... (Ctrl+S)'}</div>
      </div>
      <textarea
        value={content}
        onChange={(e) => {
          userEditedRef.current = true;
          setContent(e.target.value);
        }}
        placeholder="Write your note here..."
        className="flex-1 resize-none w-full text-base leading-relaxed focus:outline-none px-16"
      />
    </div>
  );
}
