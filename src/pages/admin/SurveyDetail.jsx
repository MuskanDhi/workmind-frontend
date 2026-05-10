import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/ui/StatusBadge';
import AISummaryCard from '../../components/ui/AISummaryCard';
import AIAnalysisCard from '../../components/ui/AIAnalysisCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DownloadReportBtn from '../../components/ui/DownloadReportBtn';
import { Sparkles, ArrowLeft, ChevronDown, ChevronUp, Users, Brain, User, Building2, Calendar, X, EyeOff, Eye } from 'lucide-react';

const SurveyDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [summarizingPerPerson, setSummarizingPerPerson] = useState(false);
  const [perPersonData, setPerPersonData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showPerPerson, setShowPerPerson] = useState(true);
  const [showQuickSummary, setShowQuickSummary] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/api/surveys/${id}/responses`);
      setData(res.data);
    } catch {
      toast.error('Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  const handleAction = async (action) => {
    try {
      const res = await api.put(`/api/surveys/${id}/${action}`);
      setData(prev => ({ ...prev, survey: { ...prev.survey, status: res.data.survey.status } }));
      toast.success(action === 'publish' ? '🚀 Survey is now LIVE!' : 'Survey closed.');
    } catch (err) {
      toast.error(err.response?.data?.msg || `Failed to ${action}`);
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await api.post(`/api/surveys/${id}/summarize`);
      setData(prev => ({
        ...prev,
        aiSummary: res.data.summary,
        survey: { ...prev.survey, aiSummaryGeneratedAt: res.data.generatedAt },
      }));
      toast.success('Summary generated!');
    } catch {
      toast.error('Failed to summarize. Try again.');
    } finally {
      setSummarizing(false);
    }
  };

  const handleAnalyze = async () => {
    if (data?.total === 0) { toast.error('No responses to analyze yet.'); return; }
    setAnalyzing(true);
    try {
      const res = await api.post(`/api/surveys/${id}/analyze`);
      setData(prev => ({
        ...prev,
        aiAnalysis: res.data.analysis,
        aiAnalysisGeneratedAt: res.data.generatedAt,
      }));
      toast.success('✨ Analysis complete!');
    } catch {
      toast.error('Analysis failed. Try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSummarizePerPerson = async () => {
    if (data?.total === 0) { toast.error('No responses to summarize yet.'); return; }
    setSummarizingPerPerson(true);
    try {
      const res = await api.post(`/api/surveys/${id}/summarize-per-person`);
      setPerPersonData(res.data);
      setShowPerPerson(true);
      toast.success('✨ Individual summaries generated!');
    } catch {
      toast.error('Failed to generate summaries. Try again.');
    } finally {
      setSummarizingPerPerson(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!data) return <div>Not found</div>;

  const { survey, responses, total, aiSummary, aiAnalysis, aiAnalysisGeneratedAt } = data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/admin/surveys" className="text-sm font-medium text-gray-500 hover:text-navy dark:text-gray-400 dark:hover:text-white flex items-center w-fit">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Surveys
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">{survey.title}</h2>
            <div className="flex items-center gap-3">
              <StatusBadge status={survey.status} />
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {total} responses
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {survey.status === 'draft' && (
              <button onClick={() => handleAction('publish')}
                className="flex items-center space-x-2 bg-teal text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal/90 transition-colors shadow-sm">
                <span>🚀 Publish Survey</span>
              </button>
            )}
            {survey.status === 'active' && (
              <button onClick={() => handleAction('close')}
                className="flex items-center space-x-2 bg-coral text-white px-5 py-2.5 rounded-xl font-bold hover:bg-coral/90 transition-colors shadow-sm">
                <span>Close Survey</span>
              </button>
            )}
            <DownloadReportBtn survey={survey} responses={responses} aiSummary={aiSummary} aiAnalysis={aiAnalysis} />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 border-l-4 border-gray-300 dark:border-gray-600 p-4 rounded-r-xl italic text-gray-600 dark:text-gray-400 text-sm">
          "{survey.adminPrompt || 'No prompt provided'}"
        </div>
      </div>

      {/* AI Deep Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
        <h3 className="font-bold text-navy dark:text-white mb-4">AI Deep Analysis</h3>
        <AIAnalysisCard
          analysis={aiAnalysis}
          generatedAt={aiAnalysisGeneratedAt}
          totalResponses={total}
          onAnalyze={handleAnalyze}
          analyzing={analyzing}
          adminPrompt={survey.adminPrompt}
        />
      </div>

      {/* ── INDIVIDUAL SUMMARIES ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-navy dark:text-white text-lg">Individual Response Summaries</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              AI summary per employee · click to see raw answers · overall summary at the bottom
            </p>
          </div>
          <div className="flex items-center gap-2">
            {perPersonData && !summarizingPerPerson && (
              <button
                onClick={() => setShowPerPerson(v => !v)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title={showPerPerson ? 'Hide summaries' : 'Show summaries'}
              >
                {showPerPerson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPerPerson ? 'Hide' : 'Show'}
              </button>
            )}
            <button
              onClick={handleSummarizePerPerson}
              disabled={summarizingPerPerson || total === 0}
              className="flex items-center gap-2 text-sm font-semibold text-brand dark:text-brandLight border border-brand/30 dark:border-brand/40 px-4 py-2 rounded-xl hover:bg-brand hover:text-white transition-colors disabled:opacity-40"
            >
              <Brain className="w-4 h-4" />
              {summarizingPerPerson ? 'Generating...' : perPersonData ? 'Regenerate' : 'Summarize All'}
            </button>
          </div>
        </div>

        {/* Collapsed state */}
        {!summarizingPerPerson && perPersonData && !showPerPerson && (
          <div className="flex items-center justify-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <button
              onClick={() => setShowPerPerson(true)}
              className="flex items-center gap-2 text-sm font-medium text-brand dark:text-brandLight hover:underline"
            >
              <Eye className="w-4 h-4" /> Show {perPersonData.totalResponses} summaries
            </button>
          </div>
        )}

        {/* Spinner */}
        {summarizingPerPerson && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Analyzing each response with AI…</p>
          </div>
        )}

        {/* No responses */}
        {!summarizingPerPerson && !perPersonData && responses.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-12">
            No responses yet. Share the survey with your employees.
          </p>
        )}

        {/* Prompt to generate */}
        {!summarizingPerPerson && !perPersonData && responses.length > 0 && showPerPerson && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <Brain className="w-10 h-10 text-brand/30" />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Click <span className="font-semibold text-brand dark:text-brandLight">Summarize All</span> to generate<br />
              an AI summary for each employee's response
            </p>
          </div>
        )}

        {/* Per-person result cards */}
        {!summarizingPerPerson && perPersonData && showPerPerson && (
          <div className="space-y-4">
            {perPersonData.perPerson.map((person, i) => {
              const cardId = person.responseId || i;
              const isExpanded = expandedId === cardId;
              return (
                <div key={cardId}
                  className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50/30 dark:bg-gray-900/20 transition-colors">

                  {/* Header row */}
                  <div className="px-5 py-4 flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-brand/10 dark:bg-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-brand dark:text-brandLight" />
                    </div>

                    {/* Name + summary */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-navy dark:text-white text-sm">{person.name}</span>
                        {person.department && (
                          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                            <Building2 className="w-3 h-3" />{person.department}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(person.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* AI summary text */}
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand dark:text-brandLight mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{person.summary}</p>
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : cardId)}
                      className="text-xs font-medium text-gray-400 hover:text-brand dark:hover:text-brandLight flex items-center gap-1 shrink-0 mt-1 transition-colors"
                    >
                      {isExpanded
                        ? <><ChevronUp className="w-4 h-4" />Hide</>
                        : <><ChevronDown className="w-4 h-4" />Answers</>}
                    </button>
                  </div>

                  {/* Expandable raw answers */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-1 space-y-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
                      {person.answers.map((a, j) => (
                        <div key={j}>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{a.questionText}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 px-3 py-2.5 rounded-xl">
                            {a.answerText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── OVERALL SUMMARY CARD ── */}
            <div className="mt-2 bg-gradient-to-br from-brand/5 via-brand/8 to-brand/5 dark:from-brand/10 dark:to-brand/20 border border-brand/20 dark:border-brand/30 rounded-2xl p-6 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-brand/15 dark:bg-brand/25 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-brand dark:text-brandLight" />
                </div>
                <div>
                  <h4 className="font-bold text-navy dark:text-white">Overall Summary</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Based on all {perPersonData.totalResponses} response{perPersonData.totalResponses !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-12">
                {perPersonData.overallSummary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick AI Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-navy dark:text-white">Quick AI Summary</h3>
          <div className="flex items-center gap-2">
            {aiSummary && !summarizing && (
              <button
                onClick={() => setShowQuickSummary(v => !v)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title={showQuickSummary ? 'Hide summary' : 'Show summary'}
              >
                {showQuickSummary ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showQuickSummary ? 'Hide' : 'Show'}
              </button>
            )}
            <button
              onClick={handleSummarize}
              disabled={summarizing || total === 0}
              className="flex items-center gap-2 text-sm font-semibold text-brand dark:text-brandLight border border-brand/30 px-4 py-2 rounded-xl hover:bg-brand hover:text-white transition-colors disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              {summarizing ? 'Generating...' : aiSummary ? 'Regenerate' : 'Generate Summary'}
            </button>
          </div>
        </div>
        {showQuickSummary ? (
          <AISummaryCard
            title={null}
            text={summarizing ? null : (aiSummary || '')}
            generatedAt={survey.aiSummaryGeneratedAt}
          />
        ) : (
          aiSummary && (
            <button
              onClick={() => setShowQuickSummary(true)}
              className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-brand dark:text-brandLight hover:border-brand/40 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Show summary
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SurveyDetail;
