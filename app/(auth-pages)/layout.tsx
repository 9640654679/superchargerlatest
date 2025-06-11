import Navbar from "@/components/navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
    <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
    </>
  );
}
