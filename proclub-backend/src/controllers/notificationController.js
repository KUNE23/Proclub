import prisma from '../config/prisma.js'

export const getNotifications = async (req, res) => {
  try {
    const userId = Number(req.user.id)
    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 10, 50)
    const skip = (page - 1) * limit

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

    return res.json({
      status: 'success',
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
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
