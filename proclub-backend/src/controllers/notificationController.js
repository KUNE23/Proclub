import prisma from '../config/prisma.js'
import redisService from '../services/redisService.js'
import { CACHE_KEYS, CACHE_TTL } from '../config/cache.js'

export const getNotifications = async (req, res) => {
  try {
    const userId = Number(req.user.id)
    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 10, 50)
    const skip = (page - 1) * limit

     const cacheKey =
      `${CACHE_KEYS.NOTIFICATIONS}:${userId}:${page}:${limit}`;

      const cached =
      await redisService.getCache(cacheKey);

      if (cached) {
          return res.status(200).json(cached);
      }

    const [notifications, unreadCount, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({
        where: { userId, isRead: false }
      }),
      prisma.notification.count({
        where: { userId }
      })
    ])

    const response = {
     status: 'success',
  notifications,
  unreadCount,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
    }
  };

    await redisService.setCache(
        cacheKey,
        response,
        CACHE_TTL.NOTIFICATION
    );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil notifikasi',
      error: error.message
    })
  }
}

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = Number(req.user.id)
    const notificationId = Number(req.params.id)

    if (Number.isNaN(notificationId)) {
      return res.status(400).json({ message: 'ID notifikasi tidak valid' })
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    })

    if (!notification) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan' })
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })

    await redisService.deleteByPattern(
    `${CACHE_KEYS.NOTIFICATIONS}:${userId}:*`
    );

    return res.json({
      status: 'success',
      data: updatedNotification
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal memperbarui notifikasi',
      error: error.message
    })
  }
}

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = Number(req.user.id)

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    })

    await redisService.deleteByPattern(
    `${CACHE_KEYS.NOTIFICATIONS}:${userId}:*`
    );

    return res.json({
      status: 'success',
      message: 'Semua notifikasi sudah dibaca'
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal memperbarui notifikasi',
      error: error.message
    })
  }
}
