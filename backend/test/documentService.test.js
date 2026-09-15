const { beforeEach, test } = require('node:test');
const assert = require('node:assert');
const documentRepository = require('../src/repositories/documentRepository');
const documentService = require('../src/services/documentService');
const {
  DEFAULT_OWNER,
  buildDocumentRecord,
  normalizeOwner,
} = require('../src/services/documentMetadataService');

beforeEach(() => {
  documentRepository.clear();
});

test('createDocument monta os metadados e persiste o documento', () => {
  const file = {
    originalname: 'contrato.pdf',
    size: 2048,
    path: '/tmp/contrato.pdf',
    mimetype: 'application/pdf',
  };

  const document = documentService.createDocument({
    id: 'doc_1',
    file,
    owner: 'maria',
  });

  assert.strictEqual(document.id, 'doc_1');
  assert.strictEqual(document.originalName, 'contrato.pdf');
  assert.strictEqual(document.size, 2048);
  assert.strictEqual(document.owner, 'maria');
  assert.strictEqual(document.path, '/tmp/contrato.pdf');
  assert.strictEqual(document.mimetype, 'application/pdf');
  assert.ok(Date.parse(document.uploadedAt), 'uploadedAt deve ser uma data ISO válida');
  assert.deepStrictEqual(documentRepository.findAll(), [document]);
});

test('createDocument aplica owner padrão quando o valor não é informado', () => {
  const file = {
    originalname: 'guia.txt',
    size: 128,
    path: '/tmp/guia.txt',
    mimetype: 'text/plain',
  };

  const document = documentService.createDocument({
    id: 'doc_2',
    file,
    owner: '   ',
  });

  assert.strictEqual(document.owner, DEFAULT_OWNER);
});

test('buildDocumentRecord aplica owner padrão no registro final', () => {
  const document = buildDocumentRecord({
    id: 'doc_builder',
    file: {
      originalname: 'resumo.txt',
      size: 64,
      path: '/tmp/resumo.txt',
      mimetype: 'text/plain',
    },
  });

  assert.strictEqual(document.owner, DEFAULT_OWNER);
  assert.strictEqual(document.originalName, 'resumo.txt');
  assert.ok(Date.parse(document.uploadedAt), 'uploadedAt deve ser uma data ISO válida');
});

test('listDocuments retorna os documentos persistidos', () => {
  const firstDocument = documentService.createDocument({
    id: 'doc_3',
    file: {
      originalname: 'primeiro.pdf',
      size: 100,
      path: '/tmp/primeiro.pdf',
      mimetype: 'application/pdf',
    },
    owner: 'ana',
  });
  const secondDocument = documentService.createDocument({
    id: 'doc_4',
    file: {
      originalname: 'segundo.pdf',
      size: 200,
      path: '/tmp/segundo.pdf',
      mimetype: 'application/pdf',
    },
  });

  assert.deepStrictEqual(documentService.listDocuments(), [firstDocument, secondDocument]);
});

test('getDocumentById retorna o documento correspondente', () => {
  const document = documentService.createDocument({
    id: 'doc_5',
    file: {
      originalname: 'manual.pdf',
      size: 512,
      path: '/tmp/manual.pdf',
      mimetype: 'application/pdf',
    },
    owner: 'joao',
  });

  assert.deepStrictEqual(documentService.getDocumentById('doc_5'), document);
  assert.strictEqual(documentService.getDocumentById('inexistente'), undefined);
});

test('normalizeOwner remove espaços e preserva valores válidos', () => {
  assert.strictEqual(normalizeOwner(' carla '), 'carla');
  assert.strictEqual(normalizeOwner('   '), DEFAULT_OWNER);
  assert.strictEqual(normalizeOwner(), DEFAULT_OWNER);
});
