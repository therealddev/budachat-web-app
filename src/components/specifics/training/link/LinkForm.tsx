import React, { useState } from 'react';
import CrawlResults from './CrawlResults';

interface CrawlData {
  url: string;
  text: string;
}

const LinkForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [chatbotId, setChatbotId] = useState('');
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [crawlResults, setCrawlResults] = useState<CrawlData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCrawl, setIsCrawl] = useState(true); // Set to true by default

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setScrapedData(null);

    console.log(`Submitting form: URL = ${url}, isCrawl = ${isCrawl}`);

    try {
      const endpoint = isCrawl ? '/api/crawl' : '/api/scrape';
      console.log(`Fetching from endpoint: ${endpoint}`);

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
      console.log('Received data:', data);

      if (isCrawl) {
        setCrawlResults(data);
        console.log('Updated crawl results:', data);
      } else {
        setScrapedData(data);
        console.log('Updated scraped data:', data);
      }
    } catch (err) {
      const errorMessage = `An error occurred while ${
        isCrawl ? 'crawling' : 'scraping'
      } the webpage`;
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
      console.log('Request completed, loading set to false');
    }
  };

  const handleDeleteCrawlResult = (urlToDelete: string) => {
    console.log(`Deleting crawl result for ${urlToDelete}`);
    setCrawlResults((prevResults) =>
      prevResults.filter((result) => result.url !== urlToDelete),
    );
  };

  const handleTrainChatbot = async () => {
    console.log('Training chatbot with chatbot ID:', chatbotId);
    setIsLoading(true);
    setError('');

    try {
      for (const result of crawlResults) {
        const response = await fetch('/api/train-chatbot-with-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatbotId: chatbotId,
            content: result.text,
            source: result.url,
          }),
        });

        if (!response.ok) {
          console.error(`Failed to process content from ${result.url}`);
          // Optionally, you might want to break the loop or continue based on your requirements
        } else {
          const data = await response.json();
          console.log(`Processed content from ${result.url}:`, data);
        }
      }

      alert('Chatbot training completed successfully!');
    } catch (err) {
      console.error('Error training chatbot:', err);
      setError('An error occurred while training the chatbot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scrape or crawl"
          required
          className="mr-2 p-2 border rounded"
        />
        <label className="mr-2">
          <input
            type="checkbox"
            checked={isCrawl}
            onChange={(e) => setIsCrawl(e.target.checked)}
            className="mr-1"
          />
          Crawl website
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? 'Processing...' : isCrawl ? 'Crawl' : 'Scrape'}
        </button>
      </form>
      {error && <p className="error text-red-500">{error}</p>}
      {isCrawl && (
        <CrawlResults
          crawlResults={crawlResults}
          onDelete={handleDeleteCrawlResult}
        />
      )}
      {!isCrawl && scrapedData && (
        <div>
          <h3 className="text-xl font-bold mb-2">Scraped Content:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(scrapedData, null, 2)}
          </pre>
        </div>
      )}
      <div className="mt-4">
        <input
          type="text"
          value={chatbotId}
          onChange={(e) => setChatbotId(e.target.value)}
          placeholder="Enter Chatbot ID"
          className="mr-2 p-2 border rounded"
        />
        <button
          onClick={handleTrainChatbot}
          disabled={!chatbotId || crawlResults.length === 0}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Train Chatbot
        </button>
      </div>
    </div>
  );
};

export default LinkForm;
