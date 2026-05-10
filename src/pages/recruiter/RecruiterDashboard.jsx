import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import AISummaryCard from '../../components/ui/AISummaryCard';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Users, FileText, MessageSquare, TrendingUp, Sparkles, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, surveysRes] = await Promise.all([
          api.get('/api/recruiter/stats'),
          api.get('/api/recruiter/surveys')
        ]);
        setStats(statsRes.data);
        setSurveys(surveysRes.data.surveys.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateOverview = async () => {
    setGenerating(true);
    try {
      const { data } = await api.get('/api/recruiter/overview');
      setOverview(data);
      toast.success('Overview generated');
    } catch (error) {
      toast.error('Failed to generate overview');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy">Recruiter Analytics</h2>
        <p className="text-gray-500 mt-1">Executive overview of company wellness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Employees" value={stats?.totalEmployees || 0} />
        <StatCard icon={FileText} label="Total Surveys" value={stats?.totalSurveys || 0} />
        <StatCard icon={MessageSquare} label="Responses Collected" value={stats?.totalResponses || 0} />
        <StatCard icon={TrendingUp} label="Participation Rate" value={stats?.participationRate || '0%'} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-navy flex items-center">
            <BrainIcon className="w-5 h-5 mr-2 text-brand" />
            AI Executive Overview
          </h3>
          <button 
            onClick={generateOverview} 
            disabled={generating}
            className="flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-navy/90 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Overview</span>
          </button>
        </div>

        {generating ? (
          <AISummaryCard text={null} />
        ) : overview ? (
          <div className="bg-gradient-to-br from-navy to-mid border-l-4 border-brand rounded-2xl p-6 relative">
            <Sparkles className="absolute top-6 right-6 w-5 h-5 text-brandLight/50" />
            <h4 className="text-sm font-bold text-brandLight mb-3">Executive Summary — {overview.companyName}</h4>
            <p className="text-sm text-gray-100 leading-relaxed pr-8">{overview.overview}</p>
            <div className="mt-4 text-xs font-medium text-gray-400">
              Analyzed from {overview.totalSurveysAnalyzed} recent surveys
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
            Click 'Generate Overview' to create an AI-powered executive summary of all past surveys.
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-navy">Recent Surveys</h3>
        </div>
        
        {surveys.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Responses</th>
                  <th className="px-6 py-4">AI Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {surveys.map(s => (
                  <tr key={s._id}>
                    <td className="px-6 py-4 font-medium text-navy">{s.title}</td>
                    <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-6 py-4">{s.responseCount}</td>
                    <td className="px-6 py-4 text-xs italic text-gray-500 truncate max-w-xs">
                      {s.aiSummary ? s.aiSummary.substring(0, 80) + '...' : 'No summary'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={BarChart2} heading="No surveys" subtext="Surveys will appear here once created by admins." />
        )}
      </div>
    </div>
  );
};

// Extracted just to fix icon error from above
const BrainIcon = ({ className }) => <BarChart2 className={className} />;

export default RecruiterDashboard;
