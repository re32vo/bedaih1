import { createClient } from "@supabase/supabase-js";

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  details?: Record<string, unknown>;
  timestamp: string;
};

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

type AuditRow = {
  id: string;
  user_email: string;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
};

function normalizeAuditRow(row: AuditRow): AuditEntry {
  return {
    id: String(row.id),
    actor: row.user_email || "system",
    action: row.action,
    details: row.details || undefined,
    timestamp: row.created_at,
  };
}

const memoryAudit: AuditEntry[] = [];

function pushMemoryAudit(entry: AuditEntry) {
  memoryAudit.unshift(entry);
  if (memoryAudit.length > 500) {
    memoryAudit.length = 500;
  }
}

export function logAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp"> & { timestamp?: string }) {
  const newEntry: AuditEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    actor: entry.actor,
    action: entry.action,
    details: entry.details,
  };

  pushMemoryAudit(newEntry);

  if (supabase) {
    void supabase.from("audit_log").insert({
      action: newEntry.action,
      user_email: newEntry.actor,
      details: newEntry.details || {},
      created_at: newEntry.timestamp,
    });
  }

  return newEntry;
}

export async function getAuditEntries(limit = 100): Promise<AuditEntry[]> {
  const bounded = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 5000)) : 100;

  if (!supabase) {
    return memoryAudit.slice(0, bounded);
  }

  const { data, error } = await supabase
    .from("audit_log")
    .select("id,user_email,action,details,created_at")
    .order("created_at", { ascending: false })
    .limit(bounded);

  if (error || !data) {
    return memoryAudit.slice(0, bounded);
  }

  return (data as AuditRow[]).map(normalizeAuditRow);
}
