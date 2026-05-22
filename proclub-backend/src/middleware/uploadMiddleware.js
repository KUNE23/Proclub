import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDirectory = path.join(__dirname, '..', 'uploads', 'courses')
const isVercel = Boolean(process.env.VERCEL)

if (!isVercel) {
  fs.mkdirSync(uploadDirectory, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory)
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    const filename = `${Date.now()}-${file.fieldname}${extension}`
    cb(null, filename)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only jpeg, jpg, png, and webp image files are allowed'))
  }
  cb(null, true)
}

const upload = multer({
  storage: isVercel ? multer.memoryStorage() : storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 
  }
})


export { upload };
