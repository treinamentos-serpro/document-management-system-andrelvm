const documentRepository = require('../repositories/documentRepository');

function createDocument({ id, file, owner }) {
  const document = {
    id,
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
    path: file.path,
    mimetype: file.mimetype,
  };
  return documentRepository.save(document);
}

function listDocuments() {
  return documentRepository.findAll();
}

function getDocumentById(id) {
  return documentRepository.findById(id);
}

module.exports = { createDocument, listDocuments, getDocumentById };
