import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import api from '../../api/axios';
import { TrendingUp } from 'lucide-react';

const MOOD_LABELS = { 1: 'Very Stressed', 2: 'Not Great', 3: 'Okay', 4: 'Good', 5: 'Great' };

const CustomDot = (props) => {
  const { cx, cy, value } = props;
  if (!value) return null;
  const color = value >= 4 ? '#2E9E76' : value >= 3 ? '#4A86D8' : '#D85A30';
  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-navy mb-0.5">{label}</p>
      {val
        ? <>
            <p className="text-gray-500">Avg mood: <span className="font-bold text-navy">{val}/5</span></p>
            <p className="text-brand">{MOOD_LABELS[Math.round(val)]}</p>
          </>
        : <p className="text-gray-400">No check-ins</p>
      }
      <p className="text-gray-400 mt-1">{payload[0]?.payload?.responses || 0} employees</p>
    </div>
  );
};

const MoodTrendChart = () => {
  const [trend,   setTrend]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/mood/weekly-trend');
        setTrend(data.trend);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const hasData = trend.some(d => d.avgMood !== null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-brand" />
        <h3 className="font-bold text-navy text-sm">Team Mood — Last 7 Days</h3>
      </div>

      {loading ? (
        <div className="h-44 animate-pulse bg-gray-100 rounded-xl" />
      ) : !hasData ? (
        <div className="h-44 flex items-center justify-center">
          <p className="text-sm text-gray-400">No mood check-ins yet.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={176}>
          <LineChart data={trend} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <ReferenceLine y={3} stroke="#E5E7EB" strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="avgMood" stroke="#7C3AED" strokeWidth={2.5} dot={<CustomDot />} activeDot={{ r: 6 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
      <div className="flex justify-between mt-3 px-1">
        {['😰 1', '😔 2', '😐 3', '😊 4', '😄 5'].map((label, i) => (
          <span key={i} className="text-xs text-gray-400">{label}</span>
        ))}
      </div>
    </div>
  );
};

export default MoodTrendChart;
