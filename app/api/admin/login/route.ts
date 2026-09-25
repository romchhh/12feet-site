export const runtime = "nodejs";

import {
  ADMIN_COOKIE,
  authenticateUser,
  createSession,
  destroySession,
  getRequestSession,
} from "@/lib/cms/session";
import { readDb } from "@/lib/cms/store";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function userPayload(login: string) {
  const db = readDb();
  const user = db.users.find((entry) => entry.login === login);
  return {
    login,
    name: user?.name || "12 FEET Admin",
  };
}

export async function GET() {
  const session = await getRequestSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: userPayload(session.login) });
}

export async function POST(request: Request) {
  let body: { login?: string; password?: string; remember?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const login = typeof body.login === "string" ? body.login.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const remember = Boolean(body.remember);

  if (!login || !password) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const user = authenticateUser(login, password);
  if (!user) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const { token, maxAge } = createSession(user.id, user.login, remember);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  return NextResponse.json({ ok: true, user: userPayload(user.login) });
}

export async function DELETE() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  destroySession(token);
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
