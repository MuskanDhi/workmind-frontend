import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Confetti from './Confetti';

const MOODS = [
  { value: 1, emoji: '😰', label: 'Very Stressed', color: 'hover:bg-red-50   border-red-200   text-red-500'   },
  { value: 2, emoji: '😔', label: 'Not Great',     color: 'hover:bg-orange-50 border-orange-200 text-orange-500' },
  { value: 3, emoji: '😐', label: 'Okay',          color: 'hover:bg-yellow-50 border-yellow-200 text-yellow-500' },
  { value: 4, emoji: '😊', label: 'Good',          color: 'hover:bg-green-50  border-green-200  text-green-500'  },
  { value: 5, emoji: '😄', label: 'Great!',        color: 'hover:bg-emerald-50 border-emerald-200 text-emerald-500' },
];

const SELECTED_COLORS = {
  1: 'bg-red-100    border-red-400    text-red-600',
  2: 'bg-orange-100 border-orange-400 text-orange-600',
  3: 'bg-yellow-100 border-yellow-400 text-yellow-600',
  4: 'bg-green-100  border-green-400  text-green-600',
  5: 'bg-emerald-100 border-emerald-400 text-emerald-600',
};

const DailyMoodCheckin = () => {
  const [todayMood,  setTodayMood]  = useState(null);   
  const [selected,   setSelected]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const { data } = await api.get('/api/mood/today');
        if (data.checkin) setTodayMood(data.checkin.mood);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchToday();
  }, []);

  const handleSubmit = async (val) => {
    setSelected(val);
    setSubmitting(true);
    try {
      await api.post('/api/mood/checkin', { mood: val });
      setTodayMood(val);
      setShowConfetti(true);
      toast.success('Mood logged! ✨');
      setTimeout(() => setShowConfetti(false), 3000);
    } catch {
      toast.error('Failed to save. Try again.');
      setSelected(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  const submittedMood = MOODS.find(m => m.value === todayMood);

  return (
    <>
      {showConfetti && <Confetti duration={2500} />}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          Daily Check-in
        </h3>
        {todayMood ? (
          <div className="flex items-center gap-3">
            <span className="text-4xl">{submittedMood?.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-navy">
                Today you're feeling: <span className="text-brand">{submittedMood?.label}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Check back tomorrow for your next check-in.</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-3">How are you feeling today?</p>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => !submitting && handleSubmit(m.value)}
                  disabled={submitting}
                  className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border-2 transition-all disabled:opacity-60 ${
                    selected === m.value ? SELECTED_COLORS[m.value] : `bg-white ${m.color}`
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DailyMoodCheckin;
