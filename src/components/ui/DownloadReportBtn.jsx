import React, { useState } from 'react';
import { Download } from 'lucide-react';
import generatePDFReport from '../../utils/generatePDFReport';
import toast from 'react-hot-toast';

const DownloadReportBtn = ({ survey, responses, aiSummary, aiAnalysis }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!survey) return;
    setLoading(true);
    try {
      // jsPDF is sync but we wrap in timeout so spinner shows
      await new Promise(resolve => setTimeout(resolve, 100));
      generatePDFReport(survey, responses || [], aiSummary || '', aiAnalysis || null);
      toast.success('Report downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-semibold border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      <Download className="w-4 h-4" />
      {loading ? 'Generating...' : 'Download Report'}
    </button>
  );
};

export default DownloadReportBtn;
