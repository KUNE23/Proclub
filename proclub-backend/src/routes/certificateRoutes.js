import express from 'express'
import multer from 'multer'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
  downloadCertificate,
  generateMyCertificate,
  getCertificateTemplate,
  getMyCertificates,
  uploadCertificateTemplate,
  verifyCertificate
} from '../controllers/certificateController.js'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.get('/certificate-template', authMiddleware, roleMiddleware(['admin']), getCertificateTemplate)
router.post('/certificate-template', authMiddleware, roleMiddleware(['admin']), upload.single('background'), uploadCertificateTemplate)
router.get('/certificates/mine', authMiddleware, getMyCertificates)
router.post('/certificates/generate/:courseId', authMiddleware, generateMyCertificate)
router.get('/certificates/verify/:code', verifyCertificate)
router.get('/certificates/:code/download', authMiddleware, downloadCertificate)

export default router
