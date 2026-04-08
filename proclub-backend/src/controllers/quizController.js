const prisma = require('../config/prisma')

const createQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, moduleId } = req.body

    if (!question || !options || !correctAnswer || !moduleId) {
      return res
        .status(400)
        .json({ message: 'question, options, correctAnswer, and moduleId are required' })
    }

    if (!Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ message: 'options must be a non-empty array' })
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!module) {
      return res.status(404).json({ message: 'Module not found' })
    }

    const quiz = await prisma.quiz.create({
      data: {
        question,
        options,
        correctAnswer,
        moduleId
      }
    })

    res.status(201).json({ message: 'Quiz created successfully', quiz })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateQuiz = async (req, res) => {
  try {
    const quizId = Number(req.params.id)
    const { question, options, correctAnswer } = req.body

    if (Number.isNaN(quizId)) {
      return res.status(400).json({ message: 'Invalid quiz ID' })
    }

    if (!question && !options && !correctAnswer) {
      return res.status(400).json({ message: 'At least one field is required to update' })
    }

    if (options && (!Array.isArray(options) || options.length === 0)) {
      return res.status(400).json({ message: 'options must be a non-empty array' })
    }

    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId }
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

const deleteQuiz = async (req, res) => {
  try {
    const quizId = Number(req.params.id)

    if (Number.isNaN(quizId)) {
      return res.status(400).json({ message: 'Invalid quiz ID' })
    }

    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

    if (!existingQuiz) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    await prisma.quiz.delete({
      where: { id: quizId }
    })

    res.json({ message: 'Quiz deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz
}
