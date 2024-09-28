import { useState } from 'react';

interface TextFormProps {
  onSubmit: (businessId: string, content: string) => Promise<void>;
}

export default function TextForm({ onSubmit }: TextFormProps) {
  const [businessId, setBusinessId] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(businessId, content);
      setMessage('Document uploaded successfully');
      // Optionally clear the form
      setBusinessId('');
      setContent('');
    } catch (error) {
      setMessage('Error uploading document');
    }
  };

  return (
    <div>
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
      {message && <p>{message}</p>}
    </div>
  );
}
