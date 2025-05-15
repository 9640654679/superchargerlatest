"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import { generateQuizWithGemini } from "../../actions";

export default function QuizResponsesPage() {
  const params = useParams();
  const quizId = params?.id as string;
  const [quiz, setQuiz] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minPoints, setMinPoints] = useState("");
  const [maxPoints, setMaxPoints] = useState("");
  const [geminiSummary, setGeminiSummary] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");

  useEffect(() => {
    if (!quizId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      // Fetch quiz
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("id, title, description")
        .eq("id", quizId)
        .single();
      if (quizError) {
        setError(quizError.message);
        setLoading(false);
        return;
      }
      setQuiz(quiz);
      // Fetch questions (for points)
      const { data: questions, error: qErr } = await supabase
        .from("questions")
        .select("id, text, options(id, text, points)")
        .eq("quiz_id", quizId);
      setQuestions(questions || []);
      // Fetch responses
      const { data: responses, error: rErr } = await supabase
        .from("responses")
        .select("id, respondent_name, submitted_at, answers(question_id, option_id)")
        .eq("quiz_id", quizId)
        .order("submitted_at", { ascending: false });
      if (rErr) setError(rErr.message);
      setResponses(responses || []);
      setLoading(false);
    };
    fetchData();
  }, [quizId]);

  async function handleAnalyze() {
    if (!quiz || !questions.length || !responses.length) return;
    setIsAnalyzing(true);
    setGeminiSummary(null);
    const prompt = `Analyze the following survey results and provide a summary with insights.\n\nQuiz Title: ${quiz.title}\nDescription: ${quiz.description}\n\nQuestions and Options:\n${questions.map((q: any, i: number) => `Q${i + 1}: ${q.text}\n${q.options.map((opt: any, j: number) => `  Option ${j + 1}: ${opt.text} (Points: ${opt.points})`).join("\n")}`).join("\n")}\n\nResponses:\n${responses.map((resp: any, idx: number) => `Respondent: ${resp.respondent_name || "Anonymous"}\n${questions.map((q: any, i: number) => {
      const ans = (resp.answers || []).find((a: any) => a.question_id === q.id);
      const opt = q.options.find((o: any) => o.id === ans?.option_id);
      return `Q${i + 1}: ${opt ? opt.text + ` (Points: ${opt.points})` : "No answer"}`;
    }).join("\n")}`).join("\n\n")}\n\nReturn your analysis as a JSON array of sections, each with a 'title' and a 'description' field. Each section should be suitable for display as a card in a dashboard. Example: [{\"title\":\"Section Title\",\"description\":\"...\"}]`;
    const result = await generateQuizWithGemini(prompt);
    setGeminiSummary(result.quiz || result.error || "No analysis available.");
    setIsAnalyzing(false);
  }

  // Calculate total points for a response
  function getPointsForResponse(resp: any) {
    let total = 0;
    for (const ans of resp.answers || []) {
      const q = questions.find((q: any) => q.id === ans.question_id);
      const opt = q?.options.find((o: any) => o.id === ans.option_id);
      total += opt?.points ?? 0;
    }
    return total;
  }

  // Apply filters
  const filteredResponses = responses.filter((resp) => {
    const points = getPointsForResponse(resp);
    const date = resp.submitted_at ? new Date(resp.submitted_at) : null;
    let pass = true;
    if (dateFrom && date && date < new Date(dateFrom)) pass = false;
    if (dateTo && date && date > new Date(dateTo)) pass = false;
    if (minPoints && points < Number(minPoints)) pass = false;
    if (maxPoints && points > Number(maxPoints)) pass = false;
    return pass;
  });

  // Analytics
  const totalResponses = filteredResponses.length;
  const pointsArr = filteredResponses.map(getPointsForResponse);
  const avgPoints = pointsArr.length ? (pointsArr.reduce((a, b) => a + b, 0) / pointsArr.length).toFixed(2) : 0;
  const minPointsVal = pointsArr.length ? Math.min(...pointsArr) : 0;
  const maxPointsVal = pointsArr.length ? Math.max(...pointsArr) : 0;

  // Points distribution (bar chart)
  const pointsDist: Record<number, number> = {};
  pointsArr.forEach((p) => { pointsDist[p] = (pointsDist[p] || 0) + 1; });
  const pointsLabels = Object.keys(pointsDist).sort((a, b) => Number(a) - Number(b));
  const pointsData = pointsLabels.map((k) => pointsDist[Number(k)]);
  const pointsBarData = {
    labels: pointsLabels,
    datasets: [
      {
        label: "# of Responses",
        data: pointsData,
        backgroundColor: "#3b82f6",
      },
    ],
  };

  // Per-question option selection distribution
  function getOptionCounts(q: any) {
    const counts: Record<string, number> = {};
    for (const opt of q.options) counts[opt.id] = 0;
    for (const resp of filteredResponses) {
      const ans = (resp.answers || []).find((a: any) => a.question_id === q.id);
      if (ans && counts[ans.option_id] !== undefined) counts[ans.option_id]++;
    }
    return counts;
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!quiz) return <div className="p-8">Quiz not found.</div>;

  return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto py-6 md:py-8 px-2 md:px-4 font-nunito">
      <h1 className="text-xl md:text-2xl font-bold mb-2 text-primary">Responses for: {quiz.title}</h1>
      <p className="mb-4 text-muted-foreground">{quiz.description}</p>
      <button
        className="mb-4 w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 disabled:opacity-50 transition"
        onClick={handleAnalyze}
        disabled={isAnalyzing || !responses.length || !questions.length}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
      </button>
      {geminiSummary && (
        <div className="mb-6">
          <h2 className="font-semibold mb-4 text-primary">AI Analysis</h2>
          <div className="flex flex-col gap-4">
            {(() => {
              let sections = [];
              let raw = geminiSummary;
              try {
                let jsonStr = raw;
                // Extract JSON from code block if present
                const codeBlockMatch = raw.match(/```json([\s\S]*?)```/i) || raw.match(/```([\s\S]*?)```/i);
                if (codeBlockMatch) {
                  jsonStr = codeBlockMatch[1].trim();
                }
                const parsed = JSON.parse(jsonStr);
                if (Array.isArray(parsed) && parsed[0]?.title && parsed[0]?.description) {
                  sections = parsed;
                }
              } catch {}
              if (sections.length > 0) {
                return sections.map((section, idx) => (
                  <div key={idx} className="p-4 bg-muted/30 border border-border rounded text-foreground">
                    <div className="font-semibold mb-1 text-primary">{section.title}</div>
                    <div>{section.description}</div>
                  </div>
                ));
              }
              // Fallback: show as a single card
              return <div className="p-4 bg-muted/30 border border-border rounded text-foreground">{geminiSummary}</div>;
            })()}
          </div>
        </div>
      )}
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 items-stretch sm:items-end">
        <div>
          <label className="block text-xs">From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-border rounded p-1 w-full" />
        </div>
        <div>
          <label className="block text-xs">To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-border rounded p-1 w-full" />
        </div>
        <div>
          <label className="block text-xs">Min Points</label>
          <input type="number" value={minPoints} onChange={e => setMinPoints(e.target.value)} className="border border-border rounded p-1 w-full sm:w-20" />
        </div>
        <div>
          <label className="block text-xs">Max Points</label>
          <input type="number" value={maxPoints} onChange={e => setMaxPoints(e.target.value)} className="border border-border rounded p-1 w-full sm:w-20" />
        </div>
        <div>
          <label className="block text-xs">Filter by Question</label>
          <select
            className="border border-border rounded p-1 w-full"
            value={selectedQuestionId}
            onChange={e => setSelectedQuestionId(e.target.value)}
          >
            <option value="">All Questions</option>
            {questions.map((q: any) => (
              <option key={q.id} value={q.id}>{q.text}</option>
            ))}
          </select>
        </div>
        <div className="sm:ml-auto text-xs text-muted-foreground mt-2 sm:mt-0">Filtered: {filteredResponses.length} / {responses.length}</div>
      </div>
      <div className="mb-6">
        <span className="font-semibold">Total Responses:</span> {totalResponses} <br />
        <span className="font-semibold">Average Points:</span> {avgPoints} <br />
        <span className="font-semibold">Min Points:</span> {minPointsVal} <br />
        <span className="font-semibold">Max Points:</span> {maxPointsVal}
      </div>
      <div className="mb-8">
        <h2 className="font-semibold mb-2">Points Distribution</h2>
        <Bar data={pointsBarData} />
      </div>
      {selectedQuestionId ? (
        <div className="overflow-x-auto mb-8">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Respondent</th>
                <th className="p-2 text-left">Submitted At</th>
                <th className="p-2 text-left">Selected Option</th>
                <th className="p-2 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.map((resp: any) => {
                const q = questions.find((q: any) => q.id === selectedQuestionId);
                const ans = (resp.answers || []).find((a: any) => a.question_id === selectedQuestionId);
                const opt = q?.options.find((o: any) => o.id === ans?.option_id);
                return (
                  <tr key={resp.id} className="border-t">
                    <td className="p-2">{resp.respondent_name || "Anonymous"}</td>
                    <td className="p-2">{resp.submitted_at ? new Date(resp.submitted_at).toLocaleString() : "-"}</td>
                    <td className="p-2">{opt ? opt.text : <span className="text-muted-foreground">No answer</span>}</td>
                    <td className="p-2">{opt ? opt.points : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Respondent</th>
                <th className="p-2 text-left">Submitted At</th>
                <th className="p-2 text-left">Points</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.map((resp: any) => (
                <tr key={resp.id} className="border-t">
                  <td className="p-2">{resp.respondent_name || "Anonymous"}</td>
                  <td className="p-2">{resp.submitted_at ? new Date(resp.submitted_at).toLocaleString() : "-"}</td>
                  <td className="p-2">{getPointsForResponse(resp)}</td>
                  <td className="p-2">
                    <a href={`/protected/quizzes/${quizId}/responses/${resp.id}`} className="underline">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 