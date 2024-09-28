import React, { useState } from 'react';

const LinkForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scrapedText, setScrapedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setScrapedText('');

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape the webpage');
      }

      const data = await response.json();
      setScrapedText(data.text);
    } catch (err) {
      setError('An error occurred while scraping the webpage');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scrape"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Scraping...' : 'Scrape'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {scrapedText && (
        <div>
          <h3>Scraped Content:</h3>
          <pre>{scrapedText}</pre>
        </div>
      )}
    </div>
  );
};

export default LinkForm;
