import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Sparkles, ArrowLeft, Calendar, Info } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EXPIRY_OPTIONS = [
  { label: 'No expiry', value: '' },
  { label: '3 days',    value: 3  },
  { label: '7 days',    value: 7  },
  { label: '14 days',   value: 14 },
  { label: '30 days',   value: 30 },
];

const CreateSurvey = () => {
  const navigate   = useNavigate();
  const location   = useLocation();

  const [step,       setStep]       = useState(1);
  const [prompt,     setPrompt]     = useState(location.state?.prefillPrompt || ''); 
  const [expiryDays, setExpiryDays] = useState('');  
  const [loading,    setLoading]    = useState(false);
  const [surveyData, setSurveyData] = useState(null);

  const handleGenerate = async () => {
    if (prompt.trim().length < 10) return toast.error('Prompt is too short (min 10 characters)');
    setLoading(true);
    try {
      const { data } = await api.post('/api/surveys/generate', {
        adminPrompt: prompt,
        expiryDays: expiryDays || undefined,  
      });
      setSurveyData(data.survey);
      setStep(2);
      toast.success('✨ Questions generated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      await api.put(`/api/surveys/${surveyData._id}/edit`, {
        title: surveyData.title,
        questions: surveyData.questions,
      });
      toast.success('Survey saved as draft!');
      navigate('/admin/surveys');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (index, val) => {
    const q = [...surveyData.questions];
    q[index] = { ...q[index], text: val };
    setSurveyData({ ...surveyData, questions: q });
  };

  const removeQuestion = (index) => {
    if (surveyData.questions.length <= 1) return toast.error('Must have at least 1 question');
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.filter((_, i) => i !== index),
    });
  };

  const addQuestion = () => {
    if (surveyData.questions.length >= 7) return toast.error('Max 7 questions allowed');
    setSurveyData({
      ...surveyData,
      questions: [...surveyData.questions, { text: '', answerMaxLength: 500 }],
    });
  };

  const expiryLabel = expiryDays
    ? `Auto-closes in ${expiryDays} days`
    : 'No auto-expiry';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-1">Create New Survey</h2>
            <p className="text-gray-500 text-sm">
              Describe what you want to learn from your team — Mistral AI will generate the questions.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your prompt</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 min-h-[160px] resize-none"
              placeholder="e.g. Check team stress levels after the recent product launch..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              maxLength={600}
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs font-medium ${prompt.length > 540 ? 'text-red-400' : 'text-gray-400'}`}>
                {prompt.length} / 600
              </span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              Survey expiry
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPIRY_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setExpiryDays(opt.value)}
                  className={`text-sm px-4 py-2 rounded-xl border font-medium transition-colors ${
                    expiryDays === opt.value
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40 hover:text-brand'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading || prompt.trim().length < 10}
              className="flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>
          {loading && <LoadingSpinner />}
        </div>
      )}

      {step === 2 && surveyData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-navy">Review Questions</h2>
            <button onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-navy flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          {expiryDays && (
            <div className="flex items-center gap-2 text-xs font-medium text-brand bg-brand/10 px-3 py-2 rounded-lg w-fit">
              <Calendar className="w-3.5 h-3.5" />
              {expiryLabel}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Survey Title</label>
            <input
              type="text"
              value={surveyData.title}
              onChange={e => setSurveyData({ ...surveyData, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-brand/40"
              maxLength={120}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Questions ({surveyData.questions.length}/7)
            </label>
            {surveyData.questions.map((q, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand text-sm shrink-0 mt-2.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={q.text}
                    onChange={e => updateQuestion(i, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                  <button onClick={() => removeQuestion(i)} className="text-xs text-red-400 mt-1 hover:underline">Remove</button>
                </div>
              </div>
            ))}
            {surveyData.questions.length < 7 && (
              <button onClick={addQuestion} className="text-sm text-brand font-medium hover:underline">+ Add another</button>
            )}
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-100">
            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-semibold bg-brand text-white hover:bg-brand/90 transition-colors"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSurvey;
