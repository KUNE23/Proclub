import prisma from '../config/prisma.js'

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const courses = await prisma.course.findMany({
      include: {
        modules: true
      }
    })

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const totalModules = course.modules.length

        const userProgress = await prisma.userProgress.findMany({
          where: {
            userId,
            moduleId: {
              in: course.modules.map((m) => m.id)
            }
          }
        })

        const completedModules = userProgress.filter(
          (p) => p.status === 'completed'
        ).length

        const progressPercentage =
          totalModules > 0 ? (completedModules / totalModules) * 100 : 0

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          progressPercentage: Math.round(progressPercentage),
          completedModules,
          totalModules
        }
      })
    )

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      courses: coursesWithProgress
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const getCourseModulesWithProgress = async (req, res) => {
  try {
    const userId = req.user.id
    const courseId = Number(req.params.courseId)

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const modulesWithProgress = await Promise.all(
      course.modules.map(async (module) => {
        const userProgress = await prisma.userProgress.findUnique({
          where: {
            userId_moduleId: {
              userId,
              moduleId: module.id
            }
          }
        })

        return {
          id: module.id,
          title: module.title,
          content: module.content,
          order: module.order,
          progress: {
            status: userProgress?.status || 'locked',
            score: userProgress?.score || null
          }
        }
      })
    )

    res.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description
      },
      modules: modulesWithProgress
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count()

    const totalCourses = await prisma.course.count({
      where: {
        isDeleted: false
      }
    })

    const totalModules = await prisma.module.count({
      where: {
        isDeleted: false
      }
    })

    const completedProgress = await prisma.userProgress.count({
      where: {
        status: 'COMPLETED'
      }
    })

    const totalProgress = await prisma.userProgress.count()

    const averageProgress =
      totalProgress > 0
        ? Math.round((completedProgress / totalProgress) * 100)
        : 0

    const latestActivities = await prisma.userProgress.findMany({
      take: 8,
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        user: true,
        module: {
          include: {
            course: true
          }
        }
      }
    })

    const recentActivities = latestActivities.map(item => ({
      id: item.id,
      user: item.user.name,
      module: item.module.title,
      course: item.module.course.title,
      status: item.status,
      score: item.score || 0,
      updatedAt: item.updatedAt
    }))

    const engagement = await prisma.user.findMany({
      include: {
        progress: {
          include: {
            module: {
              include: {
                course: true
              }
            }
          }
        }
      }
    })

    const engagementData = engagement.map(user => {
      const totalModulesUser = user.progress.length

      const completedModules = user.progress.filter(
        p => p.status === 'COMPLETED'
      ).length

      const percentage =
        totalModulesUser > 0
          ? Math.round((completedModules / totalModulesUser) * 100)
          : 0

      return {
         id: user.id,
        name: user.name,
        email: user.email,
        completedModules,
        totalModules: totalModulesUser,
        percentage
      }
    })

    return res.status(200).json({
      status: 'success',
      data: {
        statistics: {
          totalUsers,
          totalCourses,
          totalModules,
          averageProgress
        },
        engagement: engagementData,
        recentActivities
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

