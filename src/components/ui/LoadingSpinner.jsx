import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullPage, size = 32 }) => {
  const spinner = <Loader2 className="animate-spin text-brand" size={size} />;
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center p-4">{spinner}</div>;
};

export default LoadingSpinner;
