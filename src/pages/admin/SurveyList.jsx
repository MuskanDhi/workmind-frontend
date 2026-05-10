import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { ClipboardList, Trash2, Send, XSquare, Eye, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Small mood score pill shown in the table
const MoodPill = ({ score, burnoutRisk }) => {
  if (score === null || score === undefined) return <span className="text-xs text-gray-300">—</span>;

  const getStyle = (s) => {
    if (s >= 75) return 'bg-emerald-50 text-emerald-700';
    if (s >= 55) return 'bg-blue-50 text-blue-700';
    if (s >= 35) return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-700';
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStyle(score)}`}>
        {score}/100
      </span>
      {burnoutRisk === 'high' && (
        <AlertTriangle className="w-3.5 h-3.5 text-red-500" title="High burnout risk" />
      )}
    </div>
  );
};

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, action: null, surveyId: null,
    title: '', message: '', danger: false, confirmLabel: '',
  });

  const fetchSurveys = async () => {
    try {
      const { data } = await api.get('/api/surveys');
      setSurveys(data.surveys);
    } catch {
      toast.error('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSurveys(); }, []);

  const executeAction = async () => {
    const { action, surveyId } = confirmModal;
    setConfirmModal(m => ({ ...m, isOpen: false }));
    try {
      if (action === 'publish') {
        await api.put(`/api/surveys/${surveyId}/publish`);
        toast.success('Survey published!');
      } else if (action === 'close') {
        await api.put(`/api/surveys/${surveyId}/close`);
        toast.success('Survey closed!');
      } else if (action === 'delete') {
        await api.delete(`/api/surveys/${surveyId}`);
        toast.success('Survey deleted!');
      }
      fetchSurveys();
    } catch (err) {
      toast.error(err.response?.data?.msg || `Failed to ${action}`);
    }
  };

  const filteredSurveys = filter === 'All'
    ? surveys
    : surveys.filter(s => s.status.toLowerCase() === filter.toLowerCase());

  const tabs = ['All', 'Draft', 'Active', 'Closed'];

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy">All Surveys</h2>
        <Link
          to="/admin/surveys/create"
          className="bg-brand text-white px-5 py-2 rounded-xl font-semibold hover:bg-brand/90 transition-colors"
        >
          + Create New
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === t
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-500 hover:text-navy hover:border-gray-300'
            }`}
          >
            {t}
            {t !== 'All' && (
              <span className="ml-1.5 text-xs text-gray-400">
                ({surveys.filter(s => s.status === t.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredSurveys.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Questions</th>
                  <th className="px-6 py-4">Responses</th>
                  <th className="px-6 py-4">Mood Score</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSurveys.map(survey => (
                  <tr key={survey._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-navy max-w-[200px] truncate" title={survey.title}>
                      {survey.title}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={survey.status} />
                    </td>
                    <td className="px-6 py-4">{survey.questions.length}</td>
                    <td className="px-6 py-4">
                      <span className={survey.responseCount > 0 ? 'font-semibold text-navy' : 'text-gray-400'}>
                        {survey.responseCount}
                      </span>
                    </td>
                    {/* ✨ NEW: Mood score column */}
                    <td className="px-6 py-4">
                      <MoodPill
                        score={survey.aiAnalysis?.moodScore}
                        burnoutRisk={survey.aiAnalysis?.burnoutRisk}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(survey.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          to={`/admin/surveys/${survey._id}`}
                          className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {survey.status === 'draft' && (
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true, action: 'publish', surveyId: survey._id,
                              title: 'Publish Survey?',
                              message: 'This will make the survey visible to all employees.',
                              confirmLabel: 'Publish', danger: false,
                            })}
                            className="p-2 text-gray-400 hover:text-teal hover:bg-teal/10 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        {survey.status === 'active' && (
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true, action: 'close', surveyId: survey._id,
                              title: 'Close Survey?',
                              message: 'Employees will no longer be able to respond.',
                              confirmLabel: 'Close Survey', danger: true,
                            })}
                            className="p-2 text-gray-400 hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                            title="Close"
                          >
                            <XSquare className="w-4 h-4" />
                          </button>
                        )}

                        {(survey.status === 'draft' || survey.status === 'closed') && (
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true, action: 'delete', surveyId: survey._id,
                              title: 'Delete Survey?',
                              message: 'This cannot be undone. All responses will be lost.',
                              confirmLabel: 'Delete', danger: true,
                            })}
                            className="p-2 text-gray-400 hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            heading={`No ${filter !== 'All' ? filter.toLowerCase() : ''} surveys`}
            subtext="There are no surveys matching this filter."
          />
        )}
      </div>

      <ConfirmModal
        {...confirmModal}
        onCancel={() => setConfirmModal(m => ({ ...m, isOpen: false }))}
        onConfirm={executeAction}
      />
    </div>
  );
};

export default SurveyList;
