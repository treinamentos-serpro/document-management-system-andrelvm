// Botão de download que aciona o endpoint de download de um documento.

export default function DownloadButton({ documentId, disabled }) {
  const handleDownload = () => {
    window.location.href = `/api/documents/${documentId}/download`;
  };

  return (
    <button type="button" onClick={handleDownload} disabled={disabled}>
      Baixar
    </button>
  );
}
