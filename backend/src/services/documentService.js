const documentRepository = require('../repositories/documentRepository');

function buildDocumentMetadata({ id, file, owner }) {
  return {
    id,
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
    path: file.path,
    mimetype: file.mimetype,
  };
}

function createDocument(documentData) {
  const document = buildDocumentMetadata(documentData);
  return documentRepository.save(document);
}

function listDocuments() {
  return documentRepository.findAll();
}

function getDocumentById(id) {
  return documentRepository.findById(id);
}

module.exports = { createDocument, listDocuments, getDocumentById };
