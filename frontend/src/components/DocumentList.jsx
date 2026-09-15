import DownloadButton from './DownloadButton';

// Formata o tamanho do arquivo em uma unidade legível (KB/MB).
function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '-';
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function formatUploadDate(isoDate) {
  return new Date(isoDate).toLocaleString('pt-BR');
}

export default function DocumentList({ documents, loading, error }) {
  if (loading) {
    return <p>Carregando documentos...</p>;
  }

  if (error) {
    return <p role="alert">Erro ao carregar documentos: {error}</p>;
  }

  if (!documents.length) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tamanho</th>
          <th>Dono</th>
          <th>Enviado em</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((document) => (
          <tr key={document.id}>
            <td>{document.originalName}</td>
            <td>{formatFileSize(document.size)}</td>
            <td>{document.owner}</td>
            <td>{formatUploadDate(document.uploadedAt)}</td>
            <td>
              <DownloadButton documentId={document.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
