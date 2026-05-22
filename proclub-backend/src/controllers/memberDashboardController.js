import prisma from '../config/prisma.js'

const BASE_URL = process.env.APP_URL || 'http://localhost:3000'

export const getMemberDashboard = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    const courses = await prisma.course.findMany({
      where: {
        isDeleted: false
      },
      include: {
        modules: {
          where: {
            isDeleted: false
          },
          include: {
            lessons: {
              where: {
                isDeleted: false
              }
            }
          }
        }
      }
    })

    const progress = await prisma.userProgress.findMany({
      where: {
        userId
      },
      include: {
        lesson: {
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

    const progressByLessonId = new Map(
      progress.map(item => [item.lessonId, item])
    )

    const coursesProgress = courses.map(course => {
      const lessons = course.modules.flatMap(module => module.lessons)
      const lessonProgress = lessons
        .map(lesson => progressByLessonId.get(lesson.id))
        .filter(Boolean)
      const completedLessons = lessonProgress.filter(item => item.status === 'COMPLETED')
      const scoredProgress = lessonProgress.filter(item => item.score !== null && item.score !== undefined)

      const percentage =
        lessons.length > 0
          ? Math.round(
              (completedLessons.length / lessons.length) * 100
            )
          : 0

      const avgQuiz =
        scoredProgress.length > 0
          ? Math.round(scoredProgress.reduce((total, item) => total + (item.score || 0), 0) / scoredProgress.length)
          : 0

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        totalModules: course.modules.length,
        completedModules: course.modules.filter(module => {
          const moduleLessons = module.lessons
          return moduleLessons.length > 0 && moduleLessons.every(lesson => progressByLessonId.get(lesson.id)?.status === 'COMPLETED')
        }).length,
        totalLessons: lessons.length,
        completedLessons: completedLessons.length,
        percentage,
        avgQuiz
      }
    })

    const featuredCourse =
      coursesProgress.sort((a, b) => b.percentage - a.percentage)[0] || null

    const totalCoursesInProgress = coursesProgress.length

    const totalCompletedLessons = progress.filter(
      p => p.status === 'COMPLETED'
    ).length

    const totalCompletedModules = coursesProgress.reduce(
      (total, course) => total + course.completedModules,
      0
    )

    const avgQuizScore =
      progress.length > 0
        ? Math.round(
            progress.reduce((acc, curr) => acc + (curr.score || 0), 0) /
              progress.length
          )
        : 0

    const completedProgress = progress.filter(item => item.status === 'COMPLETED')
    const xp = completedProgress.reduce((total, item) => total + 100 + Math.round(item.score || 0), 0)
    const levelSize = 1200
    const level = Math.floor(xp / levelSize) + 1
    const currentLevelXp = xp % levelSize
    const formatDateKey = (value) => {
      const date = new Date(value)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }
    const completedDates = new Set(
      completedProgress.map(item => {
        const date = new Date(item.updatedAt)
        date.setHours(0, 0, 0, 0)
        return formatDateKey(date)
      })
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekStart = new Date(today)
    const day = weekStart.getDay()
    weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1))

    const weekStreak = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + index)
      const key = formatDateKey(date)

      return {
        label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index],
        date: key,
        completed: completedDates.has(key)
      }
    })

    let streakDays = 0
    const cursor = new Date(today)

    while (completedDates.has(formatDateKey(cursor))) {
      streakDays++
      cursor.setDate(cursor.getDate() - 1)
    }

    const recentCompleted = completedProgress
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]


    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },

        featuredCourse,

        statistics: {
          totalCoursesInProgress,
          totalCompletedLessons,
          totalCompletedModules,
          avgQuizScore
        },

        learningStats: {
          xp,
          level,
          currentLevelXp,
          nextLevelXp: levelSize,
          streakDays,
          weekStreak,
          recentAchievement: recentCompleted
            ? {
                title: recentCompleted.score >= 100 ? 'Perfect Score' : 'Lesson Complete',
                description: recentCompleted.score >= 100
                  ? 'Dapatkan nilai 100% di quiz terbaru'
                  : `Menyelesaikan ${recentCompleted.lesson.title}`
              }
            : null
        },

      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}
