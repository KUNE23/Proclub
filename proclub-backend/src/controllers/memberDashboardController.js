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
    const courseProgressMap = {}

    progress.forEach(item => {
      const course = item.lesson.module.course

      if (!courseProgressMap[course.id]) {
        courseProgressMap[course.id] = {
          id: course.id,
          title: course.title,
          description: course.description,

          totalLessons: 0,
          completedLessons: 0,
          totalScore: 0,
          scoreCount: 0
        }
      }

      courseProgressMap[course.id].totalLessons++

      if (item.status === 'COMPLETED') {
        courseProgressMap[course.id].completedLessons++
      }

      if (item.score) {
        courseProgressMap[course.id].totalScore += item.score
        courseProgressMap[course.id].scoreCount++
      }
    })

    const coursesProgress = Object.values(courseProgressMap).map(course => {
      const percentage =
        course.totalLessons > 0
          ? Math.round(
              (course.completedLessons / course.totalLessons) * 100
            )
          : 0

      const avgQuiz =
        course.scoreCount > 0
          ? Math.round(course.totalScore / course.scoreCount)
          : 0

      return {
        ...course,
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

    const avgQuizScore =
      progress.length > 0
        ? Math.round(
            progress.reduce((acc, curr) => acc + (curr.score || 0), 0) /
              progress.length
          )
        : 0
        


    return res.status(200).json({
      status: 'success',
      data: {
        user,

        featuredCourse,

        statistics: {
          totalCoursesInProgress,
          totalCompletedLessons,
          avgQuizScore
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
