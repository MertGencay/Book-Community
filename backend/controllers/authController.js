import User from '../models/User.js';
import { checkValidationErrors } from '../utils/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  try {
    const { email } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ error: 'E-posta zaten mevcut!' });
    }

    const newUser = await User.create(req.body);

    newUser.password = undefined;

    return res
      .status(201)
      .json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: newUser });
  } catch (error) {
    // Handle mongoose validation error
    if (error.name === 'ValidationError') {
      if (checkValidationErrors(error, res)) return;
    } else {
      console.error('Error at register', error);
      return res.status(500).json({ error: 'Sunucu Hatası!' });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    //Check user if exists
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı!' });
    }

    //Check if password correct

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Şifreniz doğru değil!' });
    }

    user.password = undefined;

    const expirationTime = 60 * 60 * 24 * 7;

    //Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: expirationTime,
    });

    return res
      .status(200)
      .json({ message: 'Kullanıcı başarıyla giriş yaptı!', user, token });
  } catch (error) {
    console.error('Giriş sırasında hata', error);
    return res.status(500).json({ error: 'Sunucu Hatası!' });
  }
};

export { register, login };
