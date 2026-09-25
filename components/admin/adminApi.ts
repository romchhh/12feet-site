export type AdminApiError = {
  ok: false;
  error: string;
  message?: string;
};

export class AdminRequestError extends Error {
  status: number;
  body: AdminApiError | null;

  constructor(status: number, body: AdminApiError | null, message?: string) {
    super(message || body?.error || `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(path, {
    ...init,
    headers,
    credentials: "same-origin",
  });

  const data = await parseJson<T | AdminApiError>(res);

  if (!res.ok) {
    let apiError: AdminApiError | null = null;
    if (data && typeof data === "object" && "ok" in data && (data as AdminApiError).ok === false) {
      apiError = data as AdminApiError;
    }
    throw new AdminRequestError(res.status, apiError);
  }

  return data as T;
}
