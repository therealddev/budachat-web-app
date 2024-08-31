import { useState } from 'react';

interface UploadFormProps {
  onUpload: (businessId: string, content: string) => void;
}

export default function UploadForm({ onUpload }: UploadFormProps) {
  const [businessId, setBusinessId] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload(businessId, content);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={businessId}
        onChange={(e) => setBusinessId(e.target.value)}
        placeholder="Business ID"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Document content"
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
}
