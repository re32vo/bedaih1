import fs from "fs";
import path from "path";

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  details?: Record<string, unknown>;
  timestamp: string;
};

type AuditDB = { entries: AuditEntry[] };

const filePath = path.join(process.cwd(), "server", "audit-log.json");

function ensureFile() {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ entries: [] }, null, 2), "utf8");
  }
}

function readDb(): AuditDB {
  ensureFile();
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as AuditDB;
}

function writeDb(db: AuditDB) {
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf8");
}

export function logAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp"> & { timestamp?: string }) {
  const db = readDb();
  const newEntry: AuditEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    actor: entry.actor,
    action: entry.action,
    details: entry.details,
  };
  db.entries.unshift(newEntry); // latest first
  // keep log reasonable
  if (db.entries.length > 500) db.entries = db.entries.slice(0, 500);
  writeDb(db);
  return newEntry;
}

export function getAuditEntries(limit = 100): AuditEntry[] {
  const db = readDb();
  return db.entries.slice(0, limit);
}
