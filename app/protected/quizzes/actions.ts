"use server";
import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
import { GoogleGenAI } from "@google/genai";

export async function saveQuizAction(formData: FormData) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Parse formData
  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const questionsJson = formData.get("questions")?.toString() || "[]";
  let questions: any[] = [];
  try {
    questions = JSON.parse(questionsJson);
  } catch (e) {
    return { error: "Invalid questions data" };
  }

  // Insert quiz
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      user_id: user.id,
      title,
      description,
      is_published: false,
      ai_generated: false,
    })
    .select()
    .single();
  if (quizError) return { error: quizError.message };

  // Insert questions and options
  for (const q of questions) {
    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({
        quiz_id: quiz.id,
        text: q.text,
        marks: q.marks,
      })
      .select()
      .single();
    if (questionError) return { error: questionError.message };
    for (const opt of q.options) {
      const { error: optionError } = await supabase
        .from("options")
        .insert({
          question_id: question.id,
          text: opt.text,
          is_correct: !!opt.isCorrect,
          points: opt.points ?? 0,
        });
      if (optionError) return { error: optionError.message };
    }
  }

  return { success: true, quizId: quiz.id, title: quiz.title, description: quiz.description };
}

export async function generateQuizWithGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { error: "Gemini API key not set" };
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });
    let quiz;
    let text = response.text || "";
    // Try to parse as JSON directly
    try {
      quiz = JSON.parse(text);
      return { quiz };
    } catch {}
    // Try to extract JSON from markdown/code block or text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        quiz = JSON.parse(match[0]);
        return { quiz };
      } catch {}
    }
    // Fallback: return text
    return { quiz: text };
  } catch (e: any) {
    return { error: e.message || "Failed to generate quiz" };
  }
} 