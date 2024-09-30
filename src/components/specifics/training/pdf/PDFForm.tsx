import React, { useState } from 'react';

const PDFForm: React.FC = () => {
  const [pdfText, setPdfText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatbotId, setChatbotId] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setFileName(file.name);
      const formData = new FormData();
      formData.append('pdf', file);

      try {
        const response = await fetch('/api/extract-pdf-text', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process PDF');
        }

        const data = await response.json();
        setPdfText(data.text);
      } catch (error) {
        console.error('Error processing PDF:', error);
        setPdfText(`Error processing PDF: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTrainChatbot = async () => {
    if (!chatbotId || !pdfText) {
      alert('Please provide a Chatbot ID and extract PDF text first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/train-chatbot-with-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          content: pdfText,
          source: fileName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to train chatbot');
      }

      alert('Chatbot trained successfully!');
    } catch (error) {
      console.error('Error training chatbot:', error);
      alert(`Error training chatbot: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {isLoading && <p>Loading PDF content...</p>}
      {!isLoading && pdfText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{pdfText}</pre>
          <input
            type="text"
            value={chatbotId}
            onChange={(e) => setChatbotId(e.target.value)}
            placeholder="Enter Chatbot ID"
            className="mt-4 p-2 border rounded"
          />
          <button
            onClick={handleTrainChatbot}
            disabled={!chatbotId || !pdfText}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Train Chatbot
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFForm;
