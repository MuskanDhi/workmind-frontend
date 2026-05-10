import React from 'react';
import { Sparkles } from 'lucide-react';

const AISummaryCard = ({ title, text, generatedAt }) => {
  if (text === null) {
    // Skeleton loading state
    return (
      <div className="bg-gradient-to-br from-brand/10 to-brand/5 border-l-4 border-brand rounded-2xl p-6 relative overflow-hidden">
        <Sparkles className="absolute top-6 right-6 w-5 h-5 text-brand/30" />
        {title && <h4 className="text-sm font-bold text-brand mb-3">{title}</h4>}
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-brand/20 rounded w-3/4"></div>
          <div className="h-4 bg-brand/20 rounded w-full"></div>
          <div className="h-4 bg-brand/20 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand/10 to-brand/5 border-l-4 border-brand rounded-2xl p-6 relative">
      <Sparkles className="absolute top-6 right-6 w-5 h-5 text-brand" />
      {title && <h4 className="text-sm font-bold text-brand mb-3">{title}</h4>}
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line pr-8">
        {text}
      </p>
      {generatedAt && (
        <div className="mt-4 text-xs font-medium text-gray-500">
          Generated {new Date(generatedAt).toLocaleDateString()} at {new Date(generatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      )}
    </div>
  );
};

export default AISummaryCard;
