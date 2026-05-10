import React from 'react';

const EmptyState = ({ icon: Icon, heading, subtext, cta, onCta }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-navy mb-2">{heading}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md">{subtext}</p>
      {cta && onCta && (
        <button
          onClick={onCta}
          className="bg-brand text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-brand/90 transition-colors"
        >
          {cta}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
