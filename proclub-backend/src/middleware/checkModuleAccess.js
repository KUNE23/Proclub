const prisma = require('../config/prisma')

const checkModuleAccess = async (req, res, next) => {
  try {
    const { courseId, moduleId } = req.params
    const userId = req.user.id

    const moduleData = await prisma.module.findUnique({
      where: { id: Number(moduleId) }
    })

    if (!moduleData) {
      return res.status(404).json({ message: 'Module not found' })
    }

    if (moduleData.order === 1) {
      return next()
    }

    const previousModule = await prisma.module.findFirst({
      where: {
        courseId: Number(courseId),
        order: moduleData.order - 1
      }
    })

    if (!previousModule) {
      return res.status(404).json({ message: 'Previous module not found' })
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: Number(userId),
          moduleId: previousModule.id
        }
      }
    })

    if (!userProgress || userProgress.status !== 'completed') {
      return res.status(403).json({ 
        message: 'Selesaikan modul sebelumnya terlebih dahulu!',
        status: 'locked'
      })
    }

    return next()
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = checkModuleAccess
