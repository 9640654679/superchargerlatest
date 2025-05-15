"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function QuizResponseDetailPage() {
  const params = useParams();
  const quizId = params?.id as string;
  const responseId = params?.responseId as string;
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId || !responseId) return;
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
      // Fetch questions and options
      const { data: questions, error: qErr } = await supabase
        .from("questions")
        .select("id, text, options(id, text, points)")
        .eq("quiz_id", quizId);
      setQuestions(questions || []);
      // Fetch response and answers
      const { data: response, error: rErr } = await supabase
        .from("responses")
        .select("id, respondent_name, submitted_at, answers(question_id, option_id)")
        .eq("id", responseId)
        .single();
      if (rErr) setError(rErr.message);
      setResponse(response);
      setAnswers(response?.answers || []);
      setLoading(false);
    };
    fetchData();
  }, [quizId, responseId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!quiz || !response) return <div className="p-8">Response not found.</div>;

  function getSelectedOption(q: any) {
    const ans = answers.find((a: any) => a.question_id === q.id);
    return q.options.find((opt: any) => opt.id === ans?.option_id);
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">Response Details</h1>
      <p className="mb-2 text-muted-foreground">Quiz: {quiz.title}</p>
      <p className="mb-2 text-muted-foreground">Respondent: {response.respondent_name || "Anonymous"}</p>
      <p className="mb-4 text-muted-foreground">Submitted: {response.submitted_at ? new Date(response.submitted_at).toLocaleString() : "-"}</p>
      <div className="space-y-6">
        {questions.map((q: any, idx: number) => {
          const selected = getSelectedOption(q);
          return (
            <div key={q.id} className="border rounded p-4">
              <h2 className="font-semibold mb-2">Q{idx + 1}. {q.text}</h2>
              <ul className="list-disc ml-6">
                {q.options.map((opt: any) => (
                  <li key={opt.id} className={selected?.id === opt.id ? "font-bold text-blue-600" : ""}>
                    {opt.text} (Points: {opt.points ?? 0})
                    {selected?.id === opt.id ? " (Selected)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
} 