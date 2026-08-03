import crypto from 'node:crypto';

export const requestIdMiddleware = (req, res, next) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
};

export const structuredLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      userAgent: req.get('user-agent') || 'unknown',
      ip: req.ip,
    };

    if (duration > 500) {
      console.warn(
        JSON.stringify({
          level: 'WARN',
          category: 'SLOW_ENDPOINT',
          ...logData,
        }),
      );
    } else if (res.statusCode >= 500) {
      console.error(
        JSON.stringify({
          level: 'ERROR',
          ...logData,
        }),
      );
    } else if (res.statusCode >= 400) {
      console.warn(
        JSON.stringify({
          level: 'WARN',
          ...logData,
        }),
      );
    } else {
      console.log(
        JSON.stringify({
          level: 'INFO',
          ...logData,
        }),
      );
    }
  });

  next();
};
