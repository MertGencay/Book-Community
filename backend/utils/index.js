import mongoose from 'mongoose';

const isValidObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Nesne Kimliği geçerli değil' });
  }
};

const findDocumentById = async (model, id, res) => {
  try {
    const document = await model.findById(id);

    if (!document) {
      res.status(404).json({ error: `${model.modelName} mevcut değil!` });
      return null;
    }
    return document;
  } catch (error) {
    console.error(`${model.modelName} kimliğine göre bulunurken hata oluştu`, error);
    return res.status(500).json({ error: 'Sunucu hatası!' });
  }
};

const checkValidationErrors = (error, res) => {
  const validationErrors = {};

  for (let field in error.errors) {
    validationErrors[field] = error.errors[field].message;
  }

  return res.status(400).json({ error: 'Validation error', validationErrors });
};

export { isValidObjectId, findDocumentById, checkValidationErrors };
