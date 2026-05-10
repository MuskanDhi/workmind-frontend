import React, { useEffect, useState } from 'react';

const getColor = (score) => {
  if (score >= 75) return { stroke: '#2E9E76', text: '#1D6E52', bg: '#E1F5EE', label: 'Thriving' };
  if (score >= 55) return { stroke: '#4A86D8', text: '#185FA5', bg: '#E6F1FB', label: 'Healthy' };
  if (score >= 35) return { stroke: '#E09D27', text: '#854F0B', bg: '#FAEEDA', label: 'Mixed' };
  return { stroke: '#D85A30', text: '#993C1D', bg: '#FAECE7', label: 'Needs Care' };
};

const MoodGauge = ({ score, size = 140 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (score === null || score === undefined) return;
    let start = 0;
    const target = score;
    const step = () => {
      start += Math.ceil((target - start) / 8) || 1;
      setAnimatedScore(start);
      if (start < target) requestAnimationFrame(step);
      else setAnimatedScore(target);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(timer);
  }, [score]);

  if (score === null || score === undefined) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="rounded-full bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span className="text-gray-400 text-sm">—</span>
        </div>
        <span className="text-xs text-gray-400 mt-2">Not analyzed yet</span>
      </div>
    );
  }

  const colors = getColor(score);
  const radius = 52;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * radius;
  // We use 75% of the circle (270°) as the gauge arc
  const arcLength = circumference * 0.75;
  const dashOffset = arcLength - (animatedScore / 100) * arcLength;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 140 140">
        {/* Background track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="10"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(135 ${cx} ${cy})`}
        />
        {/* Animated fill */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(135 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
        {/* Score number */}
        <text
          x={cx} y={cy - 4}
          textAnchor="middle"
          fontSize="26"
          fontWeight="700"
          fill={colors.text}
        >
          {animatedScore}
        </text>
        {/* /100 label */}
        <text
          x={cx} y={cy + 16}
          textAnchor="middle"
          fontSize="11"
          fill="#9CA3AF"
        >
          / 100
        </text>
      </svg>
      <span
        className="text-xs font-semibold px-3 py-1 rounded-full mt-1"
        style={{ background: colors.bg, color: colors.text }}
      >
        {colors.label}
      </span>
    </div>
  );
};

export default MoodGauge;
