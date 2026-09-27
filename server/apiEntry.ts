import express, { Request, Response, NextFunction } from 'express';
import { apiRouter } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
const healthCheck = (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'Shaukat PVC Plastic Pipe Shop API',
    phone: '+92-61-4540198',
    address: '17-A Hassan Parnana Colony, Multan, Punjab, Pakistan',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', healthCheck);
app.get('/health', healthCheck);

// Mount API router on both '/api' and '/'
// This ensures that API calls work whether Vercel rewrite preserves or strips the '/api' prefix
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
