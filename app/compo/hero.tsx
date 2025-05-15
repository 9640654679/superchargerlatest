import { Code, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-36 text-center bg-white dark:bg-black flex flex-col items-center justify-center max-h-3/4 font-poppins">
      <div className="items-center justify-center text-lg text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900 px-6 py-1 mb-10 max-w-xl rounded-full">
        AI powered ABAP Assistant
      </div>
      <div className="container mx-auto px-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-white text-transparent bg-clip-text">
  Write Better ABAP Code
  <br />
  with AI Assistance
</h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          ABAP Genius helps you optimize code, learn best practices, and enhance your SAP development skills with the
          power of AI.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white flex items-center gap-2 relative overflow-hidden transition-all duration-300 rounded-md shadow-md group">
  <Code className="h-4 w-4" />
  Start Learning with Swara AI
  <span className="absolute top-0 left-0 w-full h-full bg-blue-300 opacity-30 transition-opacity duration-300"></span>
  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-400 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></span>
</Button>
          <Button variant="outline" className="border-gray-300 dark:border-gray-700 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Learning Resources
          </Button>
        </div>
      </div>
    </section>
  );
}