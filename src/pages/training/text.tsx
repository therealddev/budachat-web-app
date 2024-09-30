import TextForm from '@/components/specifics/training/text/TextForm';
import React from 'react';

const TextTrainingPage = () => {
  const handleUpload = async (businessId: string, content: string) => {
    try {
      const response = await fetch('/api/train-chatbot-with-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, content }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // You can add additional logic here if needed
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error; // Re-throw the error to be handled by TextForm
    }
  };

  return (
    <div>
      <h1>Text Training</h1>
      <TextForm onSubmit={handleUpload} />
    </div>
  );
};

export default TextTrainingPage;
