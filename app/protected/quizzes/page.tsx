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
    <>
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground heading mb-4">My Quizzes</h1>
      </div>
      <div>
        {error && <div className="text-destructive mb-4">{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-muted-foreground">You have not created any quizzes yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 p-6 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-primary/20"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="mb-4">
                    <h2 className="font-bold text-xl xl:text-2xl mb-2 text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                      {quiz.title || <span className='text-destructive'>No title</span>}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {quiz.description || <span className='text-destructive'>No description</span>}
                    </p>
                    {(quiz.is_published || publishedId === quiz.id) && (
                      <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center mb-2">
                          <span className="text-xs text-primary font-semibold mr-2">✓ Published!</span>
                          <a href={`/quiz/${quiz.id}`} target="_blank" className="text-xs text-accent hover:text-primary hover:underline truncate flex-1">
                            {getPublicQuizUrl(quiz.id)}
                          </a>
                        </div>
                        <button
                          onClick={() => copyToClipboard(quiz.id)}
                          className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-center ${
                            copiedId === quiz.id 
                              ? 'bg-green-500/20 text-green-700 border border-green-500/30' 
                              : 'bg-secondary text-secondary-foreground hover:bg-primary/20 border border-border'
                          }`}
                          title="Copy link"
                        >
                          {copiedId === quiz.id ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                              Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link href={`/protected/quizzes/${quiz.id}`} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-primary/20 transition-all hover:scale-105 text-sm">
                      View
                    </Link>
                    <Link href={`/protected/quizzes/${quiz.id}/edit`} className="px-4 py-2 rounded-lg bg-accent/20 text-accent-foreground font-medium hover:bg-accent/30 transition-all hover:scale-105 text-sm">
                      Edit
                    </Link>
                    <Link href={`/protected/quizzes/${quiz.id}/responses`} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground font-medium hover:bg-secondary transition-all hover:scale-105 text-sm">
                      Responses
                    </Link>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 text-sm ${
                        quiz.is_published 
                          ? 'bg-green-500/20 text-green-700 cursor-default border border-green-500/30' 
                          : 'bg-primary/20 text-primary-foreground hover:bg-primary/30'
                      }`}
                      disabled={quiz.is_published}
                      onClick={() => handlePublish(quiz.id)}
                    >
                      {quiz.is_published ? "Published" : "Publish"}
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-destructive/20 text-destructive font-medium hover:bg-destructive/30 transition-all hover:scale-105 text-sm"
                      onClick={() => handleDelete(quiz.id)}
                      disabled={deletingId === quiz.id}
                    >
                      {deletingId === quiz.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-2xl bg-card" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 