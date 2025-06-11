import Link from "next/link";

export default function Navbar({ children }: { children?: React.ReactNode }) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-8 items-center font-semibold">
          <Link href="/" className="text-lg md:text-xl">SuperCharger</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-up" className="rounded-full bg-primary px-4 py-2 text-white font-medium hover:bg-primary/90 transition">Sign up</Link>
          {children}
        </div>
      </div>
    </nav>
  );
} 