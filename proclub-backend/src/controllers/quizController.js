import prisma from '../config/prisma.js';

export const createQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, lessonId } = req.body

    if (!question || !options || !correctAnswer || !lessonId) {
      return res.status(400).json({ 
        message: 'Semua field (question, options, correctAnswer, lessonId) wajib diisi!' 
      })
    }

    const lessonExist = await prisma.lesson.findUnique({
      where: { id: Number(lessonId) }
    })

    if (!lessonExist) {
      return res.status(404).json({ message: 'Lesson tidak ditemukan, tidak bisa membuat kuis.' })
    }

    const quiz = await prisma.quiz.create({
      data: {
        question,
        options,
        correctAnswer,
        lessonId: Number(lessonId)
      }
    })

    return res.status(201).json({ 
      message: 'Kuis berhasil disimpan!', 
      quiz 
    })
  } catch (error) {
    console.error('Error Create Quiz:', error)
    return res.status(500).json({ error: error.message })
  }
}

export const updateQuiz = async (req, res) => {
  try {
    const quizId = Number(req.params.id)
    const { question, options, correctAnswer } = req.body
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId, isDeleted: false }
    })
    if (!existingQuiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }
    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        question: question ?? existingQuiz.question,
        options: options ?? existingQuiz.options,
        correctAnswer: correctAnswer ?? existingQuiz.correctAnswer
      }
    })
    res.json({ message: 'Quiz updated successfully', quiz })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteQuiz = async (req, res) => {
  try {
    const quizId = Number(req.params.id)
    await prisma.quiz.update({
      where: { id: quizId },
      data: { isDeleted: true }
    })
    res.json({ message: 'Quiz deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: 'ID Modul tidak ditemukan di parameter' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Format jawaban tidak valid (harus array)' });
    }

    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: parseInt(userId),
          lessonId: parseInt(id)
        }
      }
    });

    const lessonData = await prisma.lesson.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        quizzes: true,
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

    if (!lessonData) {
      return res.status(404).json({ message: 'Lesson tidak ditemukan' });
    }

    let correctAnswersCount = 0;
    const totalQuestions = lessonData.quizzes.length;

    lessonData.quizzes.forEach((quiz) => {
      const userAnswer = answers.find((a) => a.quizId === quiz.id);
      if (userAnswer && String(userAnswer.answer).trim() === String(quiz.correctAnswer).trim()) {
        correctAnswersCount++;
      }
    });

    const score = Math.round((correctAnswersCount / (totalQuestions || 1)) * 100);
    const isPassed = score >= lessonData.kkm;

    await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: parseInt(userId),
          lessonId: parseInt(id),
        },
      },
      update: {
        status: isPassed ? 'COMPLETED' : 'IN_PROGRESS',
        score: score,
        answers: answers,
      },
      create: {
        userId: parseInt(userId),
        lessonId: parseInt(id),
        status: isPassed ? 'COMPLETED' : 'IN_PROGRESS',
        score: score,
        answers: answers,
      },
    });

    let moduleCompleted = false;

    if (isPassed && existingProgress?.status !== 'COMPLETED') {
      const lessonIds = lessonData.module.lessons.map((lesson) => lesson.id);
      const completedLessons = await prisma.userProgress.count({
        where: {
          userId: parseInt(userId),
          lessonId: { in: lessonIds },
          status: 'COMPLETED'
        }
      });

      moduleCompleted = lessonIds.length > 0 && completedLessons === lessonIds.length;

      if (moduleCompleted) {
        await prisma.notification.create({
          data: {
            userId: parseInt(userId),
            title: 'Selamat, module selesai',
            message: `Kamu berhasil menyelesaikan module "${lessonData.module.title}" di learning path "${lessonData.module.course.title}".`,
            type: 'MODULE_COMPLETED',
            link: `/courses/${lessonData.module.courseId}`
          }
        });
      }
    }

    return res.status(200).json({
      status: 'success',
      score,
      isPassed,
      moduleCompleted,
      message: isPassed ? 'Selamat! Kamu lulus kuis.' : 'Skor kamu belum mencukupi.'
    });

  } catch (error) {
    console.error("Quiz Submit Error:", error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

export const getQuizByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params
    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: parseInt(lessonId), isDeleted: false }
    });
    return res.status(200).json({ status: 'success', data: quizzes || [] })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}
