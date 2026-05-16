const Document = require('../models/Document');

// @desc    Upload a new document
// @route   POST /api/documents
const uploadDocument = async (req, res) => {
  try {
    const { title, content, fileUrl, fileType } = req.body;

    const document = await Document.create({
      title,
      content,
      fileUrl,
      fileType,
    });

    res.status(201).json({
      status: 'success',
      data: document,
    });
  } catch (error) {
    res.status(400);
    throw new Error('Invalid document data');
  }
};

// @desc    Get all documents
// @route   GET /api/documents
const getDocuments = async (req, res) => {
  const documents = await Document.find({});
  res.status(200).json({
    status: 'success',
    results: documents.length,
    data: documents,
  });
};

module.exports = {
  uploadDocument,
  getDocuments,
};
