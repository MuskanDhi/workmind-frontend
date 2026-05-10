import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/ui/StatusBadge';
import AISummaryCard from '../../components/ui/AISummaryCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const RecruiterSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const { data } = await api.get('/api/recruiter/surveys');
        setSurveys(data.surveys);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">All Surveys (Read-Only)</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {surveys.length > 0 ? (
          <div className="divide-y divide-gray-100">
            <div className="bg-gray-50 text-gray-500 font-medium text-sm px-6 py-4 grid grid-cols-12 gap-4">
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Responses</div>
              <div className="col-span-3">Summary Preview</div>
            </div>
            
            {surveys.map(survey => {
              const isExpanded = expandedId === survey._id;
              
              return (
                <div key={survey._id} className="block">
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : survey._id)}
                    className="px-6 py-4 grid grid-cols-12 gap-4 items-center cursor-pointer hover:bg-gray-50 transition-colors text-sm"
                  >
                    <div className="col-span-5 font-medium text-navy">{survey.title}</div>
                    <div className="col-span-2"><StatusBadge status={survey.status} /></div>
                    <div className="col-span-2 text-gray-600">{survey.responseCount}</div>
                    <div className="col-span-3 flex justify-between items-center text-gray-500">
                      <div className="truncate pr-4 text-xs italic">
                        {survey.aiSummary ? survey.aiSummary.substring(0, 40) + '...' : 'No summary'}
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 bg-gray-50/50">
                      {survey.aiSummary ? (
                        <AISummaryCard text={survey.aiSummary} generatedAt={survey.aiSummaryGeneratedAt} />
                      ) : (
                        <div className="text-center text-sm text-gray-500 py-4 italic">No AI summary generated for this survey yet.</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={FileText} heading="No surveys found" subtext="Admins have not created any surveys yet." />
        )}
      </div>
    </div>
  );
};

export default RecruiterSurveys;
