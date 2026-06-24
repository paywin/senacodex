import { query } from '@/config/database';
import { logError } from '@/utils/logger';

export interface AuditEvent {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  actorEmail?: string | null;
  status?: 'success' | 'failure' | 'denied';
  metadata?: Record<string, unknown>;
}

export async function logAudit(
  eventOrUserId: AuditEvent | string | null,
  action?: string,
  entityType?: string,
  entityId?: string | null,
  details?: string | null,
  ipAddress?: string | null
): Promise<void> {
  const event: AuditEvent =
    typeof eventOrUserId === 'object' && eventOrUserId !== null
      ? eventOrUserId
      : {
          userId: eventOrUserId,
          action: action ?? 'UNKNOWN',
          entityType: entityType ?? 'unknown',
          entityId,
          details,
          ipAddress,
        };

  try {
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address, actor_email, status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        event.userId ?? null,
        event.action,
        event.entityType,
        event.entityId ?? null,
        event.details ?? null,
        event.ipAddress ?? null,
        event.actorEmail ?? null,
        event.status ?? 'success',
        JSON.stringify(event.metadata ?? {}),
      ]
    );
  } catch (error) {
    logError('Failed to persist audit log', error, {
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId ?? null,
      actorEmail: event.actorEmail ?? null,
      status: event.status ?? 'success',
    });
  }
}
