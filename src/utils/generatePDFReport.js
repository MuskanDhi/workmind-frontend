import jsPDF from 'jspdf';

const BRAND = [124, 58, 237];   // purple  #7C3AED
const NAVY  = [17,  24,  39];   // dark    #111827
const GRAY  = [107, 114, 128];  // gray    #6B7280
const WHITE = [255, 255, 255];
const LIGHT = [249, 250, 251];  // bg-gray-50

const BURNOUT_COLORS = {
  low:    [16,  185, 129],   // emerald
  medium: [245, 158, 11],    // amber
  high:   [239, 68,  68],    // red
};

// Wraps long text to fit within a max width (returns array of lines)
const wrapText = (doc, text, maxWidth) =>
  doc.splitTextToSize(String(text || ''), maxWidth);

const generatePDFReport = (survey, responses = [], aiSummary = '', aiAnalysis = null) => {
  const doc  = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw   = doc.internal.pageSize.getWidth();   // 210mm
  const ph   = doc.internal.pageSize.getHeight();  // 297mm
  const lm   = 18;   // left margin
  const rm   = pw - lm; // right margin
  const cw   = rm - lm; // content width
  let y      = 0;

  // ── Helpers ──────────────────────────────────────────────
  const newPage = () => {
    doc.addPage();
    y = 20;
    // header line on new page
    doc.setDrawColor(...BRAND);
    doc.setLineWidth(0.3);
    doc.line(lm, 14, rm, 14);
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('WorkMind — Confidential Employee Wellness Report', lm, 10);
    doc.text(`${survey.title}`, rm, 10, { align: 'right' });
  };

  const checkSpace = (needed = 20) => {
    if (y + needed > ph - 20) newPage();
  };

  const section = (title) => {
    checkSpace(16);
    y += 6;
    doc.setFillColor(...BRAND);
    doc.roundedRect(lm, y, cw, 8, 1, 1, 'F');
    doc.setFontSize(10);
    doc.setTextColor(...WHITE);
    doc.setFont(undefined, 'bold');
    doc.text(title, lm + 4, y + 5.5);
    doc.setFont(undefined, 'normal');
    y += 13;
  };

  const label = (text, val, color = NAVY) => {
    checkSpace(8);
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text(text, lm, y);
    doc.setTextColor(...color);
    doc.setFont(undefined, 'bold');
    doc.text(String(val), lm + 42, y);
    doc.setFont(undefined, 'normal');
    y += 6;
  };

  const bodyText = (text, indent = 0) => {
    const lines = wrapText(doc, text, cw - indent);
    lines.forEach(line => {
      checkSpace(6);
      doc.setFontSize(9);
      doc.setTextColor(...NAVY);
      doc.text(line, lm + indent, y);
      y += 5;
    });
    y += 2;
  };

  const pill = (text, fillColor) => {
    const tw = doc.getStringUnitWidth(text) * 9 / doc.internal.scaleFactor;
    checkSpace(9);
    doc.setFillColor(...fillColor);
    doc.roundedRect(lm, y - 4, tw + 6, 6.5, 1, 1, 'F');
    doc.setFontSize(8.5);
    doc.setTextColor(...WHITE);
    doc.setFont(undefined, 'bold');
    doc.text(text, lm + 3, y + 0.5);
    doc.setFont(undefined, 'normal');
    return tw + 10;
  };

  // ── PAGE 1: Cover ─────────────────────────────────────────
  // Purple header bar
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, pw, 52, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text('WorkMind', lm, 22);

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Employee Wellness Report', lm, 31);

  doc.setFontSize(9);
  doc.setTextColor(200, 180, 255);
  doc.text('Confidential — For Internal HR Use Only', lm, 39);

  y = 64;

  // Survey title box
  doc.setFillColor(...LIGHT);
  doc.roundedRect(lm, y - 6, cw, 24, 2, 2, 'F');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...NAVY);
  const titleLines = wrapText(doc, survey.title, cw - 8);
  titleLines.forEach(line => { doc.text(line, lm + 4, y + 4); y += 8; });

  y += 10;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, lm, y);
  y += 8;

  // Quick stats row
  const stats = [
    { label: 'Total Responses', val: responses.length },
    { label: 'Survey Status',   val: (survey.status || '').toUpperCase() },
    { label: 'Mood Score',      val: aiAnalysis?.moodScore != null ? `${aiAnalysis.moodScore}/100` : '—' },
    { label: 'Burnout Risk',    val: aiAnalysis?.burnoutRisk ? aiAnalysis.burnoutRisk.toUpperCase() : '—' },
  ];

  y += 4;
  const boxW = (cw - 9) / 4;
  stats.forEach((s, i) => {
    const bx = lm + i * (boxW + 3);
    doc.setFillColor(...LIGHT);
    doc.roundedRect(bx, y, boxW, 22, 2, 2, 'F');
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...BRAND);
    doc.text(String(s.val), bx + boxW / 2, y + 12, { align: 'center' });
    doc.setFontSize(7.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...GRAY);
    doc.text(s.label, bx + boxW / 2, y + 19, { align: 'center' });
  });
  y += 30;

  // Prompt
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text('Survey Prompt:', lm, y);
  y += 5;
  doc.setFillColor(240, 237, 254);
  const promptLines = wrapText(doc, `"${survey.adminPrompt}"`, cw - 8);
  doc.roundedRect(lm, y - 4, cw, promptLines.length * 5 + 8, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.setFont(undefined, 'italic');
  promptLines.forEach(line => { doc.text(line, lm + 4, y + 0.5); y += 5; });
  doc.setFont(undefined, 'normal');
  y += 6;

  // ── SECTION: AI Analysis ─────────────────────────────────
  if (aiAnalysis) {
    section('AI Deep Analysis');

    // Mood score visual bar
    if (aiAnalysis.moodScore != null) {
      checkSpace(18);
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text('Team Wellness Score', lm, y);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...NAVY);
      doc.text(`${aiAnalysis.moodScore}/100`, rm, y, { align: 'right' });
      doc.setFont(undefined, 'normal');
      y += 5;

      doc.setFillColor(229, 231, 235);
      doc.roundedRect(lm, y, cw, 5, 1, 1, 'F');
      const fillW = (aiAnalysis.moodScore / 100) * cw;
      const moodColor = aiAnalysis.moodScore >= 75 ? [16,185,129] : aiAnalysis.moodScore >= 55 ? [74,134,216] : aiAnalysis.moodScore >= 35 ? [245,158,11] : [239,68,68];
      doc.setFillColor(...moodColor);
      doc.roundedRect(lm, y, fillW, 5, 1, 1, 'F');
      y += 10;
    }

    label('Sentiment:',    aiAnalysis.sentiment?.charAt(0).toUpperCase() + aiAnalysis.sentiment?.slice(1) || '—');

    // Burnout risk pill
    checkSpace(8);
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('Burnout Risk:', lm, y);
    const bc = BURNOUT_COLORS[aiAnalysis.burnoutRisk] || GRAY;
    pill(`  ${(aiAnalysis.burnoutRisk || 'low').toUpperCase()}  `, bc);
    y += 10;

    // Key Themes
    if (aiAnalysis.keyThemes?.length) {
      checkSpace(8);
      doc.setFontSize(9); doc.setTextColor(...GRAY);
      doc.setFont(undefined, 'bold');
      doc.text('Key Themes:', lm, y); y += 6;
      doc.setFont(undefined, 'normal');
      aiAnalysis.keyThemes.forEach((theme, ti) => {
        checkSpace(8);
        doc.setFillColor(240, 237, 254);
        doc.roundedRect(lm, y - 3.5, 3, 3, 0.5, 0.5, 'F');
        doc.setFontSize(8.5);
        doc.setTextColor(...NAVY);
        const tLines = wrapText(doc, `${ti + 1}. ${theme}`, cw - 6);
        tLines.forEach(line => { doc.text(line, lm + 5, y); y += 5; });
        y += 1;
      });
      y += 3;
    }

    // Recommendations
    if (aiAnalysis.recommendations?.length) {
      checkSpace(10);
      doc.setFontSize(9); doc.setTextColor(...GRAY);
      doc.setFont(undefined, 'bold');
      doc.text('Recommendations:', lm, y); y += 6;
      doc.setFont(undefined, 'normal');
      aiAnalysis.recommendations.forEach((rec, ri) => {
        checkSpace(8);
        doc.setFontSize(8.5);
        doc.setTextColor(6, 78, 59);
        const rLines = wrapText(doc, `→  ${rec}`, cw - 6);
        rLines.forEach(line => { doc.text(line, lm + 4, y); y += 5; });
        y += 1;
      });
    }
  }

  // ── SECTION: AI Summary ──────────────────────────────────
  if (aiSummary) {
    section('AI Summary');
    bodyText(aiSummary);
  }

  // ── SECTION: Survey Questions ────────────────────────────
  section('Survey Questions');
  (survey.questions || []).forEach((q, i) => {
    checkSpace(10);
    doc.setFontSize(9);
    doc.setTextColor(...BRAND);
    doc.setFont(undefined, 'bold');
    doc.text(`Q${i + 1}.`, lm, y);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...NAVY);
    const qLines = wrapText(doc, q.text, cw - 10);
    qLines.forEach(line => { doc.text(line, lm + 8, y); y += 5; });
    y += 2;
  });

  // ── SECTION: Individual Responses ───────────────────────
  if (responses.length > 0) {
    section(`Individual Responses (${responses.length})`);
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    doc.text('Each response is shown with the employee\'s answers condensed per question.', lm, y);
    y += 8;

    responses.forEach((r, ri) => {
      checkSpace(20);

      // Person header bar
      doc.setFillColor(240, 237, 254);
      doc.roundedRect(lm, y - 3, cw, 10, 1.5, 1.5, 'F');

      doc.setFontSize(9.5);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...BRAND);
      const personName = r.isAnonymous ? `Anonymous Employee ${ri + 1}` : (r.submittedByName || 'Employee');
      doc.text(`${ri + 1}.  ${personName}`, lm + 4, y + 4);

      if (r.submittedByDept) {
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        doc.text(r.submittedByDept, rm - 4, y + 4, { align: 'right' });
      }
      if (r.createdAt) {
        const dateStr = new Date(r.createdAt).toLocaleDateString();
        const deptOffset = r.submittedByDept ? 28 : 0;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...GRAY);
        doc.text(dateStr, rm - 4 - deptOffset, y + 4, { align: 'right' });
      }

      doc.setFont(undefined, 'normal');
      y += 14;

      // Answers — each on its own clean row
      (r.answers || []).forEach((a, ai) => {
        checkSpace(16);

        // Question label
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        const qLines = wrapText(doc, `Q${ai + 1}: ${a.questionText}`, cw - 6);
        qLines.forEach(line => { doc.text(line, lm + 3, y); y += 4.5; });

        // Answer text in a light box
        const aLines = wrapText(doc, a.answerText, cw - 12);
        const boxH = aLines.length * 5 + 6;
        checkSpace(boxH + 4);
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(lm + 3, y - 1, cw - 6, boxH, 1, 1, 'F');
        doc.setFontSize(8.5);
        doc.setTextColor(...NAVY);
        aLines.forEach(line => { doc.text(line, lm + 7, y + 3.5); y += 5; });
        y += 5;
      });

      y += 6; // gap between employees
    });
  }

  // ── Footer on all pages ──────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(lm, ph - 12, rm, ph - 12);
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('WorkMind — Confidential', lm, ph - 7);
    doc.text(`Page ${p} of ${totalPages}`, rm, ph - 7, { align: 'right' });
  }

  // ── Save ─────────────────────────────────────────────────
  const filename = `WorkMind_Report_${survey.title.replace(/\s+/g, '_').slice(0, 40)}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};

export default generatePDFReport;
