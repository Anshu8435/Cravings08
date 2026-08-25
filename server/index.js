import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import cloudinary from './src/config/cloudinary.config.js';
import connectDB from './src/config/dbConnection.config.js';

// Middleware
import {
  securityHeaders,
  apiRateLimiter,
  authRateLimiter,
} from './src/middleware/security.middleware.js';
import {
  requestIdMiddleware,
  structuredLogger,
} from './src/middleware/observability.middleware.js';
import { errorHandler } from './src/middleware/error.middleware.js';

// Routes
import HealthRouter from './src/router/health.route.js';
import AuthRouter from './src/router/auth.route.js';
import PublicRouter from './src/router/public.route.js';
import CommonRouter from './src/router/common.route.js';
import MenuRouter from './src/router/menu.route.js';
import restaurantRouter from './src/router/restaurant.route.js';
import riderRouter from './src/router/rider.route.js';
import customerRouter from './src/router/customer.route.js';
import adminRouter from './src/router/admin.route.js';
import PoolRouter from './src/router/pool.route.js';
import PaymentRouter from './src/router/payment.route.js';
import OrderRouter from './src/router/order.route.js';

dotenv.config();

const app = express();

// Security Headers
app.use(securityHeaders);

// Request Tracing & Observability
app.use(requestIdMiddleware);
app.use(structuredLogger);

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'https://raj-cravings.netlify.app',
];

if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach((origin) => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== 'production' &&
          /^http:\/\/(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+):517[3-5]$/.test(
            origin,
          ))
      ) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
  }),
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Development morgan log
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health & Metrics (Excluded from rate limiters)
app.use('/', HealthRouter);

// Rate Limiting
app.use(apiRateLimiter);
app.use('/auth', authRateLimiter);

// API Endpoints
app.use('/auth', AuthRouter);
app.use('/public', PublicRouter);
app.use('/common', CommonRouter);
app.use('/menu', MenuRouter);
app.use('/restaurant', restaurantRouter);
app.use('/admin', adminRouter);
app.use('/customer', customerRouter);
app.use('/rider', riderRouter);
app.use('/pools', PoolRouter);
app.use('/payment', PaymentRouter);
app.use('/order', OrderRouter);

// Default API Welcome
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Cravings API Platform',
    docs: '/health',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, async () => {
    console.log(`Server Started on port: ${port}`);
    connectDB();
    try {
      const result = await cloudinary.api.ping();
      console.log('Cloudinary Connected:', result.status || 'OK');
    } catch (error) {
      console.warn('Cloudinary ping skipped/failed in this environment:', error.message);
    }
  });
}

export default app;
