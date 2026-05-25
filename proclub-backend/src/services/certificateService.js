import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import prisma from '../config/prisma.js'

const baseUrl = process.env.APP_URL || 'http://localhost:5173'
const uploadRoot = process.env.VERCEL
  ? path.join('/tmp', 'proclub', 'certificates')
  : path.join(process.cwd(), 'src', 'uploads', 'certificates')

const ensureDirectory = (dir) => {
  fs.mkdirSync(dir, { recursive: true })
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const generateCode = (id) => `PCB-${String(id).padStart(5, '0')}`

export const getCertificateEligibility = async (userId, courseId) => {
  const course = await prisma.course.findFirst({
    where: {
      id: Number(courseId),
      isDeleted: false
    },
    include: {
      modules: {
        where: { isDeleted: false },
        include: {
          lessons: {
            where: { isDeleted: false },
            select: { id: true }
          }
        }
      }
    }
  })

  if (!course) {
    return { eligible: false, reason: 'Learning path tidak ditemukan.' }
  }

  const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))

  if (lessonIds.length === 0) {
    return { eligible: false, reason: 'Learning path belum memiliki lesson.' }
  }

  const completedLessons = await prisma.userProgress.count({
    where: {
      userId: Number(userId),
      lessonId: { in: lessonIds },
      status: 'COMPLETED'
    }
  })

  if (completedLessons !== lessonIds.length) {
    return { eligible: false, reason: 'Selesaikan semua lesson terlebih dahulu.', course }
  }

  const approvedProject = await prisma.project.findFirst({
    where: {
      userId: Number(userId),
      courseId: Number(courseId),
      status: 'approved'
    }
  })

  if (!approvedProject) {
    return { eligible: false, reason: 'Project final harus approved terlebih dahulu.', course }
  }

  return { eligible: true, course }
}

export const generateCertificateForCourse = async (userId, courseId) => {
  const existingCertificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId: Number(userId),
        courseId: Number(courseId)
      }
    }
  })

  if (existingCertificate) return existingCertificate

  const eligibility = await getCertificateEligibility(userId, courseId)

  if (!eligibility.eligible) return null

  const [user, template] = await Promise.all([
    prisma.user.findUnique({ where: { id: Number(userId) } }),
    prisma.certificateTemplate.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })
  ])

  if (!user || !template) return null

  ensureDirectory(uploadRoot)
  const certificate = await prisma.certificate.create({
    data: {
      code: `PENDING-${Date.now()}-${userId}-${courseId}`,
      userName: user.name,
      learningPath: eligibility.course.title,
      pdfPath: '',
      pdfUrl: '',
      verificationUrl: '',
      userId: Number(userId),
      courseId: Number(courseId),
      templateId: template.id
    }
  })

  const code = generateCode(certificate.id)
  const fileName = `${code}.pdf`
  const pdfPath = path.join(uploadRoot, fileName)
  const pdfUrl = `/api/certificates/${code}/download`
  const verificationUrl = `${baseUrl}/certificate/${code}`

  await renderCertificatePdf({
    certificate: {
      ...certificate,
      code,
      verificationUrl,
      issuedAt: certificate.issuedAt
    },
    template,
    pdfPath
  })

  return prisma.certificate.update({
    where: { id: certificate.id },
    data: {
      code,
      pdfPath,
      pdfUrl,
      verificationUrl
    }
  })
}

export const renderCertificatePdf = async ({ certificate, template, pdfPath }) => {
  ensureDirectory(path.dirname(pdfPath))

  const qrDataUrl = await QRCode.toDataURL(certificate.verificationUrl, {
    margin: 1,
    width: template.qrSize
  })

  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64')
  const doc = new PDFDocument({
    size: [template.imageWidth, template.imageHeight],
    margin: 0
  })

  const stream = fs.createWriteStream(pdfPath)
  doc.pipe(stream)
  const backgroundSource = template.backgroundData
    ? Buffer.from(template.backgroundData, 'base64')
    : template.backgroundPath

  doc.image(backgroundSource, 0, 0, {
    width: template.imageWidth,
    height: template.imageHeight
  })

  doc
    .fillColor(template.textColor)
    .font(template.fontFamily)
    .fontSize(template.nameFontSize)
    .text(certificate.userName, template.nameX, template.nameY, {
      width: template.imageWidth - template.nameX * 2,
      align: 'center'
    })

  doc
    .fontSize(template.dateFontSize)
    .text(formatDate(new Date(certificate.issuedAt)), template.dateX, template.dateY, {
      width: 360,
      align: 'left'
    })

  doc
    .fontSize(template.dateFontSize)
    .text(certificate.learningPath, template.dateX, template.dateY + template.dateFontSize + 10, {
      width: 460,
      align: 'left'
    })

  doc.image(qrBuffer, template.qrX, template.qrY, {
    width: template.qrSize,
    height: template.qrSize
  })

  doc
    .fontSize(12)
    .fillColor('#475569')
    .text(certificate.code, template.qrX, template.qrY + template.qrSize + 8, {
      width: template.qrSize,
      align: 'center'
    })

  doc.end()

  return new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
}

export const tryGenerateCertificatesForUser = async (userId) => {
  const courses = await prisma.course.findMany({
    where: { isDeleted: false },
    select: { id: true }
  })

  const results = []

  for (const course of courses) {
    const certificate = await generateCertificateForCourse(userId, course.id)
    if (certificate) results.push(certificate)
  }

  return results
}
