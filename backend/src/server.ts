import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import searchRouter from './routes/search';

// Load .env from backend directory
// __dirname will be backend/src, so we go up one level to backend/
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 Initializing Express app...');
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🔧 Port:', PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging - THIS SHOULD FIRE FOR EVERY REQUEST
app.use((req, res, next) => {
  console.log('='.repeat(50));
  console.log(`⚡ INCOMING REQUEST: ${req.method} ${req.path}`);
  console.log(`⚡ Headers:`, req.headers);
  console.log(`⚡ Body:`, req.body);
  console.log('='.repeat(50));
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', searchRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log('✅ Server is listening and ready to accept requests');
});

// Prevent the process from exiting
server.on('close', () => {
  console.log('🛑 Server closed');
});

// Keep the process alive
setInterval(() => {
  // Heartbeat to keep process alive
}, 1000000);

// Catch unhandled errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Log when process exits
process.on('exit', (code) => {
  console.log(`👋 Process exiting with code: ${code}`);
});

export default app;
