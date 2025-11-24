"use client";
import React from 'react';
import type { Note } from '../lib/api';
import { deleteNoteRequest, createNoteRequest } from '../lib/api';
import { decodeJwt } from '../lib/jwt';
import MaterialSymbolsDeleteOutline from './icons/MaterialSymbolsDeleteOutline';

type Props = {
  userEmail: string | null;
  notes: Note[];
  loading: boolean;
  selectedId: string | null;
  onRequestSelect: (id: string) => Promise<void>;
  token?: string | null;
  onRefresh: () => void;
  onLogout: () => void;
};

export default function NotesSidebar({ userEmail, notes, loading, selectedId, onRequestSelect, token, onRefresh, onLogout }: Props) {
  return (
    <aside className="w-64 p-3 flex flex-col min-h-screen" style={{ minHeight: '60vh' }}>
      <div className="mb-3">
        <h1 className="text-2xl font-semibold mb-6">Tomato Notes</h1>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-zinc-700">Signed in as</div>
          <div className="text-sm text-zinc-900 font-medium">{userEmail}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={onLogout} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm hover:bg-zinc-100">
          Logout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto mt-3">
        <button
          onClick={async () => {
            if (!token) {
              window.alert('No auth token');
              return;
            }
            const payload = decodeJwt(token as string);
            const authorId = payload?.sub as string | undefined;
            if (!authorId) {
              window.alert('Unable to determine user id');
              return;
            }
            try {
              await createNoteRequest(authorId, token);
              onRefresh();
            } catch (err) {
              console.error('failed to create', err);
              window.alert('Failed to create note');
            }
          }}
          className="flex-1 w-full px-3 py-2 pr-10 text-gray-400 hover:bg-zinc-100 hover:text-black"
        >
          + new note
        </button>
        <ul>
          {([...notes].sort((a, b) => b.id.localeCompare(a.id))).map((n) => (
          <li key={n.id} className="relative group">
              <button
              onClick={() => onRequestSelect(n.id)}
              className={`flex-1 w-full text-left px-3 py-2 pr-10 ${selectedId === n.id ? 'bg-blue-100' : 'hover:bg-zinc-100'}`}
              >
              <div className="font-medium text-sm truncate">{n.title || 'Untitled'}</div>
              </button>
              <button
              onClick={async (e) => {
                  e.stopPropagation();
                  const ok = window.confirm('Delete this note?');
                  if (!ok) return;
                  try {
                  await deleteNoteRequest(n.id, token);
                  onRefresh();
                  } catch (err) {
                  console.error('failed to delete', err);
                  window.alert('Failed to delete note');
                  }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-xs text-gray-600 hover:bg-zinc-100 rounded invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="delete note"
              >
              <MaterialSymbolsDeleteOutline/>
              </button>
          </li>
          ))}
        </ul>
      </div>
      
    </aside>
  );
}
