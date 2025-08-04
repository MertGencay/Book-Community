import Book from '../models/Book.js';
import {
  isValidObjectId,
  findDocumentById,
  checkValidationErrors,
} from '../utils/index.js';

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('getAllBooks da hata!', error);
    return res.status(500).json({ error: 'Sunucu Hatası!' });
  }
};

const getBooksByUploader = async (req, res) => {
  try {
    const uploaderId = req.user._id;

    const books = await Book.find({ uploader: uploaderId });
    res.status(200).json(books);
  } catch (error) {
    console.error('getBooksByUploader da hata!', error);
    return res.status(500).json({ error: 'Sunucu Hatası!' });
  }
};

const getABook = async (req, res) => {
  const { id } = req.params;

  if (isValidObjectId(id, res)) return;

  try {
    const book = await findDocumentById(Book, id, res);
    if (!book) return;

    res.status(200).json(book);
  } catch (error) {
    console.error('getABook da hata!', error);
    return res.status(500).json({ error: 'Sunucu Hatası!' });
  }
};

const createABook = async (req, res) => {
  try {
    const { title, author, description, pageNumber } = req.body;

    const uploader = req.user._id;

    const existingBook = await Book.findOne({ title, author });

    if (existingBook) {
      return res
        .status(400)
        .json({ error: 'Aynı isimli ve yazarlı bir kitap zaten mevcut!' });
    }

    const newBook = await Book.create({
      title,
      author,
      description,
      pageNumber,
      uploader,
    });

    return res
      .status(201)
      .json({ message: 'Kitap başarıyla oluşturuldu', book: newBook });
  } catch (error) {
    // Handle mongoose validation error
    if (error.name === 'ValidationError') {
      if (checkValidationErrors(error, res)) return;
    } else {
      console.error('createBook da hata!', error);
      return res.status(500).json({ error: 'Sunucu hatası!' });
    }
  }
};

const updateABook = async (req, res) => {
  const { id } = req.params;
  const { title, author, description, pageNumber } = req.body;

  if (isValidObjectId(id, res)) return;

  try {
    const book = await findDocumentById(Book, id, res);
    if (!book) return;

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.pageNumber = pageNumber || book.pageNumber;

    await book.save();

    res.status(200).json({ message: 'Kitap başarıyla güncellendi', book });
  } catch (error) {
    console.error('updateABook da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

const deleteABook = async (req, res) => {
  const { id } = req.params;

  if (isValidObjectId(id, res)) return;

  try {
    const book = await findDocumentById(Book, id, res);
    if (!book) return;

    await book.deleteOne();
    res.status(200).json({ message: 'Kitap başarıyla silindi!' });
  } catch (error) {
    console.error('deleteABook da hata!', error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

export {
  getAllBooks,
  createABook,
  getABook,
  updateABook,
  deleteABook,
  getBooksByUploader,
};
