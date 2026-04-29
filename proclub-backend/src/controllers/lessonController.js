const prisma = require('../config/prisma')

const createLesson = async (req, res) => {
  try {
    const moduleId = Number(req.params.moduleId)
    const { title, content } = req.body

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' })
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!module) {
      return res.status(404).json({ message: 'Module not found' })
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        moduleId
      }
    })

    return res.status(201).json({ message: 'Lesson created', lesson })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getLessonsByModule = async (req, res) => {
  try {
    const moduleId = Number(req.params.moduleId)

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' })
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!module) {
      return res.status(404).json({ message: 'Module not found' })
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'asc' }
    })

    if (lessons.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No lessons found for this module'
      })
    }

    return res.status(200).json({
      status: 'success',
      lessons
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getLessonById = async (req, res) => {
  try {
    const lessonId = Number(req.params.id)

    if (Number.isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true }
    })

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    return res.status(200).json({
      status: 'success',
      lesson
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const updateLesson = async (req, res) => {
  try {
    const lessonId = Number(req.params.id)
    const { title, content } = req.body

    if (Number.isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' })
    }

    if (!title && !content) {
      return res.status(400).json({ message: 'At least one field is required to update' })
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    })

    if (!existingLesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: title ?? existingLesson.title,
        content: content ?? existingLesson.content
      }
    })

    return res.status(200).json({
      message: 'Lesson updated',
      lesson
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const deleteLesson = async (req, res) => {
  try {
    const lessonId = Number(req.params.id)

    if (Number.isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' })
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    })

    if (!existingLesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    await prisma.lesson.delete({
      where: { id: lessonId }
    })

    return res.status(200).json({
      message: 'Lesson deleted'
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createLesson,
  getLessonsByModule,
  getLessonById,
  updateLesson,
  deleteLesson
}
