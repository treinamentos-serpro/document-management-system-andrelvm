import { useState } from 'react';
import { documentApi } from '../services/documentApi';

export default function UploadComponent({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0] || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const document = await documentApi.uploadDocument(selectedFile, owner);
      setSelectedFile(null);
      event.target.reset();
      onUploadSuccess?.(document);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="owner">Dono</label>
        <input
          id="owner"
          type="text"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Nome do dono (opcional)"
        />
      </div>
      <div>
        <label htmlFor="file">Arquivo</label>
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={uploading}>
        {uploading ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}
