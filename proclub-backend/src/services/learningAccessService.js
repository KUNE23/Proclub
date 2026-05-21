import prisma from '../config/prisma.js'

export const getCourseAccessStatus = async (userId, courseId, role) => {
  if (['admin', 'mentor'].includes(role)) return { allowed: true }

  const courses = await prisma.course.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      modules: {
        where: { isDeleted: false },
        select: {
          lessons: {
            where: { isDeleted: false },
            select: { id: true }
          }
        }
      }
    }
  })

  const targetIndex = courses.findIndex((course) => course.id === Number(courseId))
  if (targetIndex <= 0) return { allowed: true }

  const previousLessonIds = courses
    .slice(0, targetIndex)
    .flatMap((course) => course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)))

  if (previousLessonIds.length === 0) return { allowed: true }

  const completedCount = await prisma.userProgress.count({
    where: {
      userId: Number(userId),
      lessonId: { in: previousLessonIds },
      status: 'COMPLETED'
    }
  })

  const allowed = completedCount === previousLessonIds.length

  return {
    allowed,
    message: 'Selesaikan kelas sebelumnya terlebih dahulu.'
  }
}

export const assertCourseAccess = async ({ userId, courseId, role }) => {
  const access = await getCourseAccessStatus(userId, courseId, role)

  if (!access.allowed) {
    const error = new Error(access.message)
    error.statusCode = 403
    throw error
  }

  return true
}
