import { useState } from 'react';

interface TextFormProps {
  onSubmit: (chatbotId: string, content: string) => Promise<void>;
}

export default function TextForm({ onSubmit }: TextFormProps) {
  const [chatbotId, setChatbotId] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(chatbotId, content);
      setMessage('Document uploaded successfully');
      // Optionally clear the form
      setChatbotId('');
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
          value={chatbotId}
          onChange={(e) => setChatbotId(e.target.value)}
          placeholder="Chatbot ID"
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
