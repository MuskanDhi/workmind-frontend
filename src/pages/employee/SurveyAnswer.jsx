import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AISummaryCard from '../../components/ui/AISummaryCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Confetti from '../../components/ui/Confetti';
import { ShieldCheck } from 'lucide-react';

const SurveyAnswer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey,     setSurvey]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [currentQ,   setCurrentQ]   = useState(0);
  const [answers,    setAnswers]     = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false); 
  const [submitting, setSubmitting]  = useState(false);
  const [result,     setResult]      = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const { data } = await api.get(`/api/surveys/${id}`);
        setSurvey(data.survey);
        setAnswers(new Array(data.survey.questions.length).fill(''));
      } catch {
        toast.error('Failed to load survey');
        navigate('/employee/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id, navigate]);

  const handleNext = () => {
    if (answers[currentQ].trim().length < 10)
      return toast.error('Please provide a more detailed answer (min 10 characters)');
    setCurrentQ(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (answers[currentQ].trim().length < 10)
      return toast.error('Please provide a more detailed answer (min 10 characters)');

    setSubmitting(true);
    try {
      const formattedAnswers = answers.map((text, i) => ({
        questionIndex: i,
        answerText: text,
      }));

      const { data } = await api.post('/api/responses/submit', {
        surveyId: id,
        answers: formattedAnswers,
        isAnonymous,   
      });

      setResult(data);
      setShowConfetti(true);             
      toast.success('Survey submitted! 🎉');
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to submit');
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!survey) return null;

  if (result) {
    return (
      <>
        {showConfetti && <Confetti duration={3000} />}
        <div className="max-w-2xl mx-auto mt-12 space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-navy mb-2">Thank You!</h2>
            <p className="text-gray-500">
              Your response has been submitted{isAnonymous ? ' anonymously' : ''} successfully.
            </p>
          </div>
          {result.personalSummary && (
            <AISummaryCard title="AI Reflection for You" text={result.personalSummary} />
          )}
          <div className="text-center pt-4">
            <Link to="/employee/dashboard" className="bg-brand text-white px-6 py-3 rounded-xl font-semibold inline-block hover:bg-brand/90 transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  const question      = survey.questions[currentQ];
  const currentAnswer = answers[currentQ];
  const maxChars      = question.answerMaxLength || 500;
  const isLastQ       = currentQ === survey.questions.length - 1;
  const progressPct   = Math.round((currentQ / survey.questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy mb-1">{survey.title}</h2>
        <p className="text-gray-400 text-sm italic">"{survey.adminPrompt}"</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-brand mb-2 uppercase tracking-wider">
            <span>Question {currentQ + 1} of {survey.questions.length}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-brand h-2 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {currentQ === 0 && (
          <div
            onClick={() => setIsAnonymous(a => !a)}
            className={`flex items-center gap-3 cursor-pointer mb-6 px-4 py-3 rounded-xl border-2 transition-all select-none ${
              isAnonymous ? 'border-brand/40 bg-brand/5' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className={`w-10 h-5 rounded-full transition-colors relative ${isAnonymous ? 'bg-brand' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnonymous ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${isAnonymous ? 'text-brand' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${isAnonymous ? 'text-brand' : 'text-gray-500'}`}>
                {isAnonymous ? 'Submitting anonymously' : 'Submit with your name'}
              </span>
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold text-navy mb-6 leading-relaxed">{question.text}</h3>
        <textarea
          value={currentAnswer}
          onChange={e => {
            const a = [...answers];
            a[currentQ] = e.target.value;
            setAnswers(a);
          }}
          placeholder="Share your thoughts here..."
          className="w-full border border-gray-200 rounded-xl p-4 min-h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-brand/40 text-sm"
          maxLength={maxChars}
        />
        <div className="text-right text-xs text-gray-400 mt-1">{currentAnswer.length} / {maxChars}</div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={() => setCurrentQ(prev => prev - 1)} disabled={currentQ === 0 || submitting} className="px-6 py-2.5 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-0">Back</button>
          {isLastQ ? (
            <button onClick={handleSubmit} disabled={submitting || currentAnswer.trim().length < 10} className="px-8 py-2.5 rounded-xl font-semibold bg-brand text-white hover:bg-brand/90 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Survey 🚀'}</button>
          ) : (
            <button onClick={handleNext} disabled={currentAnswer.trim().length < 10} className="px-8 py-2.5 rounded-xl font-semibold bg-brand text-white hover:bg-brand/90 disabled:opacity-50">Next →</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyAnswer;
