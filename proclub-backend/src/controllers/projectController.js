import prisma from '../config/prisma.js'
import xss from 'xss'
import { generateCertificateForCourse } from '../services/certificateService.js'

const projectSelect = {
  id: true,
  linkGithub: true,
  note: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  courseId: true,
  user: { select: { id: true, name: true, email: true } },
  course: { select: { id: true, title: true } },
  module: { select: { id: true, title: true } },
  lesson: { select: { id: true, title: true } }
}

export const submitProject = async (req, res) => {
  try {
    const userId = req.user.id;
    let { linkGithub, note, courseId, moduleId, lessonId } = req.body;
    const cleanNote = note ? xss(note) : '';

    courseId = Number(courseId);
    moduleId = moduleId ? Number(moduleId) : null;
    lessonId = lessonId ? Number(lessonId) : null;

    if (!linkGithub || !courseId) {
      return res.status(400).json({ message: 'GitHub repository dan course wajib diisi.' });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (moduleId) {
      const moduleItem = await prisma.module.findUnique({ where: { id: moduleId } });
      if (!moduleItem || moduleItem.courseId !== courseId) {
        return res.status(404).json({ message: 'Module not found in this course' });
      }
    }

    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { module: true }
      });

      if (!lesson || lesson.module.courseId !== courseId) {
        return res.status(404).json({ message: 'Lesson not found in this course' });
      }

      moduleId = lesson.moduleId;
    }

    const project = await prisma.project.create({
      data: {
        linkGithub,
        note: cleanNote,
        userId,
        courseId,
        moduleId,
        lessonId
      }
    });

    return res.status(201).json({ 
      status: 'success',
      message: 'Project submitted successfully', 
      project 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminProjects = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50)
    const status = req.query.status?.toString()
    const search = req.query.search?.toString().trim()

    const where = {}

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { course: { title: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [projects, totalData] = await Promise.all([
      prisma.project.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
        select: projectSelect
      }),
      prisma.project.count({ where })
    ])

    if (projects.length === 0) {
      return res.json({
        status: 'success',
        data: [],
        pagination: {
          currentPage: page,
          totalPages: Math.max(Math.ceil(totalData / limit), 1),
          totalData
        }
      })
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        OR: projects.map((project) => ({
          userId: project.userId,
          courseId: project.courseId
        }))
      },
      select: {
        id: true,
        code: true,
        pdfUrl: true,
        issuedAt: true,
        userId: true,
        courseId: true
      }
    })

    const certificateMap = new Map(
      certificates.map((certificate) => [`${certificate.userId}:${certificate.courseId}`, certificate])
    )

    return res.json({
      status: 'success',
      data: projects.map((project) => ({
        ...project,
        certificate: certificateMap.get(`${project.userId}:${project.courseId}`) || null
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.max(Math.ceil(totalData / limit), 1),
        totalData
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil daftar project', error: error.message })
  }
}

export const getProjectRequirements = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId)

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Course tidak valid.' })
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, isDeleted: false },
      select: { id: true, title: true, description: true }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course tidak ditemukan.' })
    }

    const requirements = await prisma.projectRequirement.findMany({
      where: { courseId, isDeleted: false },
      orderBy: [{ order: 'asc' }, { id: 'asc' }]
    })

    return res.json({ status: 'success', data: { course, requirements } })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil project requirements', error: error.message })
  }
}

export const createProjectRequirement = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId)
    const { title, description, order } = req.body

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Course tidak valid.' })
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, isDeleted: false },
      select: { id: true }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course tidak ditemukan.' })
    }

    const requirement = await prisma.projectRequirement.create({
      data: {
        title: xss(title),
        description: xss(description),
        order: order || 1,
        courseId
      }
    })

    return res.status(201).json({ status: 'success', message: 'Requirement berhasil dibuat', data: requirement })
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat requirement', error: error.message })
  }
}

export const updateProjectRequirement = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { title, description, order } = req.body

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Requirement tidak valid.' })
    }

    const requirement = await prisma.projectRequirement.update({
      where: { id },
      data: {
        title: xss(title),
        description: xss(description),
        order: order || 1
      }
    })

    return res.json({ status: 'success', message: 'Requirement berhasil diperbarui', data: requirement })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Requirement tidak ditemukan.' })
    }

    return res.status(500).json({ message: 'Gagal memperbarui requirement', error: error.message })
  }
}

export const deleteProjectRequirement = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Requirement tidak valid.' })
    }

    await prisma.projectRequirement.update({
      where: { id },
      data: { isDeleted: true }
    })

    return res.json({ status: 'success', message: 'Requirement berhasil dihapus' })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Requirement tidak ditemukan.' })
    }

    return res.status(500).json({ message: 'Gagal menghapus requirement', error: error.message })
  }
}

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const [projects, totalData] = await Promise.all([
      prisma.project.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
        where: { userId },
        select: {
          id: true,
          linkGithub: true,
          status: true,
          createdAt: true,
          course: { select: { id: true, title: true } },
          module: { select: { id: true, title: true } },
          lesson: { select: { id: true, title: true } }
        }
      }),
      prisma.project.count({ where: { userId } })
    ]);

    if (projects.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'No projects found' });
    }

    return res.status(200).json({ 
      status: 'success', 
      data: projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalData / limit),
        totalData
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const reviewProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(projectId)) return res.status(400).json({ message: 'Invalid ID' });
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status },
      select: projectSelect
    });

    const certificate = status === 'approved'
      ? await generateCertificateForCourse(updatedProject.userId, updatedProject.courseId)
      : null

    return res.json({ status: 'success', message: `Project ${status}`, project: updatedProject, certificate });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(500).json({ error: error.message });
  }
};


