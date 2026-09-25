import { getMenuColumns } from "@/lib/i18n/menu-columns";
import type { MenuColumn } from "@/types";
import fs from "fs";
import path from "path";

export type BookingStatus =
  | "new"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "blocked";

export type BookingSource = "web" | "admin" | "manual";

export type Booking = {
  id: string;
  date: string;
  time: string;
  tableNumber: 1 | 2;
  hours: number;
  name: string;
  phone: string;
  locale: string;
  rate: number;
  total: number;
  status: BookingStatus;
  source: BookingSource;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsMenuItem = {
  id: string;
  name: string;
  price: string;
};

export type CmsMenuColumn = {
  id: string;
  heading: string;
  items: CmsMenuItem[];
  subheading?: string;
  subItems?: string[];
  note?: string;
};

export type AnalyticsEvent = {
  id: string;
  type: "pageview" | "booking" | "scroll_depth" | "cta_click";
  path: string;
  locale?: string;
  value?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  login: string;
  password: string;
  name: string;
  active: boolean;
};

export type AdminSessionRecord = {
  token: string;
  userId: string;
  login: string;
  createdAt: string;
  expiresAt: string;
};

export type CmsDb = {
  bookings: Booking[];
  menu: CmsMenuColumn[];
  analytics: AnalyticsEvent[];
  users: AdminUser[];
  sessions: AdminSessionRecord[];
};

const DATA_DIR =
  process.env.CMS_DATA_DIR ||
  path.join(process.cwd(), "cms-data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function nowIso() {
  return new Date().toISOString();
}

export function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function seedMenu(): CmsMenuColumn[] {
  return getMenuColumns("sk").map((col) => menuColumnFromStatic(col));
}

export function menuColumnFromStatic(col: MenuColumn): CmsMenuColumn {
  return {
    id: uid("cat"),
    heading: col.heading,
    items: col.items.map((item) => ({
      id: uid("item"),
      name: item.name,
      price: item.price || "—",
    })),
    subheading: col.subheading,
    subItems: col.subItems,
    note: col.note,
  };
}

function defaultDb(): CmsDb {
  const login = process.env.ADMIN_LOGIN || "admin";
  const password = process.env.ADMIN_PASSWORD || "12feet2025";
  return {
    bookings: [],
    menu: seedMenu(),
    analytics: [],
    users: [
      {
        id: uid("user"),
        login,
        password,
        name: "12 FEET Admin",
        active: true,
      },
    ],
    sessions: [],
  };
}

type GlobalCms = typeof globalThis & {
  __twelveFeetCmsDb?: CmsDb;
  __twelveFeetCmsMtime?: number;
};

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function readDb(): CmsDb {
  const g = globalThis as GlobalCms;
  if (isBuildPhase()) {
    if (!g.__twelveFeetCmsDb) g.__twelveFeetCmsDb = defaultDb();
    return g.__twelveFeetCmsDb;
  }

  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    const db = defaultDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    g.__twelveFeetCmsDb = db;
    g.__twelveFeetCmsMtime = Date.now();
    return db;
  }

  try {
    const mtime = fs.statSync(DB_PATH).mtimeMs;
    if (g.__twelveFeetCmsDb && g.__twelveFeetCmsMtime === mtime) {
      return g.__twelveFeetCmsDb;
    }

    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as CmsDb;
    const db: CmsDb = {
      bookings: parsed.bookings || [],
      menu: parsed.menu?.length ? parsed.menu : seedMenu(),
      analytics: parsed.analytics || [],
      users: parsed.users?.length ? parsed.users : defaultDb().users,
      sessions: parsed.sessions || [],
    };
    g.__twelveFeetCmsDb = db;
    g.__twelveFeetCmsMtime = mtime;
    return db;
  } catch {
    const db = defaultDb();
    writeDb(db);
    return db;
  }
}

export function writeDb(db: CmsDb) {
  const g = globalThis as GlobalCms;
  if (isBuildPhase()) {
    g.__twelveFeetCmsDb = db;
    return;
  }
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  g.__twelveFeetCmsDb = db;
  try {
    g.__twelveFeetCmsMtime = fs.statSync(DB_PATH).mtimeMs;
  } catch {
    g.__twelveFeetCmsMtime = Date.now();
  }
}

export function updateDb(mutator: (db: CmsDb) => void): CmsDb {
  const db = readDb();
  mutator(db);
  writeDb(db);
  return db;
}

export function saveAdminSession(record: AdminSessionRecord) {
  updateDb((db) => {
    db.sessions = db.sessions.filter((s) => s.token !== record.token);
    db.sessions.push(record);
  });
}

export function loadAdminSession(token: string | undefined) {
  if (!token) return null;
  const db = readDb();
  return db.sessions.find((s) => s.token === token) ?? null;
}

export function deleteAdminSession(token: string | undefined) {
  if (!token) return;
  updateDb((db) => {
    db.sessions = db.sessions.filter((s) => s.token !== token);
  });
}

export function purgeExpiredAdminSessions() {
  const now = Date.now();
  updateDb((db) => {
    db.sessions = db.sessions.filter(
      (s) => new Date(s.expiresAt).getTime() > now,
    );
  });
}

export function cmsMenuAsColumns(db = readDb()): MenuColumn[] {
  return db.menu.map((col) => ({
    heading: col.heading,
    items: col.items.map((item) => ({
      name: item.name,
      price: item.price,
    })),
    subheading: col.subheading,
    subItems: col.subItems,
    note: col.note,
  }));
}

export function createTimestampedBooking(
  input: Omit<Booking, "id" | "createdAt" | "updatedAt">,
): Booking {
  const stamp = nowIso();
  return {
    ...input,
    id: uid("bk"),
    createdAt: stamp,
    updatedAt: stamp,
  };
}
