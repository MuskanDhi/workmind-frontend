import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { History } from 'lucide-react';

const MyResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const { data } = await api.get('/api/responses/my');
        setResponses(data.responses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy mb-6">My Responses</h2>

      {responses.length > 0 ? (
        <div className="grid gap-6">
          {responses.map(r => (
            <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-navy">{r.surveyId?.title || 'Unknown Survey'}</h3>
                <span className="text-xs text-gray-500 font-medium">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {r.personalSummary && (
                <div className="bg-tealLight/30 border border-tealLight/50 p-5 rounded-xl">
                  <h4 className="text-xs font-bold text-teal uppercase tracking-wider mb-2">AI Reflection</h4>
                  <p className="text-sm text-gray-800 leading-relaxed">{r.personalSummary}</p>
                </div>
              )}
              
              <div className="mt-6 border-t border-gray-100 pt-4">
                <details className="group">
                  <summary className="text-sm font-medium text-brand cursor-pointer outline-none marker:text-brand">
                    View my answers ({r.answers.length})
                  </summary>
                  <div className="mt-4 space-y-4">
                    {r.answers.map((ans, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-xl text-sm">
                        <div className="font-semibold text-navy mb-1">Q: {ans.questionText}</div>
                        <div className="text-gray-600">{ans.answerText}</div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={History} 
          heading="No responses yet" 
          subtext="When you complete surveys, your responses and AI reflections will appear here." 
        />
      )}
    </div>
  );
};

export default MyResponses;
