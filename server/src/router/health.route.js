import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get(['/ping', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.get('/debug-email', async (req, res) => {
  try {
    const net = await import('net');

    const testPort = (port) =>
      new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(4000);
        socket.connect(port, 'smtp.gmail.com', () => {
          socket.destroy();
          resolve({ port, connected: true });
        });
        socket.on('error', (err) => resolve({ port, connected: false, error: err.message }));
        socket.on('timeout', () => {
          socket.destroy();
          resolve({ port, connected: false, error: 'Connection timed out' });
        });
      });

    const [port465, port587] = await Promise.all([testPort(465), testPort(587)]);
    res.json({ port465, port587 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
