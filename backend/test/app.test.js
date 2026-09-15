const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

// Teste de fumaça do seed: garante que o app Express foi exportado.
test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

describe('Endpoints da API do DMS', () => {
  let server;
  let baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  test('GET /health retorna status ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.deepStrictEqual(body, { status: 'ok' });
  });

  let uploadedDocId;
  const sampleContent = 'Conteúdo para teste automatizado do DMS';

  test('POST /api/upload realiza upload de arquivo com sucesso', async () => {
    const formData = new FormData();
    const blob = new Blob([sampleContent], { type: 'text/plain' });
    formData.append('file', blob, 'teste-ci.txt');
    formData.append('owner', 'ci-bot');

    const res = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.ok(body.id, 'o documento deve ter um id');
    assert.strictEqual(body.originalName, 'teste-ci.txt');
    assert.strictEqual(body.owner, 'ci-bot');
    assert.ok(body.size > 0, 'o tamanho deve ser maior que zero');
    assert.ok(body.uploadedAt, 'deve ter data de upload');

    uploadedDocId = body.id;
  });

  test('POST /api/upload retorna 400 quando nenhum arquivo é enviado', async () => {
    const formData = new FormData();
    formData.append('owner', 'ci-bot');

    const res = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('GET /api/documents lista os documentos cadastrados', async () => {
    const res = await fetch(`${baseUrl}/api/documents`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body), 'a resposta deve ser um array');
    const doc = body.find((d) => d.id === uploadedDocId);
    assert.ok(doc, 'o documento recém enviado deve estar na listagem');
    assert.strictEqual(doc.originalName, 'teste-ci.txt');
  });

  test('GET /api/documents/:id/download faz download de documento existente', async () => {
    const res = await fetch(`${baseUrl}/api/documents/${uploadedDocId}/download`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.strictEqual(text, sampleContent);
  });

  test('GET /api/documents/:id/download retorna 404 para documento inexistente', async () => {
    const res = await fetch(`${baseUrl}/api/documents/doc_nao_existente/download`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.ok(body.error);
  });
});
