import prisma from '../config/prisma.js'

const buildImagePath = (file) => {
  if (!file) return undefined
  return `uploads/courses/${file.filename}`
}

export const createCourse = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' })
    }

    let categoryConnect = undefined
    if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
      const parsedCategoryId = Number(categoryId)
      if (Number.isNaN(parsedCategoryId)) {
        return res.status(400).json({ message: 'categoryId must be a valid integer' })
      }

      const category = await prisma.category.findUnique({
        where: { 
          id: parsedCategoryId,
          isDeleted: false
         }
      })

      if (!category) {
        return res.status(400).json({ message: 'Category not found' })
      }

      categoryConnect = { connect: { id: parsedCategoryId } }
    }

    const image = buildImagePath(req.file)

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description?.trim() ?? null,
        ...(categoryConnect && { category: categoryConnect }),
        ...(image && { image })
      },
      include: {
        category: {
          select: {
            id: true,
            cat_name: true
          }
        }
      }
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
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [courses, totalData] = await Promise.all([
      prisma.course.findMany({
        where: { isDeleted: false },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              cat_name: true
            }
          }
        }
      }),
      prisma.course.count({
        where: { isDeleted: false } 
      })
    ])

    return res.status(200).json({
      status: 'success',
      data: courses,
      pagination: {
        totalData,
        totalPages: Math.ceil(totalData / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = Number(req.params.id)

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    const course = await prisma.course.findUnique({
      where: { 
        id: courseId,
        isDeleted: false
       },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        },
        category: {
          select: {
            id: true,
            cat_name: true
          }
        }
      }
    })

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      })
    }

    return res.status(200).json({
      status: 'success',
      course
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const updateCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.id)
    const { title, description, categoryId } = req.body

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' })
    }

    if (!title && description === undefined && categoryId === undefined && !req.file) {
      return res.status(400).json({ message: 'At least one field or image is required to update' })
    }

    const existingCourse = await prisma.course.findUnique({
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

    if (categoryId !== undefined) {
      if (categoryId === null || categoryId === '') {
        data.category = { disconnect: true }
      } else {
        const parsedCategoryId = Number(categoryId)
        if (Number.isNaN(parsedCategoryId)) {
          return res.status(400).json({ message: 'categoryId must be a valid integer' })
        }

        const category = await prisma.category.findUnique({
          where: { 
            id: parsedCategoryId,
            isDeleted: false
           }
        })

        if (!category) {
          return res.status(400).json({ message: 'Category not found' })
        }

        data.category = { connect: { id: parsedCategoryId } }
      }
    }

    if (req.file) {
      data.image = buildImagePath(req.file)
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data,
      include: {
        category: {
          select: {
            id: true,
            cat_name: true
          }
        }
      }
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

    const existingCourse = await prisma.course.findUnique({
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



