import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { getSupabaseAdmin } from '../config/supabase.js';

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('farmer_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  // If profile doesn't exist yet, return basic auth user info
  const profile = data || {
    id: userId,
    full_name: req.user?.user_metadata?.full_name || 'Farmer',
    preferred_language: 'en'
  };

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: profile
  });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { full_name, state, district, village, preferred_language } = req.body;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('farmer_profiles')
    .upsert({
      id: userId,
      full_name,
      state,
      district,
      village,
      preferred_language,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data
  });
}

export async function deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const supabase = getSupabaseAdmin();

  // Delete from auth.users via admin client (cascades to all user tables)
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: { code: 'AUTH_DELETE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Account and all associated agricultural data deleted successfully.'
  });
}

