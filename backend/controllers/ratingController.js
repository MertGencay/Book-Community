import Rating from '../models/Rating.js';

const createARate = async (req, res) => {
  try {
    const { bookId, rate, userId } = req.body;

    const newRate = await Rating.create({
      rate: rate,
      book: bookId,
      ratedBy: userId,
    });

    return res
      .status(201)
      .json({ message: 'Puanlandırma başarıyla oluşturuldu', rating: newRate });
  } catch (error) {
    console.error('createARate da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

const getRatingsForBook = async (req, res) => {
  try {
    const { id } = req.params;

    const ratings = await Rating.find({ book: id }).populate('ratedBy');
    return res
      .status(201)
      .json({ message: 'Kitap için yorumlar getirildi', ratings });
  } catch (error) {
    console.error('getRatingsForBook da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

export { createARate, getRatingsForBook };
