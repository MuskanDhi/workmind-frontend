import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    draft: 'bg-amberLight text-amber',
    active: 'bg-tealLight text-teal',
    closed: 'bg-coralLight text-coral',
  };

  const currentStyle = styles[status] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${currentStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
