import Comment from '../models/Comment.js';

const createAComment = async (req, res) => {
  try {
    const { bookId, content, userId } = req.body;

    const newComment = await Comment.create({
      content: content,
      book: bookId,
      postedBy: userId,
    });

    return res
      .status(201)
      .json({ message: 'Yorum başarıyla oluşturuldu.', comment: newComment });
  } catch (error) {
    console.error('createAComment da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate({
      path: 'postedBy',
      select: 'username',
    });
    res.status(200).json({ message: 'Yorumlar alındı', comments });
  } catch (error) {
    console.error('getAllComments da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

const getCommentsForBook = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ book: id }).populate('postedBy');
    return res
      .status(201)
      .json({ message: 'Kitap için yorumlar getirildi', comments });
  } catch (error) {
    console.error('getCommentsForBook da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};
const getCommentsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ postedBy: id }).populate('book');
    return res
      .status(201)
      .json({ message: 'Kitap için yorumlar getirildi', comments });
  } catch (error) {
    console.error('getCommentsByUser da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

const upvoteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    comment.upvotes.push(userId);

    await comment.save();

    return res.status(200).json({ message: 'Başarıyla olumlu oy verildi', comment });
  } catch (error) {
    console.error('upvoteComment da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};
const downvoteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    comment.upvotes = comment.upvotes.filter(
      (upvote) => upvote.toString() !== userId.toString()
    );

    await comment.save();

    return res.status(200).json({ message: 'Başarıyla olumlu oy verildi', comment });
  } catch (error) {
    console.error('upvoteComment da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

export {
  createAComment,
  getCommentsForBook,
  getCommentsByUser,
  getAllComments,
  upvoteComment,
  downvoteComment,
};
