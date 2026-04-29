const prisma = require('../config/prisma');

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    return res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { cat_name } = req.body;

    const category = await prisma.category.create({
      data: {
        cat_name
      }
    });

    return res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        status: 'fail',
        message: 'Category name already exists'
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { cat_name } = req.body;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found'
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        cat_name
      }
    });

    return res.json({
      status: 'success',
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        status: 'fail',
        message: 'Category name already exists'
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

module.exports = { getCategories, createCategory, updateCategory };