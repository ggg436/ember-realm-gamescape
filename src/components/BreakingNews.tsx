
import React from 'react';

interface BreakingNewsProps {
  text: string;
}

const BreakingNews: React.FC<BreakingNewsProps> = ({ text }) => {
  return (
    <div className="absolute bottom-24 left-0 right-0 bg-red-800 text-white py-2 px-4">
      <h2 className="text-xl font-bold">{text}</h2>
    </div>
  );
};

export default BreakingNews;
