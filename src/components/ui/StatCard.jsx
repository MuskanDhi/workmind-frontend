import React from 'react';

const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center transition-colors duration-200">
      <div className="bg-brandLight dark:bg-brand/20 w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors duration-200">
        <Icon className="text-brand dark:text-brandLight w-6 h-6" />
      </div>
      <div>
        <div className="text-3xl font-bold text-navy dark:text-white">{value}</div>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">{label}</div>
        {trend && (
          <div className={`text-sm font-medium mt-1 ${trendUp ? 'text-teal' : 'text-coral'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
