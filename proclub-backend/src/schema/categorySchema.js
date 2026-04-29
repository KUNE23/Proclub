const { z } = require("zod");

const createCategorySchema = z.object({
    cat_name:
    z.string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be at most 100 characters")
});

const updateCategorySchema = z.object({
    cat_name:
    z.string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be at most 100 characters")
});

module.exports = { createCategorySchema, updateCategorySchema };