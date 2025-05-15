"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function PublicQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("id, title, description, is_published")
        .eq("id", quizId)
        .single();
      if (quizError || !quiz) {
        setError("Quiz not found.");
        setLoading(false);
        return;
      }
      if (!quiz.is_published) {
        setError("This quiz is not published.");
        setLoading(false);
        return;
      }
      setQuiz(quiz);
      const { data: questions, error: qErr } = await supabase
        .from("questions")
        .select("id, text, marks, options(id, text)")
        .eq("quiz_id", quizId)
        .order("id");
      if (qErr) setError(qErr.message);
      setQuestions(questions || []);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  const handleChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    // Save response
    const { data: response, error: respErr } = await supabase
      .from("responses")
      .insert({ quiz_id: quizId })
      .select()
      .single();
    if (respErr) {
      setError(respErr.message);
      setSubmitting(false);
      return;
    }
    // Save answers
    for (const q of questions) {
      const optionId = answers[q.id];
      if (!optionId) continue;
      await supabase.from("answers").insert({
        response_id: response.id,
        question_id: q.id,
        option_id: optionId,
      });
    }
    setSubmitting(false);
    router.push(`/quiz/${quizId}/result?response_id=${response.id}`);
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
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
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-destructive">
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => router.back()} 
          className="mt-4 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors font-semibold"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (!quiz) return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-secondary/20 border border-secondary/30 rounded-xl p-6 text-secondary-foreground">
        <h3 className="text-xl font-bold mb-2">Quiz Not Found</h3>
        <p>The quiz you're looking for doesn't exist or may have been deleted.</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 inline-block px-4 py-2 bg-secondary/30 hover:bg-secondary/40 rounded-lg transition-colors font-semibold"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-3 heading">
        {quiz.title}
      </h1>
      
      <div className="bg-card rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-bold text-card-foreground mb-3">Description</h2>
        <p className="text-muted-foreground">{quiz.description || "No description provided."}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Questions</h2>
          <div className="space-y-8">
            {questions.map((q, idx) => (
              <div key={q.id} className="border-2 border-border rounded-lg p-5 hover:border-accent/50 transition-all duration-200 bg-muted/20">
                <h3 className="font-bold text-primary mb-4">Question {idx + 1}</h3>
                <p className="text-foreground mb-4">{q.text}</p>
                <div className="space-y-3">
                  {q.options.map((opt: any) => (
                    <label 
                      key={opt.id} 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        answers[q.id] === opt.id 
                          ? 'bg-primary/20 border-2 border-primary/30' 
                          : 'bg-card border-2 border-border hover:border-muted'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt.id}
                        checked={answers[q.id] === opt.id}
                        onChange={() => handleChange(q.id, opt.id)}
                        className="mr-3 h-5 w-5 text-primary focus:ring-primary border-border"
                      />
                      <span className={`flex-1 ${answers[q.id] === opt.id ? 'font-medium text-primary' : 'text-foreground'}`}>
                        {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full py-4 px-6 btn-primary rounded-xl shadow-lg hover:shadow-xl transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed" 
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Answers...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit Answers
            </span>
          )}
        </button>
      </form>
    </div>
  );
} 