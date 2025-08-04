import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Yetkilendirme başlığı eksik!' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Geçersiz yetkilendirme başlık biçimi!' });
  }

  const token = tokenParts[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decodedToken.userId);

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Tokenın süresi doldu!' });
    } else {
      return res.status(500).json({ message: 'Sunucu hatası!' });
    }
  }
};

export { authenticateUser };
