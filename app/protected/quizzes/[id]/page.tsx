"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ViewQuizPage() {
  const params = useParams();
  const quizId = params?.id as string;
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!quizId) return;
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
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
      const { data: questions, error: qErr } = await supabase
        .from("questions")
        .select("id, text, marks, options(id, text, points)")
        .eq("quiz_id", quizId)
        .order("id");
      if (qErr) setError(qErr.message);
      setQuestions(questions || []);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  const getPublicQuizUrl = () => {
    // Determine if we're in production or development
    const baseUrl = window.location.hostname === "localhost" 
      ? `${window.location.protocol}//${window.location.host}`
      : `${window.location.protocol}//${window.location.hostname}`;
    
    return `${baseUrl}/quiz/${quizId}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getPublicQuizUrl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh] font-nunito">
      <div className="flex items-center space-x-2 text-primary">
        <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-xl font-semibold">Loading quiz...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto py-10 px-2 md:px-4 font-nunito">
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
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto py-10 px-2 md:px-4 font-nunito">
      <div className="bg-muted/20 border border-muted rounded-xl p-6 text-muted-foreground">
        <h3 className="text-xl font-bold mb-2">Quiz Not Found</h3>
        <p>The quiz you're looking for doesn't exist or may have been deleted.</p>
        <Link 
          href="/protected/quizzes" 
          className="mt-4 inline-block px-4 py-2 bg-muted/30 hover:bg-muted/40 rounded-lg transition-colors font-semibold"
        >
          Back to Quizzes
        </Link>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto py-10 px-2 md:px-4 font-nunito">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary heading">{quiz.title}</h1>
        <div className="flex flex-row gap-3 w-full sm:w-auto justify-end">
          <Link
            href={`/protected/quizzes/${quizId}/edit`}
            className="px-5 py-2 rounded-full bg-accent/20 text-accent-foreground font-semibold shadow hover:bg-accent/30 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            Edit
          </Link>
          <Link
            href={`/protected/quizzes/${quizId}/responses`}
            className="px-5 py-2 rounded-full bg-primary/10 text-primary font-semibold shadow hover:bg-primary/20 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Responses
          </Link>
        </div>
      </div>

      <div className="rounded-2xl shadow-xl p-8 mb-10 bg-gradient-to-br from-primary/5 to-accent/10">
        <h2 className="text-xl font-bold text-foreground mb-3">Description</h2>
        <p className="text-lg text-muted-foreground mb-6">{quiz.description || "No description provided."}</p>
        <div className="border-t border-border pt-5 mt-4">
          <h3 className="font-semibold text-foreground mb-3">Public Link</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex-1">
              <div className="flex items-center">
                <input
                  type="text"
                  value={getPublicQuizUrl()}
                  readOnly
                  className="w-full p-3 bg-muted border border-border rounded-lg text-foreground cursor-pointer"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button 
                  onClick={copyToClipboard} 
                  className="ml-2 p-3 bg-primary/10 text-primary hover:bg-primary/20 transition rounded-lg focus:outline-none"
                  title="Copy link"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-1">Link copied to clipboard!</p>
              )}
            </div>
            <Link 
              href={`/quiz/${quizId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl transition-all text-center"
              target="_blank"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Take Quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl shadow-md p-4 bg-gradient-to-br from-primary/5 to-accent/10">
        <h2 className="text-lg font-bold text-foreground mb-4">Questions ({questions.length})</h2>
        <div className="space-y-4">
          {questions.map((q: any, idx: number) => (
            <div key={q.id} className="border-l-4 border-primary bg-background rounded-xl shadow p-4 hover:shadow-lg transition-all duration-200">
              <h3 className="font-bold text-primary mb-1 text-base">Question {idx + 1}</h3>
              <p className="text-foreground mb-2 text-sm">{q.text}</p>
              <div className="rounded-lg p-3 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-2 text-sm">Options</h4>
                <ul className="flex flex-wrap gap-2">
                  {q.options.map((opt: any, oIdx: number) => (
                    <li key={opt.id} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-foreground font-medium shadow-sm hover:bg-accent/20 transition-all text-xs">
                      {opt.text}
                      <span className="ml-2 text-xs text-primary font-semibold">{opt.points} {opt.points === 1 ? 'pt' : 'pts'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 