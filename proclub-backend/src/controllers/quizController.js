import prisma from '../config/prisma.js';

export const createQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, moduleId } = req.body

    if (!question || !options || !correctAnswer || !moduleId) {
      return res.status(400).json({ 
        message: 'Semua field (question, options, correctAnswer, moduleId) wajib diisi!' 
      })
    }

    const moduleExist = await prisma.module.findUnique({
      where: { id: Number(moduleId) }
    })

    if (!moduleExist) {
      return res.status(404).json({ message: 'Modul tidak ditemukan, tidak bisa membuat kuis.' })
    }

    const quiz = await prisma.quiz.create({
      data: {
        question,
        options,
        correctAnswer,
        moduleId: Number(moduleId)
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

    const moduleData = await prisma.module.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        quizzes: true
      }
    });

    if (!moduleData) {
      return res.status(404).json({ message: 'Modul tidak ditemukan' });
    }

    let correctAnswersCount = 0;
    const totalQuestions = moduleData.quizzes.length;

    moduleData.quizzes.forEach((quiz) => {
      const userAnswer = answers.find((a) => a.quizId === quiz.id);
      if (userAnswer && String(userAnswer.answer).trim() === String(quiz.correctAnswer).trim()) {
        correctAnswersCount++;
      }
    });

    const score = Math.round((correctAnswersCount / (totalQuestions || 1)) * 100);
    const isPassed = score >= 70;

    await prisma.userProgress.upsert({
      where: {
        userId_moduleId: {
          userId: parseInt(userId),
          moduleId: parseInt(id),
        },
      },
      update: {
        status: isPassed ? 'COMPLETED' : 'IN_PROGRESS',
        score: score,
        answers: answers,
      },
      create: {
        userId: parseInt(userId),
        moduleId: parseInt(id),
        status: isPassed ? 'COMPLETED' : 'IN_PROGRESS',
        score: score,
        answers: answers,
      },
    });

    return res.status(200).json({
      status: 'success',
      score,
      isPassed,
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

export const getQuizByModule = async (req, res) => {
  try {
    const { moduleId } = req.params
    const quizzes = await prisma.quiz.findMany({
      where: { moduleId: parseInt(moduleId), isDeleted: false }
    });
    return res.status(200).json({ status: 'success', data: quizzes || [] })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}