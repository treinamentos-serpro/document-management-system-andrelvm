const documentRepository = require('../repositories/documentRepository');
const { buildDocumentRecord } = require('./documentMetadataService');

function createDocument({ id, file, owner }) {
  const document = buildDocumentRecord({ id, file, owner });
  return documentRepository.save(document);
}

function listDocuments() {
  return documentRepository.findAll();
}

function getDocumentById(id) {
  return documentRepository.findById(id);
}

module.exports = { createDocument, listDocuments, getDocumentById };
