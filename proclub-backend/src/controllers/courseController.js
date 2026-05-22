import prisma from '../config/prisma.js'
import { assertCourseAccess } from '../services/learningAccessService.js'

export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description?.trim() ?? null,
      },
    })

    return res.status(201).json({
      message: 'Course created successfully',
      course
    })
  } catch (error) {
    console.error('Error createCourse:', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
}

export const getCourses = async (req, res) => {
  try {
    const userId = req.user.id

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [courses, totalData] = await Promise.all([
      prisma.course.findMany({
        where: {
          isDeleted: false
        },
        skip,
        take: limit,

        orderBy: {
          createdAt: 'asc'
        },

        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,

          modules: {
            where: {
              isDeleted: false
            },

            orderBy: {
              order: 'asc'
            },

            select: {
              id: true,
              title: true,
              order: true,
              lessons: {
                where: {
                  isDeleted: false
                },
                orderBy: {
                  order: 'asc'
                },
                select: {
                  id: true,
                  title: true,
                  order: true,
                  type: true
                }
              }
            }
          }
        }
      }),

      prisma.course.count({
        where: {
          isDeleted: false
        }
      })
    ])

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {

        const lessonIds = course.modules.flatMap(m => m.lessons.map(lesson => lesson.id))

        const progresses = await prisma.userProgress.findMany({
          where: {
            userId,
            lessonId: {
              in: lessonIds
            }
          }
        })

        const completedLessons = progresses.filter(
          p => p.status === 'COMPLETED'
        )

        const completedLessonIds = completedLessons.map(
          p => p.lessonId
        )

        const totalLessons = lessonIds.length

        const percentage =
          totalLessons > 0
            ? Math.round((completedLessons.length / totalLessons) * 100)
            : 0

        const activeModule =
          course.modules.find(module =>
            module.lessons.some(lesson => !completedLessonIds.includes(lesson.id))
          ) || null

        const activeLesson =
          activeModule?.lessons.find(lesson => !completedLessonIds.includes(lesson.id)) || null

        const completed = totalLessons > 0 &&
          completedLessons.length === totalLessons

        return {
          ...course,
          totalModules: course.modules.length,
          totalLessons,
          completedLessons: completedLessons.length,
          percentage,
          completed,
          activeModule,
          activeLesson
        }
      })
    )

    return res.status(200).json({
      status: 'success',
      data: coursesWithProgress,
      pagination: {
        totalData,
        totalPages: Math.ceil(totalData / limit),
        currentPage: page,
        limit
      }
    })

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    })
  }
}

export const getPublicCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isDeleted: false
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        _count: {
          select: {
            modules: {
              where: {
                isDeleted: false
              }
            }
          }
        }
      }
    })

    return res.status(200).json({
      status: 'success',
      data: courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        totalModules: course._count.modules
      }))
    })
  } catch (error) {
    console.error('GET PUBLIC COURSES ERROR:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Gagal memuat learning path'
    })
  }
}

export const getCourseById = async (req, res) => {
  try {
    const courseId = Number(req.params.id)

    if (Number.isNaN(courseId)) {
      return res.status(400).json({
        message: 'Invalid course ID'
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      }
    })

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        isDeleted: false
      },
      include: {
        modules: {
          where: {
            isDeleted: false
          },
          orderBy: {
            order: 'asc'
          },
          include: {
            lessons: {
              where: {
                isDeleted: false
              },
              include: {
                contentBlocks: {
                  where: {
                    isDeleted: false
                  },
                  orderBy: {
                    order: 'asc'
                  }
                },
                quizzes: {
                  where: {
                    isDeleted: false
                  }
                }
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
      
        
      }
    })

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found or locked'
      })
    }

    await assertCourseAccess({
      userId: req.user.id,
      courseId,
      role: req.user.role
    })

    return res.status(200).json({
      status: 'success',
      course
    })

  } catch (error) {
  console.error('GET COURSE DETAIL ERROR:', error)

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      status: 'fail',
      message: error.message
    })
  }

  return res.status(500).json({
    error: error.message
  })
}
}

export const updateCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.id)
    const { title, description } = req.body

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    const existingCourse = await prisma.course.findFirst({
      where: { 
        id: courseId,
        isDeleted: false
       }
    })

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const data = {}

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Title cannot be empty' })
      }
      data.title = title.trim()
    }

    if (description !== undefined) {
      data.description = description?.trim() ?? null
    }


    const course = await prisma.course.update({
      where: { id: courseId },
      data,
    })

    return res.status(200).json({ message: 'Course updated', course })
  } catch (error) {
    console.error('Error updateCourse:', error)
    return res.status(500).json({ error: error.message })
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.id)

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    const existingCourse = await prisma.course.findFirst({
      where: { 
        id: courseId,
        isDeleted: false
       }
    })

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' })
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { isDeleted: true }
    })

    return res.status(200).json({ message: 'Course deleted' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}



