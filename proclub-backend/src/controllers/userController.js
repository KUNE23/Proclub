import prisma from '../config/prisma.js'
import bcrypt from 'bcrypt'

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, dan password diperlukan' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'member',
        isActive: typeof isActive === 'boolean' ? isActive : true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,   
        isActive: true,
        token: true,
        createdAt: true,
        updatedAt: true     
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalUsers = await prisma.user.count();

    return res.json({
      users: users.map((user) => ({
        ...user,
        token: undefined,
        isOnline: Boolean(user.token)
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    const { name, email, currentPassword, password, role, isActive } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    if (email && email !== userExists.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExists) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
      if (!isActive) updateData.token = null;
    }
    
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Password saat ini diperlukan untuk mengubah password' });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, userExists.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password saat ini salah' });
      }
      
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    if (email && email !== req.user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExists) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (newPassword) {
      const userInDb = await prisma.user.findUnique({ where: { id: req.user.id } });
  
 const isMatch = await bcrypt.compare(currentPassword, userInDb.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Password saat ini salah' });
  }
  updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllUserProgress = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      where: {
        role: 'member'
      },
      include: {
        progress: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const totalUsers = await prisma.user.count({
      where: {
        role: 'member'
      }
    })

    const courses = await prisma.course.findMany({
      where: {
        isDeleted: false
      },
      include: {
        modules: {
          where: {
            isDeleted: false
          },
          include: {
            lessons: {
              where: {
                isDeleted: false
              }
            }
          }
        }
      }
    })

    const formatted = users.map((user) => {
        const completedLessonIds = new Set(
          user.progress
            .filter((progress) => progress.status === 'COMPLETED')
            .map((progress) => progress.lessonId)
        )

        const progressByCourse = courses.map((course) => {
          const lessons = course.modules.flatMap((module) => module.lessons)
          const totalLessons = lessons.length

          const completedLessons = lessons.filter((lesson) =>
            completedLessonIds.has(lesson.id)
          ).length

          const percentage =
            totalLessons > 0
              ? Math.round(
                  (completedLessons / totalLessons) * 100
                )
              : 0

          return {
            id: course.id,
            title: course.title,
            totalModules: course.modules.length,
            totalLessons,
            completedLessons,
            percentage,
            isCompleted: percentage === 100
          }
        })

        const totalLessonsAll = progressByCourse.reduce(
          (acc, item) => acc + item.totalLessons,
          0
        )

        const completedLessonsAll = progressByCourse.reduce(
          (acc, item) => acc + item.completedLessons,
          0
        )

        const totalCoursesCompleted = progressByCourse.filter(
          (c) => c.isCompleted
        ).length

        const overallPercentage =
          totalLessonsAll > 0
            ? Math.round(
                (completedLessonsAll / totalLessonsAll) * 100
              )
            : 0

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          totalCoursesCompleted,
          completedLessonsAll,
          totalLessonsAll,
          overallPercentage,
          courses: progressByCourse
        }
      })

    return res.status(200).json({
      status: 'success',
      data: formatted,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit)
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil progress user',
      error: error.message
    })
  }
}

export const getMyProgress = async (req, res) => {
  try {
    const userId = req.user.id

    const progress = await prisma.userProgress.findMany({
      where: {
        userId
      },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true
              }
            }
          }
        }
      }
    })

    return res.json({
      status: 'success',
      data: progress
    })

  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}

export const completeLesson = async (req, res) => {
  try {
    const userId = req.user.id
    const lessonId = Number(req.params.lessonId)

    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      include: {
        lesson: true
      }
    })

    if (!progress) {
      return res.status(404).json({
        message: 'Progress tidak ditemukan'
      })
    }

    await prisma.userProgress.update({
      where: {
        id: progress.id
      },
      data: {
        status: 'COMPLETED',
        score: 100
      }
    })

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

   
    return res.json({
      status: 'success',
    
    })

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: error.message
    })
  }
}

export const updateUserActivation = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isActive } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'Status aktivasi tidak valid' });
    }

    if (req.user.id === userId && !isActive) {
      return res.status(400).json({ message: 'Admin tidak bisa menonaktifkan akun sendiri' });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive,
        token: isActive ? userExists.token : null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    return res.json({
      message: isActive ? 'Akun berhasil diaktifkan' : 'Akun berhasil dinonaktifkan',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
