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
    const { name, email, password, role } = req.body;

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
        role: role || 'member'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
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
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalUsers = await prisma.user.count();

    return res.json({
      users,
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

    const { name, email, currentPassword, password, role } = req.body;

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
            module: {
              include: {
                course: true
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

    const formatted = await Promise.all(
      users.map(async (user) => {
        const courses = await prisma.course.findMany({
          where: {
            isDeleted: false
          },
          include: {
            modules: {
              where: {
                isDeleted: false
              }
            }
          }
        })

        const progressByCourse = courses.map((course) => {
          const totalModules = course.modules.length

          const completedModules = course.modules.filter((module) =>
            user.progress.some(
              (p) =>
                p.moduleId === module.id &&
                p.status === 'COMPLETED'
            )
          ).length

          const percentage =
            totalModules > 0
              ? Math.round(
                  (completedModules / totalModules) * 100
                )
              : 0

          return {
            id: course.id,
            title: course.title,
            totalModules,
            completedModules,
            percentage,
            isCompleted: percentage === 100
          }
        })

        const totalModulesAll = progressByCourse.reduce(
          (acc, item) => acc + item.totalModules,
          0
        )

        const completedModulesAll = progressByCourse.reduce(
          (acc, item) => acc + item.completedModules,
          0
        )

        const totalCoursesCompleted = progressByCourse.filter(
          (c) => c.isCompleted
        ).length

        const overallPercentage =
          totalModulesAll > 0
            ? Math.round(
                (completedModulesAll / totalModulesAll) * 100
              )
            : 0

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          totalCoursesCompleted,
          completedModulesAll,
          totalModulesAll,
          overallPercentage,
          courses: progressByCourse
        }
      })
    )

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
            progress: {
              where: {
                userId: Number(userId)
              }
            }
          }
        }
      }
    })

    const formatted = courses
      .map(course => {
        const totalModules = course.modules.length

        const completedModules = course.modules.filter(module =>
          module.progress.some(
            progress => progress.status === 'COMPLETED'
          )
        ).length

        const percentage =
          totalModules > 0
            ? Math.round((completedModules / totalModules) * 100)
            : 0

        return {
          id: course.id,
          title: course.title,
          image: course.image,
          totalModules,
          completedModules,
          percentage
        }
      })
      .filter(course => course.completedModules > 0 || course.percentage > 0)

    return res.status(200).json({
      status: 'success',
      data: formatted
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}