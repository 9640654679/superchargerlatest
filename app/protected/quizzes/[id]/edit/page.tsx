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
    <div className="w-full max-w-2xl md:max-w-3xl mx-auto py-10 px-2 md:px-4 font-nunito">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-primary heading">Edit Quiz</h1>

      <div className="rounded-2xl shadow-xl p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/10">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-accent text-accent-foreground font-semibold rounded-full shadow-lg hover:shadow-xl transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleAIGenerateMore}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate More Questions with AI
            </>
          )}
        </button>
        {aiError && <div className="mt-4 text-destructive bg-destructive/10 p-4 rounded-xl text-lg">{aiError}</div>}
      </div>

      <form className="space-y-10" onSubmit={handleSubmit}>
        <div className="rounded-2xl shadow-xl p-8 bg-gradient-to-br from-primary/5 to-accent/10">
          <label className="block font-semibold text-foreground mb-3 text-lg">Quiz Title</label>
          <input
            className="w-full border border-border rounded-lg p-4 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-lg"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="rounded-2xl shadow-xl p-8 bg-gradient-to-br from-primary/5 to-accent/10">
          <label className="block font-semibold text-foreground mb-3 text-lg">Description</label>
          <textarea
            className="w-full border border-border rounded-lg p-4 min-h-[100px] bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-lg"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="rounded-2xl shadow-xl p-8 bg-gradient-to-br from-primary/5 to-accent/10">
          <label className="block font-semibold text-foreground mb-6 text-lg">Questions</label>
          <div className="space-y-8">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="border-l-4 border-primary bg-background rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-y-2">
                  <span className="font-semibold text-primary text-lg">Question {qIdx + 1}</span>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-destructive/10 text-destructive font-semibold shadow hover:bg-destructive/20 transition-all text-sm"
                    onClick={() => removeQuestion(qIdx)}
                  >
                    Remove
                  </button>
                </div>
                <input
                  className="w-full border border-border rounded-lg p-3 mb-3 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-base"
                  value={q.text}
                  onChange={e => updateQuestion(qIdx, "text", e.target.value)}
                  placeholder="Question text"
                  required
                />
                <div className="flex flex-wrap gap-3 mb-3">
                  {q.options.map((opt: any, oIdx: number) => (
                    <div key={oIdx} className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full shadow-sm">
                      <input
                        className="border border-border rounded-lg p-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                        value={opt.text}
                        onChange={e => updateOption(qIdx, oIdx, "text", e.target.value)}
                        placeholder={`Option ${oIdx + 1}`}
                        required
                      />
                      <input
                        type="number"
                        className="w-16 border border-border rounded-lg p-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                        value={opt.points}
                        onChange={e => updateOption(qIdx, oIdx, "points", Number(e.target.value))}
                        placeholder="Points"
                        min={0}
                        required
                      />
                      <button
                        type="button"
                        className="px-2 py-1 rounded-full bg-destructive/10 text-destructive font-semibold hover:bg-destructive/20 transition-all text-xs"
                        onClick={() => removeOption(qIdx, oIdx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold shadow hover:bg-primary/20 transition-all text-sm"
                    onClick={() => addOption(qIdx)}
                  >
                    Add Option
                  </button>
                </div>
                <input
                  type="number"
                  className="w-24 border border-border rounded-lg p-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                  value={q.marks}
                  onChange={e => updateQuestion(qIdx, "marks", Number(e.target.value))}
                  placeholder="Marks"
                  min={1}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
              onClick={addQuestion}
            >
              Add Question
            </button>
          </div>
        </div>
        <div className="sticky bottom-4 flex justify-end z-50">
          <button
            type="submit"
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
} 