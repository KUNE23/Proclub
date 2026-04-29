const prisma = require('../config/prisma')
const xss = require('xss');
const submitProject = async (req, res) => {
  try {
    const userId = req.user.id;
    let { linkGithub, note, courseId, moduleId } = req.body;
    const cleanNote = xss(note);

    courseId = Number(courseId);
    moduleId = moduleId ? Number(moduleId) : null;

    if (!linkGithub || !courseId) {
      return res.status(400).json({ message: 'linkGithub and courseId are required' });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (moduleId) {
      const moduleItem = await prisma.module.findUnique({ where: { id: moduleId } });
      if (!moduleItem || moduleItem.courseId !== courseId) {
        return res.status(404).json({ message: 'Module not found in this course' });
      }
    }

    const project = await prisma.project.create({
      data: {
        linkGithub,
        note: cleanNote,
        userId,
        courseId,
        moduleId 
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

const getUserProjects = async (req, res) => {
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
          module: { select: { id: true, title: true } }
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

const reviewProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(projectId)) return res.status(400).json({ message: 'Invalid ID' });
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status },
      select: { id: true, status: true } 
    });

    return res.json({ status: 'success', message: `Project ${status}`, project: updatedProject });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitProject,
  getUserProjects,
  reviewProject
}
