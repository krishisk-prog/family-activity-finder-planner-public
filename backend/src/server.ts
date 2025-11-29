import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';
import os from 'os';
import rateLimit from 'express-rate-limit';
import searchRouter from './routes/search';

// Helper function to get local IP address for LAN accessibility
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Load .env from backend directory
// __dirname will be backend/src, so we go up one level to backend/
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 Initializing Express app...');
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🔧 Port:', PORT);

// Get local IP for CORS and display
const localIP = getLocalIP();

// CORS configuration - allow localhost, LAN access, and Railway production
// In development, allow all origins for easier testing
const productionOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'https://localhost:5173',
  'https://localhost:5174',
  // LAN access
  `http://${localIP}:5173`,
  `http://${localIP}:5174`,
  `https://${localIP}:5173`,
  `https://${localIP}:5174`,
];

// Add Railway frontend URL if it exists
if (process.env.FRONTEND_URL) {
  productionOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: process.env.NODE_ENV === 'development'
    ? true  // Allow all origins in development
    : productionOrigins,
  credentials: true,
};

console.log('🌐 CORS enabled for:', process.env.NODE_ENV === 'development' ? 'ALL origins (dev mode)' : 'specified origins');
console.log('📍 Local IP detected:', localIP);

// Middleware
app.use(cors(corsOptions));
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

// Rate limiting - Prevent API abuse
// Limit: 10 requests per minute per IP address
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Please try again in a minute.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    console.log(`🚫 Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again in a minute.',
    });
  },
});

console.log('🛡️  Rate limiting enabled: 10 requests/minute per IP');

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes - protected by rate limiter
app.use('/api', apiLimiter, searchRouter);

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

const HOST = process.env.HOST || '0.0.0.0';
const USE_HTTPS = process.env.USE_HTTPS === 'true';

// SSL certificate paths
const certsPath = path.join(__dirname, '..', 'certs');
const keyPath = path.join(certsPath, 'localhost-key.pem');
const certPath = path.join(certsPath, 'localhost.pem');

let server: http.Server | https.Server;

if (USE_HTTPS && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  // HTTPS server with SSL certificates
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  server = https.createServer(sslOptions, app);
  server.listen(Number(PORT), HOST, () => {
    console.log('');
    console.log('🔒 HTTPS Server running!');
    console.log('');
    console.log('   Local:   https://localhost:' + PORT);
    console.log('   Network: https://' + localIP + ':' + PORT);
    console.log('');
    console.log('📊 Health check: https://localhost:' + PORT + '/health');
    console.log('✅ Server is listening and ready to accept requests');
  });
} else {
  // HTTP server (fallback or when SSL not configured)
  server = app.listen(Number(PORT), HOST, () => {
    console.log('');
    console.log('🚀 HTTP Server running!');
    console.log('');
    console.log('   Local:   http://localhost:' + PORT);
    console.log('   Network: http://' + localIP + ':' + PORT);
    console.log('');
    console.log('📊 Health check: http://localhost:' + PORT + '/health');
    console.log('✅ Server is listening and ready to accept requests');

    if (!USE_HTTPS) {
      console.log('');
      console.log('💡 Tip: Set USE_HTTPS=true in .env to enable HTTPS');
    }
  });
}

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
