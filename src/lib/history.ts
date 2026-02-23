import { prisma } from "@/lib/prisma";
import { HistoryAction, EntityType } from "@/types";

interface LogOptions {
  userId: string;
  action: HistoryAction;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
}

/**
 * Overload 1: named options object
 * Overload 2: positional shorthand (userId, action, entityType, entityId?, metadata?)
 */
export async function logHistory(opts: LogOptions): Promise<void>;
export async function logHistory(
  userId: string,
  action: HistoryAction,
  entityType: EntityType,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void>;
export async function logHistory(
  optsOrUserId: LogOptions | string,
  action?: HistoryAction,
  entityType?: EntityType,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    let data: LogOptions;
    if (typeof optsOrUserId === "string") {
      data = { userId: optsOrUserId, action: action!, entityType: entityType!, entityId, metadata };
    } else {
      data = optsOrUserId;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.historyEntry.create({ data: data as any });
  } catch (err) {
    // History logging must never crash the main request
    console.error("[history] Failed to log:", err);
  }
}
