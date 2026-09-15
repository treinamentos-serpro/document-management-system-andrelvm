// Persistência em memória dos metadados de documentos (fase inicial do DMS).

const documents = [];

function save(document) {
  documents.push(document);
  return document;
}

function findAll() {
  return documents;
}

function findById(id) {
  return documents.find((document) => document.id === id);
}

module.exports = { save, findAll, findById };
