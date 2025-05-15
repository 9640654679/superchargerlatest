import { Button } from "@/components/ui/button";
import { GraduationCap, RocketIcon } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Input Your Code",
      description: "Paste your ABAP code into the optimizer or ask a specific question about best practices.",
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Our AI engine analyzes your code, identifies improvement opportunities, and generates suggestions.",
    },
    {
      number: 3,
      title: "Optimize & Learn",
      description:
        "Review AI recommendations, implement optimizations, and learn best practices for future development.",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-12">
          Simple steps to optimize your ABAP development workflow
        </p>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="bg-blue-100 dark:bg-blue-400 text-blue-600 dark:text-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Flexible Plans</h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-12">Choose the plan that fits your development needs</p>
        </div>

        <div className="bg-blue-100 dark:bg-blue-600 p-8 rounded-md">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Ready to optimize your ABAP code?</h2>
              <p>
                Start using ABAP Genius today to write cleaner, faster, and more maintainable SAP code with AI assistance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:w-1/2 md:justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white flex items-center gap-2">
                <RocketIcon className="h-4 w-4" />
                Get Started
              </Button>
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                View Learning Paths
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}