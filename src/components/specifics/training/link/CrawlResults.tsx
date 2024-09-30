import React from 'react';
import CrawlResult from './CrawlResult';

interface CrawlData {
  url: string;
  text: string;
}

interface CrawlResultsProps {
  crawlResults: CrawlData[];
}

const CrawlResults: React.FC<CrawlResultsProps> = ({ crawlResults }) => {
  return (
    <div className="mt-4">
      {crawlResults.map((result, index) => (
        <CrawlResult
          key={index}
          url={result.url}
          characterCount={result.text.length}
          onDelete={() => {
            /* Implement delete functionality */
          }}
        />
      ))}
    </div>
  );
};

export default CrawlResults;
