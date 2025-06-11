"use client";
import { useState, useTransition } from "react";
import { saveQuizAction, generateQuizWithGemini } from "../actions";
import { useRouter } from "next/navigation";

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

export default function NewQuizPage() {
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiTopic, setAiTopic] = useState("");
  const [aiNumQuestions, setAiNumQuestions] = useState(5);

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
        i === qIdx ? { ...q, options: q.options.filter((_, j) => j !== oIdx) } : q
      )
    );
  };
  const updateOption = (qIdx: number, oIdx: number, field: string, value: any) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.map((opt, j) =>
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
    const formData = new FormData(e.currentTarget);
    formData.set("title", title);
    formData.set("description", description);
    formData.set("questions", JSON.stringify(questions));
    startTransition(async () => {
      const result = await saveQuizAction(formData);
      if (result?.success) {
        setMessage("Quiz saved!");
        router.push("/protected/quizzes");
      } else {
        setMessage(result?.error || "Failed to save quiz");
      }
    });
  }

  async function handleAIGenerate() {
    setAiLoading(true);
    setAiError(null);
    // Compose prompt
    const prompt = `Generate a survey about ${aiTopic} with ${aiNumQuestions} questions and 4 options each. Each option should have a 'points' field (integer, can be 0 or more). Return the result as a JSON object with this structure: {\n  "title": "Quiz Title",\n  "description": "Quiz Description",\n  "questions": [ { "text": "Question?", "marks": 1, "options": [ { "text": "Option 1", "points": 2 }, { "text": "Option 2", "points": 0 } ] } ] }`;
    const result = await generateQuizWithGemini(prompt);
    setAiLoading(false);
    if (result?.error) {
      setAiError(result.error);
      return;
    }
    let quiz = result.quiz;
    if (typeof quiz === "string") {
      try {
        quiz = JSON.parse(quiz);
      } catch {
        setAiError("Could not parse AI result as quiz JSON");
        return;
      }
    }
    // Ensure points are set for all options
    quiz.questions = (quiz.questions || []).map((q: any) => ({
      ...q,
      options: (q.options || []).map((opt: any) => ({
        ...opt,
        points: typeof opt.points === "number" ? opt.points : 0,
      })),
    }));
    setTitle(quiz.title || "");
    setDescription(quiz.description || "");
    setQuestions(quiz.questions || []);
    setMode("manual");
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

  return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto py-8 md:py-12 px-2 md:px-4 font-nunito ">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-primary">Create a New Quiz</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-8 md:mb-10 bg-muted p-1 rounded-xl border border-border">
        <button
          className={`w-full sm:w-auto flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            mode === "manual" 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "bg-muted text-muted-foreground hover:bg-muted/70"
          }`}
          onClick={() => setMode("manual")}
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            Manual Editor
          </span>
        </button>
        <button
          className={`w-full sm:w-auto flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            mode === "ai" 
            ? "bg-accent text-accent-foreground shadow-sm" 
            : "bg-muted text-muted-foreground hover:bg-muted/70"
          }`}
          onClick={() => setMode("ai")}
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            AI Generator
          </span>
        </button>
      </div>
      {mode === "manual" ? (
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="rounded-xl border border-border p-4 md:p-6">
            <label className="block font-semibold text-foreground mb-2">Quiz Title</label>
            <input
              className="w-full border border-border rounded-lg p-3 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="rounded-xl border border-border p-4 md:p-6">
            <label className="block font-semibold text-foreground mb-2">Description</label>
            <textarea
              className="w-full border border-border rounded-lg p-3 min-h-[100px] bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="rounded-xl shadow-md p-4 bg-gradient-to-br from-primary/5 to-accent/10">
            <label className="block font-semibold text-foreground mb-3 text-base">Questions</label>
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="border-l-4 border-primary bg-background rounded-xl shadow p-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-y-2">
                    <span className="font-semibold text-primary text-base">Question {qIdx + 1}</span>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-full bg-destructive/10 text-destructive font-medium shadow hover:bg-destructive/20 transition-all text-xs"
                      onClick={() => removeQuestion(qIdx)}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    className="w-full border border-border rounded-lg p-2 mb-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                    value={q.text}
                    onChange={e => updateQuestion(qIdx, "text", e.target.value)}
                    placeholder="Question text"
                    required
                  />
                  <div className="flex flex-wrap gap-2 mb-2">
                    {q.options.map((opt: any, oIdx: number) => (
                      <div key={oIdx} className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full shadow-sm">
                        <input
                          className="border border-border rounded-lg p-1.5 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-xs"
                          value={opt.text}
                          onChange={e => updateOption(qIdx, oIdx, "text", e.target.value)}
                          placeholder={`Option ${oIdx + 1}`}
                          required
                        />
                        <input
                          type="number"
                          className="w-12 border border-border rounded-lg p-1.5 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-xs"
                          value={opt.points}
                          onChange={e => updateOption(qIdx, oIdx, "points", Number(e.target.value))}
                          placeholder="Points"
                          min={0}
                          required
                        />
                        <button
                          type="button"
                          className="px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-all text-xs"
                          onClick={() => removeOption(qIdx, oIdx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium shadow hover:bg-primary/20 transition-all text-xs"
                      onClick={() => addOption(qIdx)}
                    >
                      Add Option
                    </button>
                  </div>
                  <input
                    type="number"
                    className="w-16 border border-border rounded-lg p-1.5 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-xs"
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
                className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium shadow hover:shadow-md transition-all text-sm"
                onClick={addQuestion}
              >
                Add Question
              </button>
            </div>
          </div>
          <div className="rounded-2xl shadow-xl p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/10">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-accent text-accent-foreground font-medium rounded-full shadow hover:shadow-md transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
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
            {aiError && <div className="mt-4 text-destructive bg-destructive/10 p-4 rounded-xl text-lg">{aiError}</div>}
          </div>
          <input type="hidden" name="questions" value={JSON.stringify(questions)} />
          {message && <div className="text-destructive bg-destructive/10 p-4 rounded-lg">{message}</div>}
          <div className="sticky bottom-4 flex justify-end z-50">
            <button
              type="submit"
              className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium shadow hover:shadow-md transition-all text-sm"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Quiz"}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-border p-4 md:p-8">
          <div className="mb-6 text-foreground">
            <h2 className="font-bold text-xl mb-3 text-primary">Generate with AI</h2>
            <p className="mb-4">Enter a topic and number of questions. AI will generate a quiz and import it directly into the manual editor.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
            <input
              className="border border-border rounded-lg p-4 flex-1 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="Quiz topic (e.g. Python)"
              value={aiTopic}
              onChange={e => setAiTopic(e.target.value)}
            />
            <input
              type="number"
              min={1}
              max={20}
              className="border border-border rounded-lg p-4 w-full sm:w-32 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              value={aiNumQuestions}
              onChange={e => setAiNumQuestions(Number(e.target.value))}
            />
            <button 
              className="px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium shadow hover:shadow-md transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center w-full sm:w-auto"
              onClick={handleAIGenerate} 
              disabled={aiLoading || !aiTopic}
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Quiz
                </>
              )}
            </button>
          </div>
          {aiError && <div className="mt-4 text-destructive bg-destructive/10 p-4 rounded-lg">{aiError}</div>}
          <div className="mt-8 p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-muted-foreground">The AI will generate comprehensive questions with multiple options. You can later edit or add more questions in the manual editor.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 