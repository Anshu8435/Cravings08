import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get(['/ping', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

router.get('/health/ready', (req, res) => {
  const isDbReady = mongoose.connection.readyState === 1;

  if (isDbReady) {
    return res.status(200).json({
      status: 'READY',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(503).json({
    status: 'NOT_READY',
    database: 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

router.get('/metrics', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.status(200).json({
    uptime: process.uptime(),
    memory: {
      rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    },
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

export default router;
