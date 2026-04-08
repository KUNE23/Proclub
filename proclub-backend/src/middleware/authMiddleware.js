const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Session expired or logged out' });
    }

    req.user = decoded; 
    return next();
  } catch (error) {
   return res.status(401).json({ 
    status: 'fail',
    message: 'Token Invalid or Expired' 
  });
  }
};

module.exports = authMiddleware