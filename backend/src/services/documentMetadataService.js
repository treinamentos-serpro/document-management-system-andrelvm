const DEFAULT_OWNER = 'anonimo';

function normalizeOwner(owner) {
  if (typeof owner !== 'string') {
    return DEFAULT_OWNER;
  }

  const trimmedOwner = owner.trim();
  return trimmedOwner || DEFAULT_OWNER;
}

function buildDocumentRecord({ id, file, owner }) {
  return {
    id,
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: normalizeOwner(owner),
    path: file.path,
    mimetype: file.mimetype,
  };
}

module.exports = { buildDocumentRecord, normalizeOwner, DEFAULT_OWNER };
