"use client";
import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { generateQuizWithGemini } from "../../actions";

function emptyQuestion() {
  return {
    text: "",
    marks: 1,
    options: [
      { text: "", points: 0 },
      { text: "", points: 0 },
    ],
  };
}

export default function EditQuizPage() {
  const params = useParams();
  const quizId = params?.id as string;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([emptyQuestion()]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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
      setTitle(quiz.title || "");
      setDescription(quiz.description || "");
      const { data: questions, error: qErr } = await supabase
        .from("questions")
        .select("id, text, marks, options(id, text, is_correct, points)")
        .eq("quiz_id", quizId)
        .order("id");
      if (qErr) setError(qErr.message);
      setQuestions(
        (questions || []).map((q: any) => ({
          ...q,
          options: (q.options || []).map((opt: any) => ({
            ...opt,
            points: typeof opt.points === "number" ? opt.points : 0,
          })),
        }))
      );
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);
  const removeQuestion = (idx: number) => setQuestions(questions.filter((_, i) => i !== idx));
  const updateQuestion = (idx: number, field: string, value: any) => {
    setQuestions(
      questions.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };
  const addOption = (qIdx: number) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, { text: "", points: 0 }] } : q
      )
    );
  };
  const removeOption = (qIdx: number, oIdx: number) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.filter((_: any, j: any) => j !== oIdx) } : q
      )
    );
  };
  const updateOption = (qIdx: number, oIdx: number, field: string, value: any) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.map((opt: any, j: any) =>
                j === oIdx ? { ...opt, [field]: value } : opt
              ),
            }
          : q
      )
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      // Update quiz
      const { error: quizError } = await supabase
        .from("quizzes")
        .update({ title, description })
        .eq("id", quizId);
      if (quizError) {
        setError(quizError.message);
        return;
      }
      // Remove all old questions/options, then insert new
      await supabase.from("options").delete().in("question_id", questions.map((q: any) => q.id));
      await supabase.from("questions").delete().eq("quiz_id", quizId);
      for (const q of questions) {
        const { data: question, error: questionError } = await supabase
          .from("questions")
          .insert({ quiz_id: quizId, text: q.text, marks: q.marks })
          .select()
          .single();
        if (questionError) {
          setError(questionError.message);
          return;
        }
        for (const opt of q.options) {
          const { error: optionError } = await supabase
            .from("options")
            .insert({ question_id: question.id, text: opt.text, is_correct: !!opt.isCorrect, points: opt.points ?? 0 });
          if (optionError) {
            setError(optionError.message);
            return;
          }
        }
      }
      setMessage("Quiz updated!");
      router.push(`/protected/quizzes/${quizId}`);
    });
  }

  async function handleAIGenerateMore() {
    setAiError(null);
    const num = parseInt(prompt("How many new questions to generate? (e.g. 3)") || "3", 10);
    if (!num || num < 1) return;
    setAiLoading(true);
    // Compose context-aware prompt
    const promptText = `You are an expert quiz generator. Given the following quiz context, generate ${num} new, non-redundant questions (with 4 options each, each option with a 'points' field). Do NOT repeat or closely paraphrase any existing question.\n\nQuiz Title: ${title}\nDescription: ${description}\n\nExisting Questions:\n${questions.map((q: any, i: number) => `Q${i + 1}: ${q.text}\n${q.options.map((opt: any, j: number) => `  Option ${j + 1}: ${opt.text} (Points: ${opt.points})`).join("\n")}`).join("\n")}\n\nReturn ONLY the new questions as a JSON array: [ { "text": "Question?", "marks": 1, "options": [ { "text": "Option 1", "points": 2 }, { "text": "Option 2", "points": 0 } ] } ]`;
    const result = await generateQuizWithGemini(promptText);
    setAiLoading(false);
    if (result?.error) {
      setAiError(result.error);
      return;
    }
    let newQuestions = result.quiz;
    if (typeof newQuestions === "string") {
      try {
        let jsonStr = newQuestions;
        // Extract JSON from code block if present
        const codeBlockMatch = jsonStr.match(/```json([\s\S]*?)```/i) || jsonStr.match(/```([\s\S]*?)```/i);
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1].trim();
        }
        newQuestions = JSON.parse(jsonStr);
      } catch {
        setAiError("Could not parse AI result as questions JSON");
        return;
      }
    }
    // Ensure points are set for all options
    newQuestions = (newQuestions || []).map((q: any) => ({
      ...q,
      options: (q.options || []).map((opt: any) => ({
        ...opt,
        points: typeof opt.points === "number" ? opt.points : 0,
      })),
    }));
    setQuestions([...questions, ...newQuestions]);
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-2xl md:max-w-3xl mx-auto py-8 md:py-10 px-2 md:px-4 font-nunito">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-primary heading">Edit Quiz</h1>

      <div className="rounded-xl border border-border shadow-md p-4 md:p-6 mb-8">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-accent text-accent-foreground font-semibold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleAIGenerateMore}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate More Questions with AI
            </>
          )}
        </button>
        {aiError && <div className="mt-3 text-destructive bg-destructive/10 p-3 rounded-lg">{aiError}</div>}
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border shadow-md p-4 md:p-6">
          <label className="block font-semibold text-foreground mb-2">Quiz Title</label>
          <input
            className="w-full border border-border rounded-lg p-3 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="rounded-xl border border-border shadow-md p-4 md:p-6">
          <label className="block font-semibold text-foreground mb-2">Description</label>
          <textarea
            className="w-full border border-border rounded-lg p-3 min-h-[100px] bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        
        <div className="rounded-xl border border-border shadow-md p-4 md:p-6">
          <label className="block font-semibold text-foreground mb-4">Questions</label>
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="border border-border rounded-lg p-4 md:p-5 hover:border-primary/40 transition-all duration-200 bg-muted/40">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-y-2">
                  <span className="font-semibold text-primary">Question {qIdx + 1}</span>
                  {questions.length > 1 && (
                    <button 
                      type="button" 
                      className="px-3 py-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium" 
                      onClick={() => removeQuestion(qIdx)}
                    >
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </span>
                    </button>
                  )}
                </div>
                <input
                  className="w-full border border-border rounded-lg p-3 mb-4 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="Question text"
                  value={q.text}
                  onChange={e => updateQuestion(qIdx, "text", e.target.value)}
                  required
                />
                <div className="bg-muted/30 rounded-lg p-3 md:p-4">
                  <label className="block font-medium text-foreground mb-3">Options</label>
                  <div className="space-y-3">
                    {q.options.map((opt: any, oIdx: number) => (
                      <div key={oIdx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <input
                          className="border border-border rounded-lg p-3 flex-1 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt.text}
                          onChange={e => updateOption(qIdx, oIdx, "text", e.target.value)}
                          required
                        />
                        <input
                          type="number"
                          className="border border-border rounded-lg p-3 w-full sm:w-24 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                          placeholder="Points"
                          value={opt.points ?? 0}
                          min={0}
                          onChange={e => updateOption(qIdx, oIdx, "points", Number(e.target.value))}
                        />
                        {q.options.length > 2 && (
                          <button 
                            type="button" 
                            className="p-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                            onClick={() => removeOption(qIdx, oIdx)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button" 
                    className="mt-4 px-4 py-2 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm font-medium w-full sm:w-auto"
                    onClick={() => addOption(qIdx)}
                  >
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Option
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            type="button" 
            className="mt-6 px-5 py-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium w-full"
            onClick={addQuestion}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Question
            </span>
          </button>
        </div>
        
        {message && <div className="bg-success/10 p-4 rounded-lg text-success font-medium">{message}</div>}
        {error && <div className="bg-destructive/10 p-4 rounded-lg text-destructive">{error}</div>}
        
        <button 
          type="submit" 
          className="w-full py-4 px-6 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:shadow transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed" 
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Changes...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </span>
          )}
        </button>
      </form>
    </div>
  );
} 