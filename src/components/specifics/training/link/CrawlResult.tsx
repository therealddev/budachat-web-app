import React from 'react';

interface CrawlResultProps {
  url: string;
  characterCount: number;
  onDelete: () => void;
}

const CrawlResult: React.FC<CrawlResultProps> = ({
  url,
  characterCount,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-full p-2 mb-2">
      <div className="flex-1 flex justify-between items-center mr-4">
        <span className="text-sm font-medium truncate">{url}</span>
        <span className="text-sm text-gray-500">{characterCount} chars</span>
      </div>
      <button
        onClick={onDelete}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm"
      >
        Delete
      </button>
    </div>
  );
};

export default CrawlResult;
