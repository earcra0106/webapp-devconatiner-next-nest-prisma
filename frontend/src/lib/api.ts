const API = process.env.NEXT_PUBLIC_API_URL_CLIENT ?? "http://localhost:3000";

export type Note = {
  id: string;
  title: string;
  content?: string | null;
  authorId: string;
  author?: { id: string; email?: string | null; name?: string | null };
};

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let serverMsg = '';
    try {
      const json = JSON.parse(text || '{}');
      serverMsg = json.message || text;
    } catch {
      serverMsg = text;
    }
    throw new Error(serverMsg || `login failed (${res.status})`);
  }

  const body = await res.json();
  if (!body.accessToken) throw new Error('no access token returned');
  return body.accessToken as string;
}

export async function fetchNotesRequest(token?: string | null) {
  const res = await fetch(`${API}/notes`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`notes fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as Note[];
  return data;
}

export async function fetchNoteTitlesRequest(authorId: string, token?: string | null) {
  const res = await fetch(`${API}/usecase/notes/titles/${authorId}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`notes titles fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as Array<{ id: string; title?: string | null }>;
  return data;
}

export async function fetchNoteContentRequest(noteId: string, token?: string | null) {
  const res = await fetch(`${API}/usecase/notes/${noteId}/content`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`note content fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as { id: string; content?: string | null };
  return data;
}

export async function updateNoteRequest(id: string, data: { title?: string; content?: string | null }, token?: string | null) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    // HeadersInit accepts Headers | string[][] | Record<string, string>
    // cast to Record<string,string> to assign safely
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}/notes/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `update failed: ${res.status}`);
  }

  return (await res.json()) as Note;
}

export async function deleteNoteRequest(id: string, token?: string | null) {
  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}/notes/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `delete failed: ${res.status}`);
  }
  return await res.json();
}

export async function createNoteRequest(authorId: string, token?: string | null) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const body = { title: 'Untitled', content: '', authorId };

  const res = await fetch(`${API}/notes`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `create failed: ${res.status}`);
  }
  return (await res.json()) as Note;
}

export default { loginRequest, fetchNotesRequest, fetchNoteTitlesRequest, fetchNoteContentRequest, updateNoteRequest, deleteNoteRequest, createNoteRequest };
