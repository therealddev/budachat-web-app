import React, { useState } from 'react';

const LinkForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCrawl, setIsCrawl] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setScrapedData(null);

    try {
      const endpoint = isCrawl ? '/api/crawl' : '/api/scrape';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isCrawl ? 'crawl' : 'scrape'} the webpage`,
        );
      }

      const data = await response.json();
      setScrapedData(data);
    } catch (err) {
      setError(
        `An error occurred while ${
          isCrawl ? 'crawling' : 'scraping'
        } the webpage`,
      );
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
          placeholder="Enter URL to scrape or crawl"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isCrawl}
            onChange={(e) => setIsCrawl(e.target.checked)}
          />
          Crawl website
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : isCrawl ? 'Crawl' : 'Scrape'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {scrapedData && (
        <div>
          <h3>Scraped Content:</h3>
          <pre>{JSON.stringify(scrapedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LinkForm;
