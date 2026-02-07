/**
 * Flipbook Backend Server
 *
 * This is the main entry point of the application.
 * It sets up Express, middleware, and starts listening.
 */

// Load environment variables FIRST (before other imports)
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { configureCloudinary, testCloudinaryConnection } from './config/cloudinary.js';
import magazineRoutes from './routes/magazineRoutes.js';

// Configure Cloudinary after dotenv loads
configureCloudinary();

/**
 * Initialize Express App
 *
 * Express is a minimal web framework that provides:
 * - Routing (URL → handler mapping)
 * - Middleware (functions that process requests)
 * - HTTP utilities (req, res helpers)
 */
const app = express();

/**
 * Connect to Services
 *
 * These are async, so we call them before starting the server.
 */
const initializeServices = async () => {
  // Connect to MongoDB
  await connectDB();

  // Verify Cloudinary credentials
  await testCloudinaryConnection();
};

/**
 * Middleware Setup
 *
 * Middleware are functions that run on every request.
 * Order matters! They execute in the order defined.
 */

// 1. CORS - Allow requests from frontend domain
//    Without this, browser blocks cross-origin requests
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Body Parsers - Parse incoming request bodies
//    express.json() parses JSON bodies (Content-Type: application/json)
app.use(express.json({ limit: '10mb' }));
//    express.urlencoded() parses form data (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Request Logging (simple version)
//    In production, use a proper logger like morgan or winston
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

/**
 * Routes
 *
 * Mount route modules on base paths.
 * /api prefix is convention for API routes.
 */

// Health check endpoint (for monitoring/load balancers)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Magazine routes
app.use('/api/magazines', magazineRoutes);

/**
 * 404 Handler
 *
 * Catch requests to undefined routes.
 * Must come after all other routes.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  });
});

/**
 * Global Error Handler
 *
 * Catches all errors thrown in route handlers.
 * Must have 4 parameters (err, req, res, next) for Express to recognize it.
 */
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', '),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate value entered',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

/**
 * Start Server
 *
 * Initialize services, then listen on port.
 */
const PORT = process.env.PORT || 5000;

initializeServices()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🚀 Flipbook Backend Server               ║
║                                            ║
║   Port: ${PORT}                              ║
║   Mode: ${process.env.NODE_ENV || 'development'}                     ║
║   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}      ║
║                                            ║
╚════════════════════════════════════════════╝
      `);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

/**
 * Handle unhandled promise rejections
 *
 * Catch-all for any unhandled async errors.
 */
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // In production, you might want to restart the process
});

export default app;
