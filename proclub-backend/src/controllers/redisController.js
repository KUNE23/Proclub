import redisService from '../services/redisService.js';

export const testRedis = async (req, res, next) => {
  try {
    await redisService.set('hello', 'Proclub');

    const value = await redisService.get('hello');

    await redisService.del('hello');

    return res.status(200).json({
      success: true,
      message: 'Redis connected successfully',
      value,
    });
  } catch (error) {
    next(error);
  }
};