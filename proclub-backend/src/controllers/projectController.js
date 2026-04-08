const prisma = require('../config/prisma')

const submitProject = async (req, res) => {
  try {
    const userId = req.user.id;
    let { linkGithub, note, courseId, moduleId } = req.body;

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
        note,
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
    const userId = req.user.id

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        },
        module: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    
    if(projects.length === 0) {
      return res.status(404).json({ 
        status: 'fail',
        message: 'No projects found for this user' 
      })
    }
    return res.status(200).json({ 
      status: 'success',
      projects 
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const reviewProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id)
    const { status } = req.body

    if (Number.isNaN(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' })
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status }
    })

    res.json({ message: `Project ${status} successfully`, project: updatedProject })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  submitProject,
  getUserProjects,
  reviewProject
}
