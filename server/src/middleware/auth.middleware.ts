import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin } from '../config/supabase.js';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: Record<string, any>;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  token?: string;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Missing or malformed Authorization header.',
      error: { code: 'UNAUTHORIZED' }
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  req.token = token;

  try {
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        message: 'Invalid, expired, or revoked authentication session.',
        error: { code: 'TOKEN_INVALID', details: error?.message }
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      user_metadata: user.user_metadata
    };

    next();
  } catch (err: any) {
    // If Supabase credentials are missing or network error occurred
    console.error('[AUTH MIDDLEWARE EXCEPTION]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Internal authentication service failure.',
      error: { code: 'AUTH_SERVICE_ERROR', details: err.message }
    });
  }
}

