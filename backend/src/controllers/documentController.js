const documentService = require('../services/documentService');

function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo obrigatório não enviado.' });
  }

  try {
    const document = documentService.createDocument({
      id: req.documentId,
      file: req.file,
      owner: req.body.owner,
    });
    return res.status(201).json(document);
  } catch (error) {
    return res.status(500).json({ error: 'Não foi possível processar o upload.' });
  }
}

function listDocuments(req, res) {
  try {
    const documents = documentService.listDocuments();
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ error: 'Não foi possível listar os documentos.' });
  }
}

function downloadDocument(req, res) {
  const document = documentService.getDocumentById(req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  return res.download(document.path, document.originalName, (error) => {
    if (error && !res.headersSent) {
      res.status(404).json({ error: 'Documento não encontrado.' });
    }
  });
}

module.exports = { uploadDocument, listDocuments, downloadDocument };
