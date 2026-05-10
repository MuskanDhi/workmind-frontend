import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState';
import AISummaryCard from '../../components/ui/AISummaryCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ClipboardList, History } from 'lucide-react';
import toast from 'react-hot-toast';
import DailyMoodCheckin from '../../components/ui/DailyMoodCheckin';

const EmployeeDashboard = () => {
  const { user, setUser } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [recentResponses, setRecentResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [surveysRes, responsesRes] = await Promise.all([
          api.get('/api/surveys'),
          api.get('/api/responses/my')
        ]);
        setSurveys(surveysRes.data.surveys);
        setRecentResponses(responsesRes.data.responses.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const toggleAnonymous = async () => {
    try {
      const { data } = await api.put('/api/auth/update', { isAnonymous: !user.isAnonymous });
      setUser(data.user);
      toast.success(data.user.isAnonymous ? 'Anonymous mode enabled' : 'Your name is now visible');
    } catch (error) {
      toast.error('Failed to toggle anonymous mode');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy">
          Hello, {user?.name}
          {user?.isAnonymous && <span className="text-sm font-normal text-gray-500 ml-3">(Anonymous mode on)</span>}
        </h2>
        <p className="text-gray-500 mt-1">Your Employee Dashboard</p>
      </div>

      <DailyMoodCheckin />

      <div>
        <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
          <ClipboardList className="w-5 h-5 mr-2 text-teal" />
          Active Surveys
        </h3>
        {surveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map(s => (
              <div key={s._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <h4 className="font-bold text-navy mb-2 line-clamp-1" title={s.title}>{s.title}</h4>
                <p className="text-sm text-gray-500 italic mb-4 line-clamp-2">"{s.adminPrompt}"</p>
                <div className="text-xs font-semibold text-gray-400 mb-6">{s.questions?.length || 4} Questions</div>
                <div className="mt-auto">
                  {s.alreadyAnswered ? (
                    <button disabled className="w-full bg-gray-100 text-gray-500 font-semibold py-2 rounded-xl cursor-not-allowed">
                      Already Answered ✓
                    </button>
                  ) : (
                    <Link to={`/employee/surveys/${s._id}/answer`} className="w-full block text-center bg-brand text-white font-semibold py-2 rounded-xl hover:bg-brand/90 transition-colors">
                      Answer Survey
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={ClipboardList} heading="No surveys right now" subtext="Check back soon for new surveys from your company." />
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-navy flex items-center">
            <History className="w-5 h-5 mr-2 text-teal" />
            My Recent Responses
          </h3>
          <Link to="/employee/responses" className="text-sm font-medium text-brand hover:text-brand/80">
            View All →
          </Link>
        </div>
        
        {recentResponses.length > 0 ? (
          <div className="space-y-4">
            {recentResponses.map(r => (
              <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-navy mb-2">{r.surveyId?.title || 'Unknown Survey'}</h4>
                <div className="text-xs text-gray-500 mb-4">{new Date(r.createdAt).toLocaleDateString()}</div>
                {r.personalSummary ? (
                  <div className="bg-tealLight/30 p-4 rounded-xl border border-tealLight">
                    <p className="text-sm text-gray-800">{r.personalSummary}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No summary generated.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
            You haven't responded to any surveys yet.
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-navy">Anonymous Mode</h4>
          <p className="text-sm text-gray-500">Hide my name from admin and recruiters for future surveys</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={user?.isAnonymous} onChange={toggleAnonymous} />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
        </label>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
