const prisma = require('../config/prisma')

const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description
      }
    })

    res.status(201).json({ message: 'Course created', course })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany()

    if(courses.length === 0) {
      return res.status(404).json({ 
        status: 'fail',
        message: 'No courses found' 
      })
    }
    
    return res.status(200).json({ 
      status: 'success',
      courses 
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getCourseById = async (req, res) => {
  try {
    const courseId = Number(req.params.id)

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
      return res.status(404).json({ 
        status: 'fail',
        message: 'Course not found' })
    }

    return res.status(200).json({ 
      status: 'success',
      course 
    })
  } catch (error) {
      return res.status(500).json({ error: error.message })
  }
}

const updateCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.id)
    const { title, description } = req.body

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    if (!title && description === undefined) {
      return res.status(400).json({ message: 'At least one field is required to update' })
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: title ?? existingCourse.title,
        description: description ?? existingCourse.description
      }
    })

    return res.status(200).json({ message: 'Course updated', course })
  } catch (error) {
   return res.status(500).json({ error: error.message })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.id)

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' })
    }

    await prisma.course.delete({
      where: { id: courseId }
    })

    return res.status(200).json({ message: 'Course deleted' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
}
