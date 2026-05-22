import prisma from '../config/prisma.js'
import xss from 'xss'
import { notifyAdmins } from '../services/adminNotificationService.js'

export const createContactMessage = async (req, res) => {
  try {
    const message = await prisma.contactMessage.create({
      data: {
        name: xss(req.body.name.trim()),
        email: req.body.email.trim().toLowerCase(),
        message: xss(req.body.message.trim())
      }
    })

    await notifyAdmins({
      title: 'Pesan kontak baru',
      message: `${message.name} mengirim pesan melalui landing page.`,
      type: 'INFO',
      link: '/admin/contacts'
    })

    return res.status(201).json({
      status: 'success',
      message: 'Pesan berhasil dikirim. Tim Proclub akan segera menghubungi kamu.',
      data: message
    })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message })
  }
}

export const getContactMessages = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50)
    const search = req.query.search?.toString().trim()
    const status = req.query.status?.toString()

    const where = { isDeleted: false }

    if (status === 'read') where.isRead = true
    if (status === 'unread') where.isRead = false
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [messages, total, unreadCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({ where: { isDeleted: false, isRead: false } })
    ])

    return res.json({
      status: 'success',
      data: messages,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil pesan kontak', error: error.message })
  }
}

export const updateContactMessage = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID pesan tidak valid' })
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: req.body.isRead }
    })

    return res.json({
      status: 'success',
      message: req.body.isRead ? 'Pesan ditandai sudah dibaca' : 'Pesan ditandai belum dibaca',
      data: message
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Pesan kontak tidak ditemukan' })
    }

    return res.status(500).json({ message: 'Gagal memperbarui pesan kontak', error: error.message })
  }
}

export const deleteContactMessage = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID pesan tidak valid' })
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isDeleted: true }
    })

    return res.json({ status: 'success', message: 'Pesan kontak berhasil dihapus' })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Pesan kontak tidak ditemukan' })
    }

    return res.status(500).json({ message: 'Gagal menghapus pesan kontak', error: error.message })
  }
}
