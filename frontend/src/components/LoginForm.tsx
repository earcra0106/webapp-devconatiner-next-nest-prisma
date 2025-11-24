"use client";
import {FormEvent} from 'react';

type Props = {
  email: string;
  password: string;
  loading: boolean;
  error?: string | null;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
};

export default function LoginForm({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  return (
    <>
        <h1 className="text-2xl font-semibold mb-6">Tomato Notes</h1>
        <form onSubmit={onSubmit} className="space-y-4 p-6 border rounded bg-zinc-50">
            <h2 className="text-lg font-medium">Login</h2>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div>
            <label className="block text-sm">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
            />
            </div>
            <div>
            <label className="block text-sm">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
            />
            </div>
            <div className="flex items-center gap-2">
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-foreground text-background rounded disabled:opacity-60"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <span className="text-sm text-zinc-500">シードユーザー: alice@prisma.io / alicepassword</span>
            </div>
        </form>
    </>
  );
}
