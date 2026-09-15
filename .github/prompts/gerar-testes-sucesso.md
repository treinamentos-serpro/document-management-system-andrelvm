---
description: Gera testes de sucesso com node:test para um módulo do backend.
name: gerar-testes-sucesso
argument-hint: caminho do modulo (ex. backend/src/services/documents.service.js)
agent: agent
---

# Gerar testes do backend

Gere testes automatizados para o módulo `${input:modulo:caminho do modulo}` usando o runner nativo `node:test` e `node:assert`.

Requisitos:

- Cubra os casos de sucesso principais.
- Mantenha os testes isolados e legíveis.
- Coloque os testes em `backend/test-success`.
- Não dependa de serviços externos. Use o filesystem local quando necessário.