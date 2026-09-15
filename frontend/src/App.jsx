import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { documentApi } from './services/documentApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentApi.listDocuments();
      setDocuments(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>
      <section>
        <h2>Enviar documento</h2>
        <UploadComponent onUploadSuccess={loadDocuments} />
      </section>
      <section>
        <h2>Documentos</h2>
        <DocumentList documents={documents} loading={loading} error={error} />
      </section>
    </main>
  );
}
