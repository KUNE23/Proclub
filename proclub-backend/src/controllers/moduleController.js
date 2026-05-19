import prisma from '../config/prisma.js';

const toNumber = (value) => Number(value);

const buildContentBlocksCreate = (contentBlocks = []) => ({
  create: contentBlocks.map((block, index) => ({
    type: block.type || 'TEXT',
    title: block.title?.trim() || null,
    order: block.order !== undefined ? Number(block.order) : index + 1,
    content: block.content
  }))
});

const buildQuizzesCreate = (quizzes = []) => ({
  create: quizzes.map((quiz) => ({
    question: quiz.question,
    options: quiz.options,
    correctAnswer: quiz.correctAnswer
  }))
});

export const createModule = async (req, res) => {
  try {
    const courseId = toNumber(req.params.courseId);
    const { title, description, order } = req.body;

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Module title is required' });
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, isDeleted: false }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const nextOrder =
      order !== undefined
        ? Number(order)
        : (await prisma.module.count({ where: { courseId, isDeleted: false } })) + 1;

    const moduleItem = await prisma.module.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        order: nextOrder,
        courseId
      },
      include: {
        lessons: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' }
        }
      }
    });

    return res.status(201).json({ message: 'Module created', module: moduleItem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getModulesByCourse = async (req, res) => {
  try {
    const courseId = toNumber(req.params.courseId);

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const modules = await prisma.module.findMany({
      where: { courseId, isDeleted: false },
      include: {
        lessons: {
          where: { isDeleted: false },
          include: {
            contentBlocks: {
              where: { isDeleted: false },
              orderBy: { order: 'asc' }
            },
            quizzes: {
              where: { isDeleted: false }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    return res.status(200).json({ status: 'success', modules });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateModule = async (req, res) => {
  try {
    const moduleId = toNumber(req.params.id);
    const { title, description, order } = req.body;

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const existingModule = await prisma.module.findFirst({
      where: { id: moduleId, isDeleted: false }
    });

    if (!existingModule) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const data = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Module title cannot be empty' });
      }
      data.title = title.trim();
    }

    if (description !== undefined) {
      data.description = description?.trim() || null;
    }

    if (order !== undefined) {
      data.order = Number(order);
    }

    const moduleItem = await prisma.module.update({
      where: { id: moduleId },
      data,
      include: {
        lessons: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' }
        }
      }
    });

    return res.json({ status: 'success', message: 'Module updated successfully', module: moduleItem });
  } catch (error) {
    return res.status(500).json({ status: 'fail', message: 'Gagal memperbarui modul', error: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const moduleId = toNumber(req.params.id);

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    await prisma.module.update({
      where: { id: moduleId },
      data: { isDeleted: true }
    });

    return res.json({ message: 'Module deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createLesson = async (req, res) => {
  try {
    const moduleId = toNumber(req.params.moduleId);
    const { title, description, content, order, type, kkm, contentBlocks, quizzes } = req.body;

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Lesson title is required' });
    }

    const moduleItem = await prisma.module.findFirst({
      where: { id: moduleId, isDeleted: false }
    });

    if (!moduleItem) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const lessonType = type || 'MATERIAL';
    const nextOrder =
      order !== undefined
        ? Number(order)
        : (await prisma.lesson.count({ where: { moduleId, isDeleted: false } })) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        content: lessonType === 'QUIZ' ? null : content || null,
        order: nextOrder,
        type: lessonType,
        kkm: kkm !== undefined ? Number(kkm) : 70,
        moduleId,
        contentBlocks: Array.isArray(contentBlocks) && contentBlocks.length > 0
          ? buildContentBlocksCreate(contentBlocks)
          : undefined,
        quizzes: lessonType === 'QUIZ' && Array.isArray(quizzes) && quizzes.length > 0
          ? buildQuizzesCreate(quizzes)
          : undefined
      },
      include: {
        contentBlocks: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' }
        },
        quizzes: {
          where: { isDeleted: false }
        },
        module: {
          include: {
            course: true
          }
        }
      }
    });

    return res.status(201).json({ message: 'Lesson created', lesson });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getLessonsByModule = async (req, res) => {
  try {
    const moduleId = toNumber(req.params.moduleId);

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId, isDeleted: false },
      include: {
        contentBlocks: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' }
        },
        quizzes: {
          where: { isDeleted: false }
        }
      },
      orderBy: { order: 'asc' }
    });

    return res.status(200).json({ status: 'success', lessons });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getLessonDetail = async (req, res) => {
  try {
    const lessonId = toNumber(req.params.id);
    const userId = req.user.id;

    if (Number.isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        isDeleted: false
      },
      include: {
        contentBlocks: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' }
        },
        quizzes: {
          where: { isDeleted: false }
        },
        module: {
          include: {
            course: true
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: Number(userId),
          lessonId
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      lesson,
      progress: userProgress
    });
  } catch (error) {
    console.log('ERROR LESSON DETAIL:');
    console.log(error);

    return res.status(500).json({
      error: error.message
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const lessonId = toNumber(req.params.id);
    const { title, description, content, order, type, quizzes, kkm, contentBlocks } = req.body;

    if (Number.isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

    const existingLesson = await prisma.lesson.findFirst({
      where: { id: lessonId, isDeleted: false }
    });

    if (!existingLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (Array.isArray(quizzes) || type === 'QUIZ') {
        await tx.quiz.deleteMany({ where: { lessonId } });
      }

      if (Array.isArray(contentBlocks)) {
        await tx.contentBlock.deleteMany({ where: { lessonId } });
      }

      const lessonType = type || existingLesson.type;

      return tx.lesson.update({
        where: { id: lessonId },
        data: {
          title: title !== undefined ? title.trim() : undefined,
          description: description !== undefined ? description?.trim() || null : undefined,
          content: lessonType === 'QUIZ' ? null : content,
          order: order !== undefined ? Number(order) : undefined,
          type: lessonType,
          kkm: kkm !== undefined ? Number(kkm) : undefined,
          contentBlocks: Array.isArray(contentBlocks) && contentBlocks.length > 0
            ? buildContentBlocksCreate(contentBlocks)
            : undefined,
          quizzes: lessonType === 'QUIZ' && Array.isArray(quizzes) && quizzes.length > 0
            ? buildQuizzesCreate(quizzes)
            : undefined
        },
        include: {
          contentBlocks: {
            where: { isDeleted: false },
            orderBy: { order: 'asc' }
          },
          quizzes: {
            where: { isDeleted: false }
          }
        }
      });
    });

    return res.json({ status: 'success', message: 'Lesson updated successfully', lesson: result });
  } catch (error) {
    return res.status(500).json({ status: 'fail', message: 'Gagal memperbarui lesson', error: error.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const lessonId = toNumber(req.params.id);

    if (Number.isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { isDeleted: true }
    });

    return res.json({ message: 'Lesson deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const lessonId = toNumber(req.params.id);
    const userId = req.user.id;

    if (Number.isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: Number(userId),
          lessonId
        }
      },
      update: {
        status: 'COMPLETED',
        score: 100
      },
      create: {
        userId: Number(userId),
        lessonId,
        status: 'COMPLETED',
        score: 100
      }
    });

    const currentLesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId
      },
      include: {
        module: true
      }
    });

    return res.status(200).json({
      status: 'success',
      progress,
      completedCourseId: currentLesson?.module.courseId,
      completedModuleId: currentLesson?.moduleId
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
};

export const getQuizResults = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      prisma.userProgress.findMany({
        where: {
          lesson: {
            type: 'QUIZ'
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          lesson: {
            select: {
              id: true,
              title: true,
              kkm: true,
              module: {
                select: {
                  id: true,
                  title: true,
                  course: {
                    select: {
                      id: true,
                      title: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        skip,
        take: limit
      }),

      prisma.userProgress.count({
        where: {
          lesson: {
            type: 'QUIZ'
          }
        }
      })
    ]);

    return res.status(200).json({
      status: 'success',
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil hasil quiz',
      error: error.message
    });
  }
};

