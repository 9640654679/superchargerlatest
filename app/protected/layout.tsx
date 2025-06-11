"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Determine page title and header content based on pathname
  const getPageConfig = () => {
    if (pathname === '/protected/quizzes') {
      return {
        title: "Quizzes",
        headerContent: (
          <Link 
            href="/protected/quizzes/new" 
            className="btn-primary px-5 py-2.5 rounded-lg font-semibold shadow hover:scale-105 transition-transform duration-200"
          >
            Create New Quiz
          </Link>
        )
      };
    }
    
    // Default for other pages
    return {
      title: "Dashboard",
      headerContent: null
    };
  };
  
  const { title, headerContent } = getPageConfig();

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <div className="flex w-full relative">
        <AppSidebar />
        {/* SidebarTrigger always visible beside sidebar when minimized */}
        <div className="flex flex-col justify-start">
          <SidebarTrigger className="z-50 mt-4 ml-0" />
        </div>
        <div className="flex-1 flex flex-col">
         
            <SiteHeader title={title}>
              {headerContent}
            </SiteHeader>
            <div className="@container/main flex flex-1 flex-col gap-2 ">
              {children}
            </div>
          
        </div>
      </div>
    </SidebarProvider>
  );
} 