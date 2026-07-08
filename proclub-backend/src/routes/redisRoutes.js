import { Router } from 'express';
import { testRedis } from '../controllers/redisController.js';

const router = Router();

router.get('/test', testRedis);

export default router;