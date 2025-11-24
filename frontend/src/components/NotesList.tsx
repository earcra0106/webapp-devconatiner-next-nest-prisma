"use client";
import React, { useState, useEffect } from 'react';
import type { Note } from '../lib/api';
import NotesSidebar from './NotesSidebar';
import NoteEditor from './NoteEditor';
import { updateNoteRequest } from '../lib/api';

type Props = {
  userEmail: string | null;
  notes: Note[];
  loading: boolean;
  token?: string | null;
  onRefresh: () => void;
  onLogout: () => void;
};

export default function NotesList({ userEmail, notes, loading, token, onRefresh, onLogout }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // lift editable fields to parent so parent can save
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);

  // perform save using current selectedId/title/content
  const doSave = async (forceId?: string | null) => {
    const id = forceId ?? selectedId;
    if (!id) return;
    try {
      await updateNoteRequest(id, { title, content }, token);
      setSaved(true);
      onRefresh();
    } catch (e) {
      console.error('save failed', e);
    }
  };

  // initialize selection to newest note when notes change and nothing selected
  useEffect(() => {
    // if the currently selectedId no longer exists (e.g. deleted), pick newest
    if (selectedId) {
      const exists = notes.find((n) => n.id === selectedId);
      if (!exists) {
        if (!notes || notes.length === 0) {
          setSelectedId(null);
          setTitle('');
          setContent('');
          return;
        }
        const sorted = [...notes].sort((a, b) => b.id.localeCompare(a.id));
        const first = sorted[0];
        setSelectedId(first.id);
        setTitle(first.title ?? '');
        setContent('');
      }
      return;
    }

    if (!notes || notes.length === 0) {
      setTitle('');
      setContent('');
      return;
    }
    const sorted = [...notes].sort((a, b) => b.id.localeCompare(a.id));
    const first = sorted[0];
    setSelectedId(first.id);
    setTitle(first.title ?? '');
    setContent('');
  }, [notes]);

  return (
    <div className="flex gap-0">
      <NotesSidebar userEmail={userEmail} notes={notes} loading={loading} selectedId={selectedId} token={token} onRequestSelect={async (id) => {
        // ノートを切り替える前にセーブ
        if (!saved) {
            await doSave();
        }
        setSelectedId(id);
      }} onRefresh={onRefresh} onLogout={onLogout} />
      <section className="flex-1 p-4" style={{ minHeight: '60vh' }}>
        <NoteEditor token={token} selectedId={selectedId} initialTitle={notes.find((n) => n.id === selectedId)?.title} title={title} setTitle={setTitle} content={content} setContent={setContent} saved={saved} setSaved={setSaved} onSave={doSave} />
      </section>
    </div>
  );
}
