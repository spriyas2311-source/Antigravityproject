import { Router } from 'express';
import {
  sendMessage,
  getConversations,
  createConversation,
  getConversationMessages,
  deleteConversation
} from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

const messageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1, 'Message cannot be empty'),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).optional()
});

router.post('/', validateBody(messageSchema), sendMessage);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id/messages', getConversationMessages);
router.delete('/conversations/:id', deleteConversation);

export default router;

