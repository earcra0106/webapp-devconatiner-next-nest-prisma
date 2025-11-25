"use client";
import { useEffect, useState, useRef, FormEvent } from 'react';
import Image from 'next/image';
import LoginForm from '../components/LoginForm';
import NotesList from '../components/NotesList';
import PomodoroTimer from '../components/PomodoroTimer';
import { loginRequest, fetchNoteTitlesRequest, Note } from '../lib/api';
import { decodeJwt } from '../lib/jwt';

export default function Home() {
  const userIdRef = useRef<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ブラウザで保持したトークンを利用する
  useEffect(() => {
    try {
      const t = localStorage.getItem('accessToken');
      if (t) setToken(t);
    } catch {
      // ignore
    }
  }, []);

  // トークンの検証
  useEffect(() => {
    if (token) {
      const payload = decodeJwt(token);
      if (payload && payload.email) {
        setUserEmail(payload.email);
      } else {
        setUserEmail(null);
      }
      userIdRef.current = payload && payload.sub ? payload.sub : null;
      // トークンで取得したユーザIDからノート一覧を取得
      handleFetchNotes(userIdRef.current, token);
    } else {
      setNotes([]);
      setUserEmail(null);
    }
  }, [token]);

  async function handleFetchNotes(userId: string | null, authToken?: string | null) {
    setLoading(true);
    setError(null);
    try {
      let data = [] as Note[];
      if (authToken) {
        // ノートタイトルを取得するAPI
        const titles = await fetchNoteTitlesRequest(userId ?? '', authToken);
        data = titles.map((t) => ({ id: t.id, title: t.title ?? 'Untitled' } as Note));
      }
      // 内容は後から取得するため、ここではタイトルのみをセット
      setNotes(data);
    } catch (e: any) {
      setError('Failed to fetch notes: ' + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  // ログインを実行
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const accessToken = await loginRequest(email, password);
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      setEmail('');
      setPassword('');
    } catch (e: any) {
      setError('Login failed: ' + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  // ログアウト
  function handleLogout() {
    localStorage.removeItem('accessToken');
    setToken(null);
    setNotes([]);
    setUserEmail(null);
  }

  return (
    <>
      {!token ? (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-16 px-6 bg-white dark:bg-black">
          <div className="w-full max-w-2xl">
            <LoginForm
              email={email}
              password={password}
              loading={loading}
              error={error}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
            />
          </div>
        </main>
      </div>
      ) : (
      <div className="flex min-h-screen ite ms-start justify-start bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full flex-col items-stretch justify-start py-12 px-4 bg-white dark:bg-black">
          <div className="w-full">
            <NotesList
              userEmail={userEmail}
              notes={notes}
              loading={loading}
              token={token}
              onRefresh={() => handleFetchNotes(userIdRef.current, token)}
              onLogout={handleLogout}
            />
          </div>
        </main>
        
        <PomodoroTimer workMinutes={25} breakMinutes={5} />
      </div>
      )}
    </>
  );
}