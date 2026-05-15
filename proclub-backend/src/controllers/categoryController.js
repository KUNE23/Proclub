import prisma from '../config/prisma.js'

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false
      }
    });

    return res.status(200).json({
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

export const createCategory = async (req, res) => {
  try {
    const { cat_name } = req.body;

    const category = await prisma.category.create({
      data: {
        cat_name,
        isDeleted: false
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

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { cat_name } = req.body;

    const category = await prisma.category.findFirst({
      where: { 
        id: parseInt(id),
        isDeleted: false
      }
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found or already deleted'
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

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { 
        id: parseInt(id),
        isDeleted: false
      }
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found or already deleted'
      });
    }

    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true }
    });

    return res.json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};

