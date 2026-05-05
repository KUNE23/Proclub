const prisma = require('../config/prisma')
const bcrypt = require('bcrypt')

const getProfile = async (req, res) => {
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

const createUser = async (req, res) => {
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

const getUsers = async (req, res) => {
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

const getUserById = async (req, res) => {
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    const { name, email, password, role } = req.body;

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
    if (password) updateData.password = await bcrypt.hash(password, 10);

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

const deleteUser = async (req, res) => {
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

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

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

module.exports = { getProfile, createUser, getUsers, getUserById, updateUser, deleteUser, updateProfile };