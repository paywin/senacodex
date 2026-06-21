import { query } from '@/config/database';
import { mapActivityRow } from '@/utils/format';
import type { IActivity } from '@/types';

export async function getActivities(): Promise<IActivity[]> {
  const result = await query('SELECT * FROM activities ORDER BY created_at DESC LIMIT 10');
  return result.rows.map(mapActivityRow);
}
