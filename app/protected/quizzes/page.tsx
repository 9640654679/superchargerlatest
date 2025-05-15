"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";

export default function QuizzesListPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, description, is_published")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      setQuizzes(data || []);
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  async function handlePublish(quizId: string) {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("quizzes")
      .update({ is_published: true })
      .eq("id", quizId);
    if (error) setError(error.message);
    else setPublishedId(quizId);
  }

  async function handleDelete(quizId: string) {
    if (!window.confirm("Are you sure you want to delete this quiz? This cannot be undone.")) return;
    setDeletingId(quizId);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", quizId);
    if (error) {
      setError(error.message);
      setDeletingId(null);
      return;
    }
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    setDeletingId(null);
  }

  const getPublicQuizUrl = (quizId: string) => {
    // Determine if we're in production or development
    const baseUrl = window.location.hostname === "localhost" 
      ? `${window.location.protocol}//${window.location.host}`
      : `${window.location.protocol}//${window.location.hostname}`;
    
    return `${baseUrl}/quiz/${quizId}`;
  };

  const copyToClipboard = (quizId: string) => {
    navigator.clipboard.writeText(getPublicQuizUrl(quizId)).then(() => {
      setCopiedId(quizId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-5xl mx-auto py-6 md:py-10 px-2 md:px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground heading">My Quizzes</h1>
          <Link href="/protected/quizzes/new" className="btn-primary w-full sm:w-auto px-5 py-3 rounded-lg font-semibold shadow hover:scale-105 transition-transform duration-200 text-center">Create New Quiz</Link>
        </div>
        {error && <div className="text-destructive mb-4">{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-muted-foreground">You have not created any quizzes yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bento-card rounded-2xl border shadow-lg p-5 md:p-7 flex flex-col justify-between min-h-[220px] md:min-h-[240px] transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl group relative overflow-hidden w-full"
              >
                <div className="mb-4">
                  <h2 className="font-bold text-2xl mb-1 truncate group-hover:text-primary transition-colors duration-200">{quiz.title || <span className='text-destructive'>No title</span>}</h2>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{quiz.description || <span className='text-destructive'>No description</span>}</p>
                  {(quiz.is_published || publishedId === quiz.id) && (
                    <div className="mt-3 flex items-center">
                      <div className="relative flex-1">
                        <div className="flex items-center mb-1">
                          <span className="text-xs text-primary font-medium mr-2">Published!</span>
                          <a href={`/quiz/${quiz.id}`} target="_blank" className="text-xs text-accent hover:text-primary hover:underline truncate">{getPublicQuizUrl(quiz.id)}</a>
                        </div>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => copyToClipboard(quiz.id)}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              copiedId === quiz.id 
                                ? 'bg-secondary text-secondary-foreground' 
                                : 'bg-muted text-muted-foreground hover:bg-secondary'
                            }`}
                            title="Copy link"
                          >
                            {copiedId === quiz.id ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                </svg>
                                Copy Link
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Link href={`/protected/quizzes/${quiz.id}`} className="px-4 py-1.5 rounded bg-secondary text-secondary-foreground font-semibold hover:bg-primary/20 transition">View</Link>
                  <Link href={`/protected/quizzes/${quiz.id}/edit`} className="px-4 py-1.5 rounded bg-accent/20 text-accent-foreground font-semibold hover:bg-accent/30 transition">Edit</Link>
                  <Link href={`/protected/quizzes/${quiz.id}/responses`} className="px-4 py-1.5 rounded bg-muted text-muted-foreground font-semibold hover:bg-secondary transition">Responses</Link>
                  <button
                    className={`px-4 py-1.5 rounded font-semibold transition ${quiz.is_published ? 'bg-secondary text-secondary-foreground cursor-default' : 'bg-primary/20 text-primary-foreground hover:bg-primary/30'}`}
                    disabled={quiz.is_published}
                    onClick={() => handlePublish(quiz.id)}
                  >
                    {quiz.is_published ? "Published" : "Publish"}
                  </button>
                  <button
                    className="px-4 py-1.5 rounded bg-destructive/20 text-destructive font-semibold hover:bg-destructive/30 transition"
                    onClick={() => handleDelete(quiz.id)}
                    disabled={deletingId === quiz.id}
                  >
                    {deletingId === quiz.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
                {/* Animated gradient bar at the bottom on hover */}
                <div className="absolute left-0 bottom-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gradient bg-gradient-to-r from-primary via-accent to-secondary" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 