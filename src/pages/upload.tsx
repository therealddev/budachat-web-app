import { useState } from 'react';
import UploadForm from '../components/UploadForm';

export default function UploadPage() {
  const [message, setMessage] = useState('');

  const handleUpload = async (businessId: string, content: string) => {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, content }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Upload Document</h1>
      <UploadForm onUpload={handleUpload} />
      {message && <p>{message}</p>}
    </div>
  );
}