import prisma from '../config/prisma.js';
import redisService from '../services/redisService.js';

const formatUptime = () => {
  const totalSeconds = Math.floor(process.uptime());

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    seconds: totalSeconds,
    days,
    hours,
    minutes,
    secondsOnly: seconds,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  };
};

export const healthCheck = async (req, res) => {
  let database = 'disconnected';
  let redis = 'disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'connected';
  } catch (error) {
    database = 'disconnected';
  }

  if (redisService.isConnected()) {
    redis = 'connected';
  }

  const status =
    database === 'connected' && redis === 'connected'
      ? 'ok'
      : 'warning';

  return res.status(200).json({
    success: true,
    status,
    services: {
      database,
      redis,
    },
    uptime: formatUptime(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  });
};