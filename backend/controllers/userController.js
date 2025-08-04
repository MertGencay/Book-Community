import User from '../models/User.js';
import { isValidObjectId, findDocumentById } from '../utils/index.js';

const updateUser = async (req, res) => {
  const { username, email, password } = req.body;

  const id = req.user._id;

  if (isValidObjectId(id, res)) return;

  try {
    const user = await findDocumentById(User, id, res);
    if (!user) return;

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;

    await user.save();

    res.status(200).json({ message: 'Kullanıcı bilgileri başarıyla güncellendi' });
  } catch (error) {
    console.error('updateUser da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

export { updateUser };
