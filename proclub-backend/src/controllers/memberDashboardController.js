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
        modules: true
      }
    })

    const formattedCourses = courses.map(course => ({
      ...course,
      image: course.image
        ? `${BASE_URL}/${course.image}`
        : null
    }))

    const progress = await prisma.userProgress.findMany({
      where: {
        userId
      },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    })
    const courseProgressMap = {}

    progress.forEach(item => {
      const course = item.module.course

      if (!courseProgressMap[course.id]) {
        courseProgressMap[course.id] = {
          id: course.id,
          title: course.title,
          description: course.description,

          image: course.image
            ? `${BASE_URL}/${course.image}`
            : null,

          totalModules: 0,
          completedModules: 0,
          totalScore: 0,
          scoreCount: 0
        }
      }

      courseProgressMap[course.id].totalModules++

      if (item.status === 'COMPLETED') {
        courseProgressMap[course.id].completedModules++
      }

      if (item.score) {
        courseProgressMap[course.id].totalScore += item.score
        courseProgressMap[course.id].scoreCount++
      }
    })

    const coursesProgress = Object.values(courseProgressMap).map(course => {
      const percentage =
        course.totalModules > 0
          ? Math.round(
              (course.completedModules / course.totalModules) * 100
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

    const totalCompletedModules = progress.filter(
      p => p.status === 'COMPLETED'
    ).length

    const avgQuizScore =
      progress.length > 0
        ? Math.round(
            progress.reduce((acc, curr) => acc + (curr.score || 0), 0) /
              progress.length
          )
        : 0
        
    const recommendedCourses = formattedCourses.slice(0, 3)

    return res.status(200).json({
      status: 'success',
      data: {
        user,

        featuredCourse,

        statistics: {
          totalCoursesInProgress,
          totalCompletedModules,
          avgQuizScore
        },

        recommendedCourses
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}