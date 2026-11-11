import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { executeAgronomicAI } from '../services/ai/gemini.service.js';
import { ChatbotAIResponseSchema } from '../schemas/ai.schemas.js';
import { getSupabaseAdmin } from '../config/supabase.js';

export async function sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { conversationId, message, preferredLanguage } = req.body;
  const supabase = getSupabaseAdmin();

  let activeConversationId = conversationId;

  // 1. Ensure conversation exists or create a new one
  if (!activeConversationId) {
    const titleSnippet = message.slice(0, 40) + (message.length > 40 ? '...' : '');
    const { data: convData, error: convError } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: userId,
        title: titleSnippet
      })
      .select()
      .single();

    if (convError || !convData) {
      console.warn('[CONV CREATE WARNING]:', convError?.message);
    } else {
      activeConversationId = convData.id;
    }
  }

  // 2. Fetch recent conversation history for multi-turn context (last 6 messages)
  let conversationHistory = '';
  if (activeConversationId) {
    const { data: pastMessages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', activeConversationId)
      .order('created_at', { ascending: true })
      .limit(6);

    if (pastMessages && pastMessages.length > 0) {
      conversationHistory = pastMessages
        .map(m => `${m.role === 'user' ? 'Farmer' : 'Assistant'}: ${m.content}`)
        .join('\n');
    }
  }

  // 3. Construct prompt
  const prompt = `
CONVERSATION HISTORY:
${conversationHistory || 'None (New Conversation)'}

CURRENT FARMER QUESTION:
${message}

Provide an empowering, clear, scientifically responsible agricultural answer.
Categorize the question into: crop, soil, fertilizer, irrigation, disease, or general.
Include key summary points, a practical follow-up question to help the farmer further, and appropriate confidence & safety disclaimers.
Strictly adhere to the required JSON schema format.
`;

  try {
    const aiResult = await executeAgronomicAI({
      prompt,
      zodSchema: ChatbotAIResponseSchema,
      preferredLanguage: preferredLanguage || 'en'
    });

    // 4. Save both user message and assistant answer to database
    if (activeConversationId) {
      await supabase.from('chat_messages').insert([
        {
          conversation_id: activeConversationId,
          user_id: userId,
          role: 'user',
          content: message
        },
        {
          conversation_id: activeConversationId,
          user_id: userId,
          role: 'assistant',
          content: aiResult.answer
        }
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        conversationId: activeConversationId,
        ...aiResult
      }
    });
  } catch (err: any) {
    console.error('[CHAT ASSISTANT ERROR]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process agricultural query',
      error: { code: 'AI_PROCESSING_ERROR', details: err.message }
    });
  }
}

export async function getConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversations',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data || []
  });
}

export async function createConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { title } = req.body;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: userId,
      title: title || 'New Agricultural Consultation'
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create conversation',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data
  });
}

export async function getConversationMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { id } = req.params;
  const supabase = getSupabaseAdmin();

  // Verify ownership
  const { data: conv } = await supabase
    .from('chat_conversations')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!conv) {
    res.status(404).json({
      success: false,
      message: 'Conversation not found or access denied',
      error: { code: 'NOT_FOUND' }
    });
    return;
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: data || []
  });
}

export async function deleteConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { id } = req.params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('chat_conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation',
      error: { code: 'DATABASE_ERROR', details: error.message }
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Conversation deleted successfully'
  });
}

