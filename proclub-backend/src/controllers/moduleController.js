import prisma from '../config/prisma.js';
import { generateCertificateForCourse } from '../services/certificateService.js';
import { assertCourseAccess } from '../services/learningAccessService.js';
import { notifyAdmins } from '../services/adminNotificationService.js';
import redisService from '../services/redisService.js'
import { CACHE_KEYS, CACHE_TTL } from '../config/cache.js'

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

const quizSelectForRole = (role) => ({
  id: true,
  question: true,
  options: true,
  lessonId: true,
  createdAt: true,
  updatedAt: true,
  ...(role === 'admin' || role === 'mentor' ? { correctAnswer: true } : {})
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

    const members = await prisma.user.findMany({
      where: { role: 'member' },
      select: { id: true }
    });

    if (members.length > 0) {
      await prisma.notification.createMany({
        data: members.map((member) => ({
          userId: member.id,
          title: 'Module baru tersedia',
          message: `Module "${moduleItem.title}" sudah ditambahkan di learning path "${course.title}".`,
          type: 'MODULE_CREATED',
          link: `/courses/${courseId}`
        }))
      });
    }

    await redisService.deleteByPattern(
    `${CACHE_KEYS.MODULE_LIST}:*`
    );

    await redisService.deleteByPattern(
        `${CACHE_KEYS.COURSE_MODULES}:*`
    );

    await redisService.deleteByPattern(
        `${CACHE_KEYS.DASHBOARD_MEMBER}:*`
    );

    await redisService.deleteCache(
        CACHE_KEYS.DASHBOARD_ADMIN
    );

    return res.status(201).json({ message: 'Module created', module: moduleItem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getModulesByCourse = async (req, res) => {
  try {
    const courseId = toNumber(req.params.courseId);

    const cacheKey =
    `${CACHE_KEYS.MODULE_LIST}:${courseId}:${req.user.role}`

    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const cached =
await redisService.getCache(cacheKey);

if (cached) {
    return res.status(200).json(cached);
}

    await assertCourseAccess({
      userId: req.user.id,
      courseId,
      role: req.user.role
    });

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
              where: { isDeleted: false },
              select: quizSelectForRole(req.user.role)
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

        const response = {
        status: 'success',
        modules
    }
    await redisService.setCache(
        cacheKey,
        response,
        CACHE_TTL.COURSE
    );

    return res.status(200).json(response);

  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'fail', message: error.message });
    }

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

    await redisService.deleteByPattern(
        `${CACHE_KEYS.MODULE_LIST}:${existingModule.courseId}:*`
      );

      await redisService.deleteByPattern(
        `${CACHE_KEYS.COURSE_MODULES}:*`
      );

      await redisService.deleteByPattern(
        `${CACHE_KEYS.DASHBOARD_MEMBER}:*`
      );

      await redisService.deleteCache(
        CACHE_KEYS.DASHBOARD_ADMIN
      );

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

  await redisService.deleteByPattern(
          `${CACHE_KEYS.MODULE_LIST}:${existingModule.courseId}:*`
        );

        await redisService.deleteByPattern(
          `${CACHE_KEYS.COURSE_MODULES}:*`
        );

        await redisService.deleteByPattern(
          `${CACHE_KEYS.DASHBOARD_MEMBER}:*`
        );

        await redisService.deleteCache(
          CACHE_KEYS.DASHBOARD_ADMIN
        );

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

    await redisService.deleteByPattern(
    `${CACHE_KEYS.LESSON_LIST}:${moduleId}:*`
    );

    await redisService.deleteByPattern(
    `${CACHE_KEYS.COURSE_MODULES}:*`
    );

    await redisService.deleteByPattern(
    `${CACHE_KEYS.DASHBOARD_MEMBER}:*`
    );

    await redisService.deleteCache(
    CACHE_KEYS.DASHBOARD_ADMIN
    );

    return res.status(201).json({ message: 'Lesson created', lesson });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getLessonsByModule = async (req, res) => {
  try {
    const moduleId = toNumber(req.params.moduleId);

    const cacheKey =
      `${CACHE_KEYS.LESSON_LIST}:${moduleId}:${req.user.role}`;

      const cached = await redisService.getCache(cacheKey);

      if (cached) {
        return res.status(200).json(cached);
      }

    if (Number.isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const moduleItem = await prisma.module.findFirst({
      where: { id: moduleId, isDeleted: false },
      select: { courseId: true }
    });

    if (!moduleItem) {
      return res.status(404).json({ message: 'Module not found' });
    }

    await assertCourseAccess({
      userId: req.user.id,
      courseId: moduleItem.courseId,
      role: req.user.role
    });

    const lessons = await prisma.lesson.findMany({
      where: { moduleId, isDeleted: false },
      include: {
        contentBlocks: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' }
        },
        quizzes: {
          where: { isDeleted: false },
          select: quizSelectForRole(req.user.role)
        }
      },
      orderBy: { order: 'asc' }
    });

    const response = {
    status: 'success',
    lessons
      };

      await redisService.setCache(
          cacheKey,
          response,
          CACHE_TTL.LESSON
      );

      return res.status(200).json(response);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'fail', message: error.message });
    }

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
          where: { isDeleted: false },
          select: quizSelectForRole(req.user.role)
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
    console.error(error);

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

    await redisService.deleteByPattern(
      `${CACHE_KEYS.LESSON_LIST}:${existingLesson.moduleId}:*`
    );
    
    await redisService.deleteByPattern(
    `${CACHE_KEYS.COURSE_MODULES}:*`
    );

    await redisService.deleteByPattern(
    `${CACHE_KEYS.DASHBOARD_MEMBER}:*`
    );

    await redisService.deleteCache(
    CACHE_KEYS.DASHBOARD_ADMIN
    );

    return res.json({ status: 'success', message: 'Lesson updated successfully', lesson: result });
  } catch (error) {
    return res.status(500).json({ status: 'fail', message: 'Gagal memperbarui lesson', error: error.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const lessonId = toNumber(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        message: 'Lesson not found'
      });
    }

    if (Number.isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

     const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        isDeleted: false
          }
        });

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { isDeleted: true }
    });

        await redisService.deleteByPattern(
      `${CACHE_KEYS.LESSON_LIST}:${lesson.moduleId}:*`
    );

    await redisService.deleteByPattern(
    `${CACHE_KEYS.COURSE_MODULES}:*`
    );

    await redisService.deleteByPattern(
    `${CACHE_KEYS.DASHBOARD_MEMBER}:*`
    );

    await redisService.deleteCache(
    CACHE_KEYS.DASHBOARD_ADMIN
    );

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

    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: Number(userId),
          lessonId
        }
      }
    });

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
        module: {
          include: {
            course: true,
            lessons: {
              where: { isDeleted: false },
              select: { id: true }
            }
          }
        }
      }
    });

    let moduleCompleted = false;

    if (currentLesson?.module && existingProgress?.status !== 'COMPLETED') {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { name: true, email: true }
      });

      await notifyAdmins({
        title: 'Lesson diselesaikan',
        message: `${user?.name || 'Student'} menyelesaikan lesson "${currentLesson.title}" di module "${currentLesson.module.title}".`,
        type: 'LESSON_COMPLETED',
        link: `/admin/progress`
      });

      const lessonIds = currentLesson.module.lessons.map((lesson) => lesson.id);
      const completedLessons = await prisma.userProgress.count({
        where: {
          userId: Number(userId),
          lessonId: { in: lessonIds },
          status: 'COMPLETED'
        }
      });

      moduleCompleted = lessonIds.length > 0 && completedLessons === lessonIds.length;

      if (moduleCompleted) {
        await prisma.notification.create({
          data: {
            userId: Number(userId),
            title: 'Selamat, module selesai',
            message: `Kamu berhasil menyelesaikan module "${currentLesson.module.title}" di learning path "${currentLesson.module.course.title}".`,
            type: 'MODULE_COMPLETED',
            link: `/courses/${currentLesson.module.courseId}`
          }
        });

        await notifyAdmins({
          title: 'Module diselesaikan',
          message: `${user?.name || 'Student'} menyelesaikan module "${currentLesson.module.title}" di learning path "${currentLesson.module.course.title}".`,
          type: 'MODULE_COMPLETED',
          link: `/admin/progress`
        });
      }

      const courseLessons = await prisma.lesson.findMany({
        where: {
          isDeleted: false,
          module: {
            courseId: currentLesson.module.courseId,
            isDeleted: false
          }
        },
        select: { id: true }
      });
      const courseLessonIds = courseLessons.map((lesson) => lesson.id);
      const completedCourseLessons = await prisma.userProgress.count({
        where: {
          userId: Number(userId),
          lessonId: { in: courseLessonIds },
          status: 'COMPLETED'
        }
      });
      const courseCompleted = courseLessonIds.length > 0 && completedCourseLessons === courseLessonIds.length;

      if (courseCompleted) {
        await notifyAdmins({
          title: 'Learning path diselesaikan',
          message: `${user?.name || 'Student'} menyelesaikan semua lesson di "${currentLesson.module.course.title}".`,
          type: 'COURSE_COMPLETED',
          link: `/admin/progress`
        });
      }
    }

    return res.status(200).json({
      status: 'success',
      progress,
      completedCourseId: currentLesson?.module.courseId,
      completedModuleId: currentLesson?.moduleId,
      moduleCompleted,
      certificate: currentLesson?.module?.courseId
        ? await generateCertificateForCourse(Number(userId), currentLesson.module.courseId)
        : null
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
