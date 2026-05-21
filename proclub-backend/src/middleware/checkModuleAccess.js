import prisma from '../config/prisma.js';
import { assertCourseAccess } from '../services/learningAccessService.js';

export default async function checkModuleAccess(req, res, next) {
  try {
    const { id, lessonId } = req.params;
    const userId = req.user.id;

    const targetId = id || lessonId;

    if (!targetId || isNaN(Number(targetId))) {
      return res.status(400).json({ message: 'ID Lesson tidak valid atau hilang' });
    }

    const lessonData = await prisma.lesson.findUnique({
      where: { id: Number(targetId) },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    });

    if (!lessonData) {
      return res.status(404).json({ message: 'Lesson tidak ditemukan' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    await assertCourseAccess({
      userId,
      courseId: lessonData.module.courseId,
      role: req.user.role
    });

    const currentOrder = lessonData.order;

    if (currentOrder === 1) {
      return next();
    }

    const previousLesson = await prisma.lesson.findFirst({
      where: {
        moduleId: lessonData.moduleId,
        order: currentOrder - 1,
        isDeleted: false
      }
    });

    if (!previousLesson) {
      return next();
    }

    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: Number(userId),
          lessonId: previousLesson.id
        }
      }
    });

    if (!progress || progress.status !== 'COMPLETED') {
      return res.status(403).json({
        message: 'Kamu harus menyelesaikan lesson sebelumnya terlebih dahulu.'
      });
    }

    next();
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message
      });
    }

    console.error('Access Check Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
