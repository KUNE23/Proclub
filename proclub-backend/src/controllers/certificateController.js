import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import prisma from '../config/prisma.js'
import { generateCertificateForCourse } from '../services/certificateService.js'

const uploadRoot = path.join(process.cwd(), 'src', 'uploads', 'certificates')
const templateRoot = path.join(uploadRoot, 'templates')

const parseInteger = (value, fallback) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : fallback
}

const isHexColor = (value) => /^#[0-9A-Fa-f]{6}$/.test(value)

const templateSelect = {
  id: true,
  name: true,
  backgroundUrl: true,
  imageWidth: true,
  imageHeight: true,
  nameX: true,
  nameY: true,
  dateX: true,
  dateY: true,
  qrX: true,
  qrY: true,
  qrSize: true,
  fontFamily: true,
  nameFontSize: true,
  dateFontSize: true,
  textColor: true,
  isActive: true,
  updatedAt: true
}

export const getCertificateTemplate = async (req, res) => {
  try {
    const template = await prisma.certificateTemplate.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
      select: templateSelect
    })

    return res.json({ status: 'success', data: template })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil template sertifikat', error: error.message })
  }
}

export const uploadCertificateTemplate = async (req, res) => {
  try {
    if (req.file && !['image/png', 'image/jpeg', 'image/jpg'].includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Format background harus PNG atau JPG.' })
    }

    const name = String(req.body.name || 'Template Sertifikat Proclub').trim()
    const textColor = String(req.body.textColor || '#1A2E20').trim()
    const fontFamily = String(req.body.fontFamily || 'Helvetica').trim()
    const allowedFonts = ['Helvetica', 'Times-Roman', 'Courier']

    if (name.length < 3 || name.length > 120) {
      return res.status(400).json({ message: 'Nama template harus 3 sampai 120 karakter.' })
    }

    if (!isHexColor(textColor)) {
      return res.status(400).json({ message: 'Warna teks harus format hex, contoh #1A2E20.' })
    }

    if (!allowedFonts.includes(fontFamily)) {
      return res.status(400).json({ message: 'Font tidak valid.' })
    }

    fs.mkdirSync(templateRoot, { recursive: true })

    const currentTemplate = await prisma.certificateTemplate.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })

    if (!req.file && !currentTemplate) {
      return res.status(400).json({ message: 'Background sertifikat wajib diupload.' })
    }

    let backgroundPath = currentTemplate?.backgroundPath
    let backgroundUrl = currentTemplate?.backgroundUrl
    let imageWidth = currentTemplate?.imageWidth || 1200
    let imageHeight = currentTemplate?.imageHeight || 850

    if (req.file) {
      const image = sharp(req.file.buffer).rotate()
      const metadata = await image.metadata()
      const originalWidth = metadata.width || 1200
      const fileName = `template-${Date.now()}.jpg`
      backgroundPath = path.join(templateRoot, fileName)
      backgroundUrl = `/uploads/certificates/templates/${fileName}`

      await image
        .resize({
          width: Math.min(originalWidth, 1600),
          withoutEnlargement: true
        })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(backgroundPath)

      const compressed = await sharp(backgroundPath).metadata()
      imageWidth = compressed.width || originalWidth
      imageHeight = compressed.height || metadata.height || 850
    }

    await prisma.certificateTemplate.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    const template = await prisma.certificateTemplate.create({
      data: {
        name,
        backgroundPath,
        backgroundUrl,
        imageWidth,
        imageHeight,
        nameX: parseInteger(req.body.nameX, Math.round(imageWidth * 0.25)),
        nameY: parseInteger(req.body.nameY, Math.round(imageHeight * 0.42)),
        dateX: parseInteger(req.body.dateX, Math.round(imageWidth * 0.2)),
        dateY: parseInteger(req.body.dateY, Math.round(imageHeight * 0.68)),
        qrX: parseInteger(req.body.qrX, Math.round(imageWidth * 0.76)),
        qrY: parseInteger(req.body.qrY, Math.round(imageHeight * 0.64)),
        qrSize: parseInteger(req.body.qrSize, 120),
        fontFamily,
        nameFontSize: parseInteger(req.body.nameFontSize, 42),
        dateFontSize: parseInteger(req.body.dateFontSize, 18),
        textColor
      },
      select: templateSelect
    })

    return res.status(201).json({
      status: 'success',
      message: 'Template sertifikat berhasil disimpan',
      data: template
    })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menyimpan template sertifikat', error: error.message })
  }
}

export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user.id },
      include: {
        course: { select: { id: true, title: true } }
      },
      orderBy: { issuedAt: 'desc' }
    })

    return res.json({ status: 'success', data: certificates })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil sertifikat', error: error.message })
  }
}

export const generateMyCertificate = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId)

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Learning path tidak valid.' })
    }

    const certificate = await generateCertificateForCourse(req.user.id, courseId)

    if (!certificate) {
      return res.status(400).json({ message: 'Syarat sertifikat belum terpenuhi.' })
    }

    return res.json({ status: 'success', data: certificate })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat sertifikat', error: error.message })
  }
}

export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { code: req.params.code },
      include: {
        course: { select: { id: true, title: true } },
        user: { select: { id: true, name: true } }
      }
    })

    if (!certificate) {
      return res.status(404).json({ message: 'Sertifikat tidak ditemukan.' })
    }

    return res.json({ status: 'success', data: certificate })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memverifikasi sertifikat', error: error.message })
  }
}

export const downloadCertificate = async (req, res) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { code: req.params.code }
    })

    if (!certificate) {
      return res.status(404).json({ message: 'Sertifikat tidak ditemukan.' })
    }

    if (req.user?.role !== 'admin' && certificate.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Tidak memiliki akses ke sertifikat ini.' })
    }

    return res.download(certificate.pdfPath, `${certificate.code}.pdf`)
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengunduh sertifikat', error: error.message })
  }
}
