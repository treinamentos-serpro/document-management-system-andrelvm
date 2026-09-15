// Cliente de API para o backend do DMS, consumido via fetch com prefixo /api.

const API_BASE_URL = '/api';

async function parseResponse(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error || 'Erro inesperado ao comunicar com o servidor.';
    throw new Error(message);
  }
  return data;
}

async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  if (owner) {
    formData.append('owner', owner);
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  return parseResponse(response);
}

async function listDocuments() {
  const response = await fetch(`${API_BASE_URL}/documents`);
  return parseResponse(response);
}

function getDownloadUrl(documentId) {
  return `${API_BASE_URL}/documents/${documentId}/download`;
}

export const documentApi = { uploadDocument, listDocuments, getDownloadUrl };
