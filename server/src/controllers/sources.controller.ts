import { Request, Response } from 'express';
import { getSupabaseAdmin } from '../config/supabase.js';

export async function getSources(req: Request, res: Response): Promise<void> {
  const { type } = req.query;
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from('advisory_sources')
    .select('*')
    .eq('is_active', true)
    .order('organization', { ascending: true });

  if (type && typeof type === 'string') {
    query = query.eq('advisory_type', type);
  }

  const { data, error } = await query;

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve agricultural reference sources',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data || []
  });
}

