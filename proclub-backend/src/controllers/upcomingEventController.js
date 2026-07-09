import { z } from 'zod'
import prisma from '../config/prisma.js'
import redisService from '../services/redisService.js'
import { CACHE_KEYS, CACHE_TTL } from '../config/cache.js'

const eventSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter').max(120, 'Judul maksimal 120 karakter'),
  description: z.string().trim().max(500, 'Deskripsi maksimal 500 karakter').optional().nullable(),
  location: z.string().trim().max(120, 'Lokasi maksimal 120 karakter').optional().nullable(),
  eventDate: z.coerce.date(),
  isActive: z.boolean().optional()
}).refine((data) => data.eventDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
  message: 'Tanggal kegiatan tidak boleh sebelum hari ini',
  path: ['eventDate']
})

const serializeEvent = (event) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  location: event.location,
  eventDate: event.eventDate,
  isActive: event.isActive,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt
})

export const getUpcomingEvents = async (req, res) => {
  try {
    const cacheKey = CACHE_KEYS.UPCOMING_EVENTS;

    const cached = await redisService.getCache(cacheKey);

    if (cached) {
      return res.status(200).json(cached);
    }
    
    const events = await prisma.upcomingEvent.findMany({
      where: { isDeleted: false },
      orderBy: { eventDate: 'asc' }
    })

   const response = {
      status: 'success',
      data: events.map(serializeEvent)
    };

    await redisService.setCache(
      cacheKey,
      response,
      CACHE_TTL.EVENT
    );

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat jadwal kegiatan' })
  }
}

export const getNearestUpcomingEvent = async (req, res) => {
  try {
    const cacheKey = `${CACHE_KEYS.UPCOMING_EVENTS}:nearest`;

      const cached = await redisService.getCache(cacheKey);

      if (cached) {
        return res.status(200).json(cached);
      }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const event = await prisma.upcomingEvent.findFirst({
      where: {
        isDeleted: false,
        isActive: true,
        eventDate: {
          gte: today
        }
      },
      orderBy: { eventDate: 'asc' }
    })

   const response = {
      status: 'success',
      data: event ? serializeEvent(event) : null
    };

    await redisService.setCache(
      cacheKey,
      response,
      CACHE_TTL.EVENT
    );

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat jadwal terdekat' })
  }
}

export const createUpcomingEvent = async (req, res) => {
  try {
    const parsed = eventSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]?.message || 'Input jadwal tidak valid'
      })
    }

    const event = await prisma.upcomingEvent.create({
      data: parsed.data
    })

    await redisService.deleteCache(
  CACHE_KEYS.UPCOMING_EVENTS
    );

    await redisService.deleteCache(
      `${CACHE_KEYS.UPCOMING_EVENTS}:nearest`
    );

    return res.status(201).json({
      message: 'Jadwal kegiatan berhasil dibuat',
      data: serializeEvent(event)
    })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat jadwal kegiatan' })
  }
}

export const updateUpcomingEvent = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID jadwal tidak valid' })
    }

    const parsed = eventSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]?.message || 'Input jadwal tidak valid'
      })
    }

    const existing = await prisma.upcomingEvent.findFirst({
      where: { id, isDeleted: false }
    })

    if (!existing) {
      return res.status(404).json({ message: 'Jadwal kegiatan tidak ditemukan' })
    }

    const event = await prisma.upcomingEvent.update({
      where: { id },
      data: parsed.data
    })

    await redisService.deleteCache(
  CACHE_KEYS.UPCOMING_EVENTS
    );

    await redisService.deleteCache(
      `${CACHE_KEYS.UPCOMING_EVENTS}:nearest`
    );

    return res.json({
      message: 'Jadwal kegiatan berhasil diperbarui',
      data: serializeEvent(event)
    })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui jadwal kegiatan' })
  }
}

export const deleteUpcomingEvent = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID jadwal tidak valid' })
    }

    const existing = await prisma.upcomingEvent.findFirst({
      where: { id, isDeleted: false }
    })

    if (!existing) {
      return res.status(404).json({ message: 'Jadwal kegiatan tidak ditemukan' })
    }

    await prisma.upcomingEvent.update({
      where: { id },
      data: { isDeleted: true, isActive: false }
    })

    await redisService.deleteCache(
  CACHE_KEYS.UPCOMING_EVENTS
    );

    await redisService.deleteCache(
      `${CACHE_KEYS.UPCOMING_EVENTS}:nearest`
    );

    return res.json({ message: 'Jadwal kegiatan berhasil dihapus' })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus jadwal kegiatan' })
  }
}
