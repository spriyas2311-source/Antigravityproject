import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { ENV, validateEnv } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';

import profileRoutes from './routes/profile.routes.js';
import cropRoutes from './routes/crop.routes.js';
import soilRoutes from './routes/soil.routes.js';
import fertilizerRoutes from './routes/fertilizer.routes.js';
import irrigationRoutes from './routes/irrigation.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import chatRoutes from './routes/chat.routes.js';
import sourcesRoutes from './routes/sources.routes.js';

validateEnv();

const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({
  origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: { code: 'RATE_LIMIT_EXCEEDED' }
  }
});
app.use('/api/', limiter);

// Health Check Endpoint (Section 12 requirement: does not expose internal secrets)
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Krishi Mitra AI Backend Engine is operational',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// Mount Feature Routes
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/crop-recommendations', cropRoutes);
app.use('/api/v1/soil-analysis', soilRoutes);
app.use('/api/v1/fertilizer-advisory', fertilizerRoutes);
app.use('/api/v1/irrigation-advisory', irrigationRoutes);
app.use('/api/v1/disease-detection', diseaseRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/sources', sourcesRoutes);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    error: { code: 'NOT_FOUND' }
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`[Krishi Mitra Server] Running on http://localhost:${ENV.PORT}`);
    console.log(`[Krishi Mitra Server] Environment: ${ENV.NODE_ENV}`);
  });
}

export default app;

