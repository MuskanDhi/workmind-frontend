import React from 'react';
import { Sparkles, Brain, AlertCircle, CheckCircle2, BarChart3, TrendingUp } from 'lucide-react';
import MoodGauge from './MoodGauge';

const AIAnalysisCard = ({ analysis, generatedAt, totalResponses, onAnalyze, analyzing, adminPrompt }) => {
  if (analyzing) {
    return (
      <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Brain className="w-12 h-12 text-brand animate-pulse" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <h4 className="text-lg font-bold text-navy">Deep Analysis in Progress...</h4>
          <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
            Mistral AI is correlating {totalResponses} responses with your goal: "{adminPrompt}"
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-brand/5 rounded-2xl p-8 text-center border border-brand/20">
        <Sparkles className="w-10 h-10 text-brand mx-auto mb-4" />
        <h4 className="text-lg font-bold text-navy">Unlock Deeper Insights</h4>
        <p className="text-gray-600 text-sm mt-2 mb-6 max-w-md mx-auto">
          Get a comprehensive analysis of trends, sentiment, and actionable workplace health scores based on all employee feedback.
        </p>
        <button
          onClick={onAnalyze}
          disabled={totalResponses === 0}
          className="bg-brand text-white px-8 py-3 rounded-xl font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
        >
          {totalResponses === 0 ? 'Collect Responses First' : 'Run Deep AI Analysis'}
        </button>
      </div>
    );
  }

  const { sentiment, healthScore, keyThemes, riskFactors, recommendations } = analysis;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-navy rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-brandLight mb-1">Workplace Sentiment</p>
            <h5 className="text-xl font-bold">{sentiment}</h5>
          </div>
          <div className="p-3 bg-white/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-brandLight" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Wellness Index</p>
            <MoodGauge score={healthScore} size={100} />
          </div>
          <div className={`p-3 rounded-xl ${healthScore > 70 ? 'bg-teal/10' : 'bg-coral/10'}`}>
            <BarChart3 className={`w-6 h-6 ${healthScore > 70 ? 'text-teal' : 'text-coral'}`} />
          </div>
        </div>
      </div>

      {/* Themes & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-teal" />
            Dominant Positive Themes
          </h6>
          <div className="flex flex-wrap gap-2">
            {keyThemes.map((theme, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-100">
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-2 text-coral" />
            Burnout & Risk Factors
          </h6>
          <div className="flex flex-wrap gap-2">
            {riskFactors.map((risk, i) => (
              <span key={i} className="px-3 py-1.5 bg-coral/5 text-coral text-xs font-medium rounded-lg border border-coral/10">
                {risk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h6 className="text-xs font-bold text-navy uppercase tracking-wider mb-4 flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-2 text-brand" />
          AI Strategy Recommendations
        </h6>
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center text-[10px] font-bold text-brand shrink-0 mt-0.5 mr-3">
                {i + 1}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] text-gray-400">
          Last analyzed: {new Date(generatedAt).toLocaleString()}
        </span>
        <button 
          onClick={onAnalyze}
          className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline"
        >
          Regenerate Deep Analysis
        </button>
      </div>
    </div>
  );
};

export default AIAnalysisCard;
