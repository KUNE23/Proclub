const prisma = require('../config/prisma')

const createModule = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId)
    const { title, content, order } = req.body
    const orderNumber = order !== undefined ? Number(order) : undefined

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    if (!title || !content || order === undefined) {
      return res.status(400).json({ message: 'Title, content, and order are required' })
    }

    if (Number.isNaN(orderNumber) || !Number.isInteger(orderNumber)) {
      return res.status(400).json({ message: 'Order must be an integer' })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const moduleItem = await prisma.module.create({
      data: {
        title,
        content,
        order: orderNumber,
        courseId
      }
    })

    return res.status(201).json({ message: 'Module created', module: moduleItem })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getModulesByCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const modules = await prisma.module.findMany({
      where: { courseId },
      select: {
    id: true,
    title: true,
    content: true,
    order: true
  },
      orderBy: { order: 'asc' }
    });

    if (modules.length === 0) {
      return res.status(404).json({ 
        status: 'fail',
        message: 'No modules found for this course' 
      });
    }

    return res.status(200).json({ 
      status: 'success',
      modules 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateModule = async (req, res) => {
  try {
    const moduleId = Number(req.params.id)
    const { title, content, order } = req.body
    const orderNumber = order !== undefined ? Number(order) : undefined

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' })
    }

    if (!title && !content && order === undefined) {
      return res.status(400).json({ message: 'At least one field is required to update' })
    }

    if (order !== undefined && (Number.isNaN(orderNumber) || !Number.isInteger(orderNumber))) {
      return res.status(400).json({ message: 'Order must be an integer' })
    }

    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!existingModule) {
      return res.status(404).json({ message: 'Module not found' })
    }

    const moduleItem = await prisma.module.update({
      where: { id: moduleId },
      data: {
        title: title ?? existingModule.title,
        content: content ?? existingModule.content,
        order: order === undefined ? existingModule.order : orderNumber
      }
    })

    return res.json({ message: 'Module updated', module: moduleItem })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const deleteModule = async (req, res) => {
  try {
    const moduleId = Number(req.params.id)

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' })
    }

    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!existingModule) {
      return res.status(404).json({ message: 'Module not found' })
    }

    await prisma.module.delete({
      where: { id: moduleId }
    })

    return res.json({ message: 'Module deleted' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const updateProgress = async (req, res) => {
  try {
    const moduleId = Number(req.params.id)
    const userId = req.user.id
    const { score } = req.body

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' })
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!module) {
      return res.status(404).json({ message: 'Module not found' })
    }

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_moduleId: {
          userId: Number(userId),
          moduleId: Number(moduleId)
        }
      },
      update: {
        status: 'completed',
        score: score ?? undefined
      },
      create: {
        userId: Number(userId),
        moduleId: Number(moduleId),
        status: 'completed',
        score: score ?? undefined
      }
    })

    return res.status(200).json({
      message: 'Progres disimpan!',
      status: 'success',
      progress: userProgress
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getModuleDetail = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params
    const userId = req.user.id

    const module = await prisma.module.findUnique({
      where: { id: Number(moduleId) },
      include: {
        quizzes: true,
        course: true
      }
    })

    if (!module) {
      return res.status(404).json({ message: 'Module not found' })
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: Number(userId),
          moduleId: Number(moduleId)
        }
      }
    })

    return res.status(200).json({
      status: 'success',
      module,
      progress: userProgress
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createModule,
  getModulesByCourse,
  updateModule,
  deleteModule,
  updateProgress,
  getModuleDetail
}
