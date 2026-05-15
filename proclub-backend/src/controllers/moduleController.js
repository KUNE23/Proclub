import prisma from '../config/prisma.js';

export const createModule = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const { title, content, order, type, quizzes } = req.body;
    const moduleItem = await prisma.module.create({
      data: {
        title,
        content: type === 'QUIZ' ? null : content,
        order: Number(order),
        type: type || 'MATERIAL',
        courseId,
        quizzes: type === 'QUIZ' && quizzes ? { 
          create: quizzes.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        } : undefined
      },
      include: { quizzes: true }
    });
    return res.status(201).json({ message: 'Module created', module: moduleItem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getModulesByCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const modules = await prisma.module.findMany({
      where: { courseId, isDeleted: false },
      include: {
        quizzes: { where: { isDeleted: false } }
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
    const moduleId = Number(req.params.id);
    const { title, content, order, type, quizzes, kkm } = req.body;
    const result = await prisma.$transaction(async (tx) => {
      if (type === 'QUIZ') {
        await tx.quiz.deleteMany({ where: { moduleId: moduleId } });
      }
      return await tx.module.update({
        where: { id: moduleId },
        data: {
          title,
          kkm: kkm ? Number(kkm) : 0,
          content: type === 'QUIZ' ? null : content,
          order: order !== undefined ? Number(order) : undefined,
          type,
          quizzes: type === 'QUIZ' && quizzes && quizzes.length > 0 ? {
            create: quizzes.map(q => ({
              question: q.question,
              options: q.options, 
              correctAnswer: q.correctAnswer
            }))
          } : undefined
        },
        include: { quizzes: true }
      });
    });
    return res.json({ status: 'success', message: 'Module updated successfully', module: result });
  } catch (error) {
    return res.status(500).json({ status: 'fail', message: 'Gagal memperbarui modul', error: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const moduleId = Number(req.params.id);
    await prisma.module.update({
      where: { id: moduleId },
      data: { isDeleted: true }
    });
    return res.json({ message: 'Module deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const moduleId = Number(req.params.id);
    const userId = req.user.id;
    const userProgress = await prisma.userProgress.upsert({
      where: { userId_moduleId: { userId: Number(userId), moduleId: Number(moduleId) } },
      update: { status: 'COMPLETED', score: 100 },
      create: { userId: Number(userId), moduleId: Number(moduleId), status: 'COMPLETED', score: 100 }
    });
    return res.status(200).json({ status: 'success', progress: userProgress });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getModuleDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const moduleItem = await prisma.module.findFirst({
      where: {
        id: Number(id),
        isDeleted: false
      },
      include: {
        quizzes: {
          where: { isDeleted: false }
        },
        course: true
      }
    });

    if (!moduleItem) {
      return res.status(404).json({
        message: 'Module not found'
      });
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: Number(userId),
          moduleId: Number(id)
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      module: moduleItem,
      progress: userProgress
    });

  } catch (error) {
    console.log("ERROR DETAIL:");
    console.log(error);

    return res.status(500).json({
      error: error.message
    });
  }
};