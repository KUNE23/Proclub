import prisma from '../config/prisma.js';

export default async function checkModuleAccess(req, res, next) {
  try {
    const { id, moduleId } = req.params;
    const userId = req.user.id;

    const targetId = id || moduleId;

    if (!targetId || isNaN(Number(targetId))) {
      return res.status(400).json({ message: 'ID Modul tidak valid atau hilang' });
    }

    const moduleData = await prisma.module.findUnique({
      where: { id: Number(targetId) },
      include: { course: true }
    });

    if (!moduleData) {
      return res.status(404).json({ message: 'Modul tidak ditemukan' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const currentOrder = moduleData.order;

    if (currentOrder === 1) {
      return next();
    }

    const previousModule = await prisma.module.findFirst({
      where: {
        courseId: moduleData.courseId,
        order: currentOrder - 1,
        isDeleted: false
      }
    });

    if (!previousModule) {
      return next();
    }

    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: Number(userId),
          moduleId: previousModule.id
        }
      }
    });

    if (!progress || progress.status !== 'COMPLETED') {
      return res.status(403).json({
        message: 'Kamu harus menyelesaikan modul sebelumnya terlebih dahulu.'
      });
    }

    next();
  } catch (error) {
    console.error('Access Check Error:', error);
    return res.status(500).json({ error: error.message });
  }
}