import { createClient } from "@supabase/supabase-js";

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  details?: Record<string, unknown>;
  timestamp: string;
  eventCategory?: string;
  entityType?: string;
  entityId?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  success?: boolean;
  severity?: "info" | "warning" | "error";
  source?: string;
  requestId?: string;
};

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
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
  event_category?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  actor_role?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  before_data?: Record<string, unknown> | null;
  after_data?: Record<string, unknown> | null;
  success?: boolean | null;
  severity?: "info" | "warning" | "error" | null;
  source?: string | null;
  request_id?: string | null;
};

function normalizeAuditRow(row: AuditRow): AuditEntry {
  return {
    id: String(row.id),
    actor: row.user_email || "system",
    action: row.action,
    details: row.details || undefined,
    timestamp: row.created_at,
    eventCategory: row.event_category || undefined,
    entityType: row.entity_type || undefined,
    entityId: row.entity_id || undefined,
    actorRole: row.actor_role || undefined,
    ipAddress: row.ip_address || undefined,
    userAgent: row.user_agent || undefined,
    beforeData: row.before_data || undefined,
    afterData: row.after_data || undefined,
    success: row.success ?? true,
    severity: row.severity || "info",
    source: row.source || "api",
    requestId: row.request_id || undefined,
  };
}

const memoryAudit: AuditEntry[] = [];
const pendingAuditQueue: AuditEntry[] = [];
let retryTimerStarted = false;

function pushMemoryAudit(entry: AuditEntry) {
  memoryAudit.unshift(entry);
  if (memoryAudit.length > 500) {
    memoryAudit.length = 500;
  }
}

function enqueueRetry(entry: AuditEntry) {
  pendingAuditQueue.push(entry);
  if (pendingAuditQueue.length > 2000) {
    pendingAuditQueue.shift();
  }
}

async function insertToSupabase(entry: AuditEntry) {
  if (!supabase) return true;

  const richRow = {
    action: entry.action,
    user_email: entry.actor,
    details: entry.details || {},
    created_at: entry.timestamp,
    event_category: entry.eventCategory || null,
    entity_type: entry.entityType || null,
    entity_id: entry.entityId || null,
    actor_role: entry.actorRole || null,
    ip_address: entry.ipAddress || null,
    user_agent: entry.userAgent || null,
    before_data: entry.beforeData || null,
    after_data: entry.afterData || null,
    success: entry.success ?? true,
    severity: entry.severity || "info",
    source: entry.source || "api",
    request_id: entry.requestId || null,
  };

  const richInsert = await supabase.from("audit_log").insert(richRow);
  if (!richInsert.error) {
    return true;
  }

  const fallbackInsert = await supabase
    .from("audit_log")
    .insert({
      action: entry.action,
      user_email: entry.actor,
      details: entry.details || {},
      created_at: entry.timestamp,
    });

  return !fallbackInsert.error;
}

async function flushPendingAuditQueue() {
  if (!supabase || pendingAuditQueue.length === 0) return;

  const batch = pendingAuditQueue.splice(0, 50);
  for (const entry of batch) {
    const ok = await insertToSupabase(entry);
    if (!ok) {
      enqueueRetry(entry);
    }
  }
}

function ensureRetryTimer() {
  if (retryTimerStarted) return;
  retryTimerStarted = true;

  setInterval(() => {
    void flushPendingAuditQueue();
  }, 15000);
}

ensureRetryTimer();

export function logAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp"> & { timestamp?: string }) {
  const newEntry: AuditEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    actor: entry.actor,
    action: entry.action,
    details: entry.details,
    eventCategory: entry.eventCategory,
    entityType: entry.entityType,
    entityId: entry.entityId,
    actorRole: entry.actorRole,
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
    beforeData: entry.beforeData,
    afterData: entry.afterData,
    success: entry.success ?? true,
    severity: entry.severity || "info",
    source: entry.source || "api",
    requestId: entry.requestId,
  };

  pushMemoryAudit(newEntry);

  if (supabase) {
    void (async () => {
      try {
        const ok = await insertToSupabase(newEntry);
        if (!ok) {
          enqueueRetry(newEntry);
        }
      } catch (error: any) {
        enqueueRetry(newEntry);
      }
    })();
  }

  return newEntry;
}

export async function getAuditEntries(
  limit = 100,
  filters?: {
    action?: string;
    actor?: string;
    entityType?: string;
    from?: string;
    to?: string;
  }
): Promise<AuditEntry[]> {
  const bounded = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 5000)) : 100;

  const applyFilters = (items: AuditEntry[]) => {
    const action = filters?.action?.trim();
    const actor = filters?.actor?.trim().toLowerCase();
    const entityType = filters?.entityType?.trim().toLowerCase();
    const fromTime = filters?.from ? Date.parse(filters.from) : undefined;
    const toTime = filters?.to ? Date.parse(filters.to) : undefined;

    return items.filter((e) => {
      const t = Date.parse(e.timestamp);
      const actionOk = action ? e.action === action : true;
      const actorOk = actor ? String(e.actor || "").toLowerCase().includes(actor) : true;
      const entityFromDetails = String((e.details as any)?.entityType || "").toLowerCase();
      const entityFromEntry = String(e.entityType || "").toLowerCase();
      const entityOk = entityType ? entityFromEntry === entityType || entityFromDetails === entityType : true;
      const fromOk = fromTime ? t >= fromTime : true;
      const toOk = toTime ? t <= toTime : true;
      return actionOk && actorOk && entityOk && fromOk && toOk;
    });
  };

  if (!supabase) {
    return applyFilters(memoryAudit).slice(0, bounded);
  }

  let query = supabase
    .from("audit_log")
    .select("id,user_email,action,details,created_at,event_category,entity_type,entity_id,actor_role,ip_address,user_agent,before_data,after_data,success,severity,source,request_id")
    .order("created_at", { ascending: false })
    .limit(bounded);

  const actionFilter = filters?.action?.trim();
  const actorFilter = filters?.actor?.trim();
  const entityTypeFilter = filters?.entityType?.trim();
  const fromFilter = filters?.from?.trim();
  const toFilter = filters?.to?.trim();

  if (actionFilter) {
    query = query.eq("action", actionFilter);
  }
  if (actorFilter) {
    query = query.ilike("user_email", `%${actorFilter}%`);
  }
  if (entityTypeFilter) {
    query = query.eq("entity_type", entityTypeFilter);
  }
  if (fromFilter && !Number.isNaN(Date.parse(fromFilter))) {
    query = query.gte("created_at", new Date(fromFilter).toISOString());
  }
  if (toFilter && !Number.isNaN(Date.parse(toFilter))) {
    query = query.lte("created_at", new Date(toFilter).toISOString());
  }

  const { data, error } = await query;

  if (error || !data) {
    return applyFilters(memoryAudit).slice(0, bounded);
  }

  return applyFilters((data as AuditRow[]).map(normalizeAuditRow)).slice(0, bounded);
}
