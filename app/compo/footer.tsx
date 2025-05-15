import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-1 rounded">
                <span className="font-bold">A+</span>
              </div>
              <span className="font-bold text-lg">ABAP Genius</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Empowering ABAP developers with AI-driven code optimization.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/code-optimizer" className="text-gray-700 dark:text-gray-300 text-sm">
                  Code Optimizer
                </Link>
              </li>
              <li>
                <Link href="/learning-resources" className="text-gray-700 dark:text-gray-300 text-sm">
                  Learning Resources
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ai-assistant" className="text-gray-700 dark:text-gray-300 text-sm">
                  AI Assistant
                </Link>
                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">Coming Soon</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-foreground text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-foreground text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 dark:text-gray-300 hover:text-foreground text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-foreground text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="https://github.com" className="text-gray-700 dark:text-gray-300 hover:text-foreground text-sm">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" className="text-gray-700 dark:text-gray-300 hover:text-foreground text-sm">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-sm">
          © 2025 ABAP Genius. All rights reserved.
        </div>
      </div>
    </footer>
  );
}