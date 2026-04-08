const { z } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formattedErrors = err.flatten().fieldErrors;
      
      return res.status(400).json({
        status: "fail",
        message: "Input tidak valid",
        errors: formattedErrors
      });
    }
    
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};

module.exports = { validate };