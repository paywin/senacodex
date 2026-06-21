import { query } from '@/config/database';
import { mapEvaluationRow } from '@/utils/format';
import type { IEvaluation } from '@/types';

export async function getEvaluations(): Promise<IEvaluation[]> {
  const result = await query('SELECT * FROM evaluations ORDER BY created_at DESC');
  return result.rows.map(mapEvaluationRow);
}

export async function getEvaluationCount(): Promise<number> {
  const result = await query('SELECT COUNT(*) AS count FROM evaluations');
  return Number(result.rows[0]?.count || 0);
}
