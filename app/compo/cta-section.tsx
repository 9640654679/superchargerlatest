import { RocketIcon, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-12 bg-blue-100 dark:bg-blue-950 ml-10 mr-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Ready to optimize your ABAP code?</h2>
            <p className="text-muted-foreground">
              Start using ABAP Genius today to write cleaner, faster, and more maintainable SAP code with AI assistance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
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
    </section>
  )
}

