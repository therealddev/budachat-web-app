import React, { useEffect } from 'react';
import CrawlResult from './CrawlResult';

interface CrawlData {
  url: string;
  text: string;
}

interface CrawlResultsProps {
  crawlResults: CrawlData[];
  onDelete: (url: string) => void;
}

const CrawlResults: React.FC<CrawlResultsProps> = ({
  crawlResults,
  onDelete,
}) => {
  useEffect(() => {
    console.log('CrawlResults received new data:', crawlResults);
  }, [crawlResults]);

  return (
    <div className="mt-4">
      {crawlResults.map((result, index) => {
        console.log(`Rendering CrawlResult for ${result.url}`);
        return (
          <CrawlResult
            key={index}
            url={result.url}
            characterCount={result.text.length}
            onDelete={() => {
              console.log(`Delete requested for ${result.url}`);
              onDelete(result.url);
            }}
          />
        );
      })}
    </div>
  );
};

export default CrawlResults;
