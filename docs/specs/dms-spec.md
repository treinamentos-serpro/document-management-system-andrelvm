# Especificação - Document Management System (DMS)

## 1. Objetivo

Implementar um sistema web de gestão de documentos que permita ao usuário enviar, consultar e baixar arquivos locais de forma simples, segura e compatível com a arquitetura em camadas do projeto.

## 2. Escopo

### 2.1 Dentro do escopo

- Upload de documentos em formato de arquivo
- Listagem de documentos enviados com seus metadados
- Download de documentos por identificador
- Gestão básica por usuário
- Armazenamento local do arquivo em filesystem da aplicação
- Persistência em memória dos metadados na fase inicial
- API REST para integração com frontend
- Interface web simples para interação do usuário

### 2.2 Fora do escopo

- Armazenamento externo em nuvem ou terceiros
- Compartilhamento público de arquivos
- Versionamento de documentos
- Controle avançado de permissões por papel/role
- Busca textual por conteúdo do arquivo
- Recuperação de arquivos excluídos
- Integração com serviços de autenticação externos
- Processamento assíncrono de arquivos ou fila de tarefas
- Histórico completo de auditoria

## 3. Requisitos funcionais

| ID | Requisito | Descrição | Critério de aceite |
| --- | --- | --- | --- |
| RF-01 | Upload de documento | O usuário deve poder enviar um arquivo ao sistema. | O arquivo é recebido via multipart/form-data e registrado com metadados válidos. |
| RF-02 | Listagem de documentos | O usuário deve poder visualizar a lista de documentos enviados. | A API retorna os metadados dos documentos em ordem consistente, sem expor o conteúdo do arquivo. |
| RF-03 | Download de documento | O usuário deve poder baixar um documento pelo identificador do registro. | A API retorna o arquivo binário correspondente ao documento salvo em storage local. |
| RF-04 | Identificação do dono | Cada documento deve manter referência ao usuário que o enviou. | O campo owner identifica unicamente o responsável pelo documento. |
| RF-05 | Identificação única | Cada documento deve possuir um identificador único. | O id é gerado no momento do upload e usado nas operações de consulta e download. |
| RF-06 | Nome original preservado | O sistema deve manter o nome original do arquivo enviado. | O campo originalName representa o nome informado pelo cliente no upload. |
| RF-07 | Registro de metadata | O sistema deve registrar tamanho e data de upload. | Os campos size e uploadedAt são persistidos junto ao documento. |
| RF-08 | Tratamento de erro no upload | O sistema deve responder de forma clara quando o upload falhar ou o arquivo for inválido. | A API retorna erro apropriado com mensagem legível ao cliente. |
| RF-09 | Tratamento de erro no download | O sistema deve responder de forma clara quando o documento solicitado não existir. | A API retorna erro 404 ou equivalente para documento inexistente. |
| RF-10 | Integração com frontend | O frontend deve consumir a API do backend por meio do prefixo /api. | A interface web usa fetch para comunicação com o backend sem depender de acesso direto ao filesystem local. |

### 3.1 Fluxo principal de uso

1. O usuário acessa a interface web.
2. Seleciona um arquivo para upload.
3. O frontend envia o arquivo para o backend via endpoint de upload.
4. O backend valida a requisição, salva o arquivo localmente e registra seus metadados.
5. O sistema retorna ao cliente os dados do documento criado.
6. O usuário pode visualizar a lista de documentos disponíveis.
7. Ao selecionar um documento, o sistema pode solicitar o download do arquivo correspondente.

## 4. Requisitos não funcionais

| ID | Requisito | Descrição |
| --- | --- | --- |
| RNF-01 | Armazenamento local | Os arquivos devem ser gravados no filesystem local da aplicação, na pasta backend/storage, usando multer com diskStorage. |
| RNF-02 | Persistência em memória | Os metadados dos documentos devem ser mantidos em memória nesta fase inicial; não há banco de dados ainda. |
| RNF-03 | Configuração por ambiente | A configuração do sistema deve ser realizada por variáveis de ambiente, seguindo o princípio 12-Factor. |
| RNF-04 | Simplicidade da arquitetura | O backend deve seguir a Clean Architecture simples com separação em routes, controllers, services e repositories. |
| RNF-05 | Frontend reativo | O frontend deve ser desenvolvido em React com componentes funcionais e hooks. |
| RNF-06 | Tratamento de erros | O sistema deve tratar falhas na entrada, leitura e escrita de arquivos de forma segura e legível. |
| RNF-07 | Portabilidade | A solução deve funcionar em ambiente local e ser facilmente executada em desenvolvimento sem depender de provedores externos. |

## 5. Modelo de dados

### 5.1 Entidade Documento

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| id | string | Sim | Identificador único do documento dentro do sistema. |
| originalName | string | Sim | Nome original do arquivo enviado pelo usuário. |
| size | number | Sim | Tamanho do arquivo em bytes. |
| uploadedAt | string | Sim | Data e hora do upload em formato ISO 8601. |
| owner | string | Sim | Identificador do usuário dono do documento. |
| path | string | Sim | Caminho local do arquivo armazenado no filesystem. |
| mimetype | string | Opcional | Tipo MIME detectado do arquivo, quando disponível. |

### 5.2 Observações do modelo

- O modelo de dados do documento é simples e volta-se para a fase inicial de implementação.
- O armazenamento do arquivo e os metadados são tratados de forma separada:
  - arquivo: salvo em backend/storage
  - metadados: mantidos em memória
- O identificador do documento deve ser estável durante a execução da aplicação e ser suficiente para localizar o registro e o arquivo correspondente.

## 6. Contratos de API

### 6.1 Convenções gerais

- Base URL do backend: /api
- Formato de comunicação: JSON para metadados e multipart/form-data para upload de arquivos
- Códigos HTTP esperados:
  - 200 OK para operações de sucesso
  - 201 Created para criação de documento
  - 400 Bad Request para requisições inválidas
  - 404 Not Found para documentos inexistentes
  - 500 Internal Server Error para falhas inesperadas

### 6.2 POST /api/upload

#### Objetivo

Receber um arquivo enviado pelo cliente e registrar o documento no sistema.

#### Requisição

- Método: POST
- Content-Type: multipart/form-data
- Campos:
  - file: arquivo enviado
  - owner: identificador do usuário responsável pelo upload (opcional ou obrigatório conforme estratégia de negócio adotada, mas deve ser suportado no modelo)

#### Exemplo de requisição

```http
POST /api/upload
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="file"; filename="contrato.pdf"
Content-Type: application/pdf

<conteúdo binário>
--boundary
Content-Disposition: form-data; name="owner"

user-001
--boundary--
```

#### Resposta de sucesso

- Status: 201 Created
- Body:

```json
{
  "id": "doc_1726150000000",
  "originalName": "contrato.pdf",
  "size": 245678,
  "uploadedAt": "2026-09-15T12:00:00.000Z",
  "owner": "user-001",
  "path": "/app/backend/storage/doc_1726150000000_contrato.pdf",
  "mimetype": "application/pdf"
}
```

#### Resposta de erro

```json
{
  "error": "Arquivo obrigatório não enviado."
}
```

### 6.3 GET /api/documents

#### Objetivo

Listar todos os documentos cadastrados.

#### Requisição

- Método: GET

#### Resposta de sucesso

- Status: 200 OK
- Body:

```json
[
  {
    "id": "doc_1726150000000",
    "originalName": "contrato.pdf",
    "size": 245678,
    "uploadedAt": "2026-09-15T12:00:00.000Z",
    "owner": "user-001",
    "path": "/app/backend/storage/doc_1726150000000_contrato.pdf",
    "mimetype": "application/pdf"
  },
  {
    "id": "doc_1726150100000",
    "originalName": "relatorio.xlsx",
    "size": 93214,
    "uploadedAt": "2026-09-15T12:01:40.000Z",
    "owner": "user-001",
    "path": "/app/backend/storage/doc_1726150100000_relatorio.xlsx",
    "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }
]
```

#### Resposta de erro

```json
{
  "error": "Não foi possível listar os documentos."
}
```

### 6.4 GET /api/documents/:id/download

#### Objetivo

Efetuar o download do arquivo de um documento específico.

#### Requisição

- Método: GET
- Parâmetro de rota:
  - id: identificador do documento

#### Resposta de sucesso

- Status: 200 OK
- Content-Type: determinado pelo MIME type do arquivo original
- Body: conteúdo binário do arquivo

#### Resposta de erro

```json
{
  "error": "Documento não encontrado."
}
```

### 6.5 Fluxo de integração com frontend

- O frontend deve consumir os endpoints acima usando fetch.
- O prefixo /api será usado para evitar conflito com o Vite durante o desenvolvimento local.
- O upload deve disparar a chamada ao endpoint de upload e exibir retorno em interface amigável.
- A listagem deve popular a tela com documentos e seus metadados.
- O botão de download deve usar o identificador do documento para recuperar o arquivo correspondente.

## 7. Decisões arquiteturais

### 7.1 Arquitetura backend

O backend deve seguir uma Clean Architecture simples com separação em camadas, respeitando a regra de dependência:

- routes: definem os endpoints e delegam a lógica para os controllers
- controllers: recebem e validam a entrada HTTP, retornam respostas
- services: implementam regras de negócio da aplicação
- repositories: acessam e manipulam a persistência em memória e o storage local

Essa organização garante baixa acoplamento entre os componentes e facilita a evolução futura sem quebrar a estrutura existente.

### 7.2 Armazenamento local

- Os arquivos enviados devem ser armazenados localmente na pasta backend/storage.
- A aplicação deve usar multer com diskStorage para gerenciar o upload no filesystem local.
- Os metadados devem ser guardados em memória durante esta fase inicial, com possibilidade de evolução para persistência em banco no futuro.
- O sistema não deve utilizar serviços de terceiros nem armazenamento em nuvem.

### 7.3 Frontend

- O frontend será implementado em React + Vite.
- Os componentes devem seguir a abordagem funcional com hooks.
- A comunicação com o backend será feita por fetch, utilizando a base /api.

### 7.4 Segurança e consistência

- O sistema deve validar a existência do arquivo antes de efetuar o download.
- O sistema deve tratar erros de leitura e gravação em arquivos para evitar falhas silenciosas.
- O processo de upload deve garantir que os metadados do documento sejam registrados após o armazenamento do arquivo, buscando consistência entre arquivo e metadados.

## 8. Plano de execução em etapas

A implementação deve ocorrer em etapas sequenciais, priorizando a base de infraestrutura antes da funcionalidade de negócio e da interface. O plano abaixo descreve a execução em ordem lógica, sem ainda definir a criação dos arquivos de backend e frontend como parte do documento de especificação.

### Etapa 1 - Definição e alinhamento da visão do produto

- Confirmar objetivo, escopo e restrições do sistema
- Validar requisitos funcionais e não funcionais
- Definir modelo de dados inicial e fluxo principal de uso
- Confirmar a arquitetura proposta e os contratos de API

### Etapa 2 - Preparação da base da aplicação

- Configurar o ambiente de execução do projeto
- Definir estrutura de pastas e responsabilidades por camada
- Preparar configuração de variáveis de ambiente
- Definir a convenção de nomes e endpoints da API

### Etapa 3 - Implementação do fluxo de upload

- Definir a integração com multer para armazenamento local
- Garantir a criação do registro de metadados do documento
- Validar o recebimento do arquivo, nome, tamanho e dono
- Verificar respostas de sucesso e erro do endpoint de upload

### Etapa 4 - Implementação da listagem de documentos

- Expor a API para listar documentos cadastrados
- Retornar metadados do documento de forma consistente
- Validar cenário sem documentos e com múltiplos registros

### Etapa 5 - Implementação do download de arquivo

- Resolver o documento pelo identificador
- Recuperar o arquivo no storage local
- Enviar o conteúdo binário com o tipo MIME apropriado
- Tratar documento inexistente e falhas de leitura

### Etapa 6 - Validação funcional do sistema

- Executar cenários de upload, listagem e download
- Validar consistência entre metadados e arquivos salvos
- Confirmar mensagens e status HTTP esperados
- Ajustar comportamentos de erro e validação

### Etapa 7 - Desenvolvimento da interface web

- Criar a interface para upload de documentos
- Exibir a lista de metadados na tela
- Permitir ação de download para cada documento
- Garantir que a comunicação com o backend ocorra por fetch com prefixo /api

### Etapa 8 - Verificação final e documentação de uso

- Validar o fluxo completo do sistema em ambiente local
- Revisar requisitos, contratos e restrições de armazenamento
- Registrar detalhes de operação para suporte e manutenção
- Confirmar que a solução atende ao escopo definido

## 9. Critérios de sucesso

A solução será considerada concluída quando:

- o usuário puder enviar arquivos corretamente;
- os metadados forem registrados e listados;
- o documento puder ser baixado por identificador;
- os arquivos forem armazenados localmente em backend/storage;
- a arquitetura seguir a separação por camadas descrita;
- a aplicação estiver compatível com a estrutura de frontend e backend definida pelo projeto.

## 10. Resumo executivo

O DMS proposto é um sistema simples de gestão de documentos com foco em upload, listagem e download, utilizando armazenamento local com multer e metadados em memória. A arquitetura definida mantém a separação clara entre regras de negócio, acesso a dados e integração HTTP, permitindo evolução incremental sem perder a simplicidade do projeto. O objetivo principal é entregar uma solução funcional e bem estruturada para uso local, respeitando as diretrizes de Clean Architecture e os limites deste primeiro ciclo de desenvolvimento.
