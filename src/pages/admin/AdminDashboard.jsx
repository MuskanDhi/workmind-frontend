import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import MoodTrendChart from '../../components/ui/MoodTrendChart';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { Users, ClipboardList, MessageSquare, TrendingUp, Plus, FileText, Settings, Sparkles, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSurveys, setRecentSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, surveysRes, companyRes] = await Promise.all([
          api.get('/api/recruiter/stats'),
          api.get('/api/surveys'),
          api.get('/api/auth/company-info')
        ]);
        setStats(statsRes.data);
        setRecentSurveys(surveysRes.data.surveys.slice(0, 5));
        setCompanyInfo(companyRes.data.company);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return null; // let the layout handle loading if needed, or show simple spinner

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy dark:text-white transition-colors duration-200">Welcome back, {user?.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={Users} label="Total Employees" value={stats?.totalEmployees || 0} />
        <StatCard icon={ClipboardList} label="Active Surveys" value={stats?.activeSurveys || 0} />
        <StatCard icon={MessageSquare} label="Total Responses" value={stats?.totalResponses || 0} />
        <StatCard icon={TrendingUp} label="Participation" value={stats?.participationRate || '0%'} />
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center transition-colors duration-200">
          <div className="p-3 bg-brand/10 dark:bg-brand/20 rounded-xl mb-3">
            <Sparkles className="w-6 h-6 text-brand dark:text-brandLight" />
          </div>
          <div className="text-2xl font-bold text-navy dark:text-white">{companyInfo?.wellnessScore ?? 'N/A'}<span className="text-xs text-gray-400 dark:text-gray-500">/100</span></div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mt-1">Wellness Score</div>
          <div className={`mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
            companyInfo?.wellnessScoreLabel === 'Excellent' ? 'bg-teal/10 text-teal' :
            companyInfo?.wellnessScoreLabel === 'Good' ? 'bg-teal/10 text-teal' :
            companyInfo?.wellnessScoreLabel === 'Moderate' ? 'bg-yellow-500/10 text-yellow-600' :
            'bg-coral/10 text-coral'
          }`}>
            {companyInfo?.wellnessScoreLabel || 'No Data'}
          </div>
        </div>
      </div>
      
      {companyInfo?.inviteCode && (
        <div className="bg-brand/5 dark:bg-brand/10 border border-brand/20 dark:border-brand/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-200">
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand dark:text-brandLight" />
              Employee Invite Code
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Share this code with your employees and recruiters to let them join your company workspace.</p>
          </div>
          <div className="flex items-center gap-3">
            <code className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-lg font-mono font-bold text-navy dark:text-brandLight tracking-wider select-all transition-colors duration-200">
              {companyInfo.inviteCode}
            </code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(companyInfo.inviteCode);
              }}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Link to="/admin/surveys/create" className="flex items-center space-x-2 bg-brand text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-brand/90 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create New Survey</span>
        </Link>
        <Link to="/admin/surveys" className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span>View All Surveys</span>
        </Link>
        <Link to="/admin/settings" className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span>Company Settings</span>
        </Link>
      </div>

      <MoodTrendChart />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-navy dark:text-white">Recent Surveys</h3>
          <Link to="/admin/surveys" className="text-sm font-medium text-brand dark:text-brandLight hover:text-brand/80">
            View All →
          </Link>
        </div>
        
        {recentSurveys.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Responses</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentSurveys.map(survey => (
                  <tr key={survey._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-navy dark:text-white">{survey.title}</td>
                    <td className="px-6 py-4"><StatusBadge status={survey.status} /></td>
                    <td className="px-6 py-4">{survey.responseCount}</td>
                    <td className="px-6 py-4">{new Date(survey.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/surveys/${survey._id}`} className="text-brand dark:text-brandLight font-medium hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            icon={ClipboardList} 
            heading="No surveys yet" 
            subtext="Create your first survey to start collecting feedback."
            cta="Create Survey"
            onCta={() => window.location.href='/admin/surveys/create'}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
