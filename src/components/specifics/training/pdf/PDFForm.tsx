import React, { useState } from 'react';

const PDFForm: React.FC = () => {
  const [pdfText, setPdfText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('pdf', file); // Make sure this matches the field name in the API route

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

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {isLoading && <p>Loading PDF content...</p>}
      {!isLoading && pdfText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{pdfText}</pre>
        </div>
      )}
    </div>
  );
};

export default PDFForm;
