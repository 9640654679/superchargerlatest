"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { generateQuizWithGemini } from "../../../protected/quizzes/actions";
import Link from "next/link";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function QuizResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const quizId = params?.id as string;
  const responseId = searchParams.get("response_id");
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geminiSummary, setGeminiSummary] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!quizId || !responseId) return;
    const fetchResults = async () => {
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
      // Fetch questions and options
      const { data: questions, error: qErr } = await supabase
        .from("questions")
        .select("id, text, marks, options(id, text, points)")
        .eq("quiz_id", quizId)
        .order("id");
      if (qErr) setError(qErr.message);
      setQuestions(questions || []);
      // Fetch user answers
      const { data: answers, error: aErr } = await supabase
        .from("answers")
        .select("question_id, option_id")
        .eq("response_id", responseId);
      if (aErr) setError(aErr.message);
      setUserAnswers(answers || []);
      // Compute points
      let totalPoints = 0;
      let maxPoints = 0;
      for (const q of questions || []) {
        const userAns = answers?.find((a: any) => a.question_id === q.id);
        const selectedOpt = q.options.find((opt: any) => userAns && userAns.option_id === opt.id);
        if (selectedOpt) {
          totalPoints += selectedOpt.points ?? 0;
        }
        // For max points, take the highest points among options for each question
        const maxOpt = q.options.reduce((max: any, opt: any) => (opt.points > (max?.points ?? 0) ? opt : max), null);
        if (maxOpt) maxPoints += maxOpt.points ?? 0;
      }
      setScore(totalPoints);
      setMaxScore(maxPoints);
      setLoading(false);

      // Gemini summary
      if (quiz && questions && answers) {
        setAnalyzing(true);
        const prompt = `You are an expert advisor. Analyze the following quiz result and provide a personalized summary or advice.\n\nQuiz Title: ${quiz.title}\nDescription: ${quiz.description}\n\nQuestions and Options:\n${questions.map((q: any, i: number) => `Q${i + 1}: ${q.text}\n${q.options.map((opt: any, j: number) => `  Option ${j + 1}: ${opt.text} (Points: ${opt.points})`).join("\n")}`).join("\n")}\n\nUser's Answers:\n${questions.map((q: any, i: number) => {
          const userAns = answers.find((a: any) => a.question_id === q.id);
          const selectedOpt = q.options.find((opt: any) => userAns && userAns.option_id === opt.id);
          return `Q${i + 1}: ${selectedOpt ? selectedOpt.text + ` (Points: ${selectedOpt.points})` : "No answer"}`;
        }).join("\n")}\n\nReturn your advice as a JSON array of sections, each with a 'title' and a 'description' field. Each section should be suitable for display as a card in a dashboard. Example: [{\"title\":\"Section Title\",\"description\":\"...\"}]`;
        try {
          const result = await generateQuizWithGemini(prompt);
          setGeminiSummary(result.quiz || result.error || "No analysis available.");
        } catch (e) {
          setGeminiSummary("No analysis available.");
        }
        setAnalyzing(false);
      }
    };
    fetchResults();
  }, [quizId, responseId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh] font-nunito bg-background">
      <div className="flex items-center space-x-2 text-primary">
        <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-xl font-semibold">Loading results...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-nunito bg-background">
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-destructive">
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => router.back()} 
          className="mt-4 px-4 py-2 bg-destructive/20 hover:bg-destructive/30 rounded-lg transition-colors font-semibold"
        >
          Go Back
        </button>
      </div>
    </div>
  );
  
  if (!quiz) return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-nunito bg-background">
      <div className="bg-muted/20 border border-muted rounded-xl p-6 text-muted-foreground">
        <h3 className="text-xl font-bold mb-2">Results Not Found</h3>
        <p>The quiz results you're looking for don't exist or may have been deleted.</p>
        <Link 
          href={`/quiz/${quizId}`} 
          className="mt-4 inline-block px-4 py-2 bg-muted/30 hover:bg-muted/40 rounded-lg transition-colors font-semibold"
        >
          Back to Quiz
        </Link>
      </div>
    </div>
  );

  // const total = questions.length;
  const pointsScored = score;
  const maxPoints = maxScore;
  const percentScore = maxPoints > 0 ? Math.round((pointsScored / maxPoints) * 100) : 0;

  // Use CSS variables for chart colors
  const root = typeof window !== 'undefined' ? window.getComputedStyle(document.documentElement) : null;
  const primary = root ? root.getPropertyValue('--primary').trim() || '#7C3AED' : '#7C3AED';
  const secondary = root ? root.getPropertyValue('--secondary').trim() || '#18181B' : '#18181B';
  const accent = root ? root.getPropertyValue('--accent').trim() || '#7C3AED' : '#7C3AED';
  const foreground = root ? root.getPropertyValue('--foreground').trim() || '#F4F4F5' : '#F4F4F5';

  const data = {
    labels: ["Points Scored", "Points Missed"],
    datasets: [
      {
        data: [pointsScored, maxPoints - pointsScored],
        backgroundColor: [primary, accent],
        borderColor: [primary, accent],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: foreground
        }
      }
    },
    maintainAspectRatio: true,
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 font-nunito ">
      <h1 className="text-4xl font-extrabold mb-8 heading text-primary">
        Quiz Results
      </h1>
      
      <div className=" rounded-xl shadow-md p-8 mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-2">{quiz.title}</h2>
        <p className="text-muted-foreground mb-8">{quiz.description || "No description provided."}</p>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center">
            <h3 className="text-primary font-bold mb-3 text-lg">Your Score</h3>
            <div className="text-5xl font-extrabold text-primary mb-1">{pointsScored} / {maxPoints}</div>
            <div className="text-2xl font-semibold text-accent">{percentScore}%</div>
          </div>
          
          <div className="p-2 flex items-center justify-center">
            <Pie data={data} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className=" rounded-xl shadow-md p-8 mb-10 min-h-[180px] flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Analysis
        </h2>
        {analyzing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-primary font-semibold">Analyzing with AI...</span>
          </div>
        ) : geminiSummary && (
          <div className="space-y-4">
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
                  <div key={idx} className="p-5 bg-muted border border-border rounded-lg">
                    <h3 className="font-bold text-primary mb-2">{section.title}</h3>
                    <p className="text-foreground">{section.description}</p>
                  </div>
                ));
              }
              // Fallback: show as a single card
              return <div className="p-5 bg-muted border border-border rounded-lg">{geminiSummary}</div>;
            })()}
          </div>
        )}
      </div>

      <div className=" rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-foreground mb-8">Your Answers</h2>
        <div className="space-y-8">
          {questions.map((q: any, idx: number) => {
            const userAns = userAnswers.find((a: any) => a.question_id === q.id);
            const selectedOpt = q.options.find((opt: any) => userAns && userAns.option_id === opt.id);
            const hasAnswered = !!selectedOpt;
            
            return (
              <div key={q.id} className="border-2 border-border rounded-lg p-6 hover:border-accent transition-all duration-200 bg-muted/20">
                <h3 className="font-bold text-primary mb-3 text-lg">Question {idx + 1}</h3>
                <p className="text-foreground mb-4">{q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt: any) => {
                    const isSelected = userAns?.option_id === opt.id;
                    let optionClass = "py-2 px-3 rounded-lg border transition-colors flex justify-between items-center";
                    
                    if (isSelected) {
                      optionClass += " bg-muted border-border";
                    } else {
                      optionClass += " bg-background border-border";
                    }
                    
                    return (
                      <div key={opt.id} className={optionClass}>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={isSelected ? "font-medium text-primary" : "text-muted-foreground"}>
                            {opt.text}
                          </span>
                          {isSelected && <span className="ml-2 text-sm text-accent">(Your answer)</span>}
                        </div>
                        <span className="bg-muted text-accent px-3 py-1 rounded-full text-sm font-medium">
                          {opt.points} {opt.points === 1 ? 'point' : 'points'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {!hasAnswered && (
                  <div className="mt-3 text-accent bg-accent/10 p-3 rounded-lg border border-accent/30">
                    You did not answer this question.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-12 flex justify-center">
        <Link
          href={`/quiz/${quizId}`}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-lg"
        >
          Take Quiz Again
        </Link>
      </div>
    </div>
  );
} 