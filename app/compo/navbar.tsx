"use client"
import Link from "next/link";
// import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = ["Services", "Development", "Operation", "Platform", "About"];
  return (
    <>
      <header className="w-full flex justify-center bg-transparent py-6 z-50 relative">
        <div className="flex items-center justify-between w-full max-w-7xl rounded-2xl bg-transparent backdrop-blur-sm border border-white/10 px-6 py-2 shadow-lg">
          <div className="flex items-center space-x-4">
            <Image src="/udina-logo-signet.svg" alt="UDINA Logo" width={32} height={32} className="h-8 w-8" />
            <span className="font-bold text-xl text-white">UDINA BTP</span>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((item) => (
              <Link
                key={item}
                href="#"
                className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-colors"
              >
                {item}
              </Link>
            ))}
            <div className="relative group">
              <button className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-colors">
                Tools <span className="ml-1">▼</span>
              </button>
              <div className="absolute hidden group-hover:block w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg mt-2 py-2">
                <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                  API Documentation
                </Link>
                <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                  SDK Downloads
                </Link>
                <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                  Code Examples
                </Link>
                <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                  Developer Console
                </Link>
                <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                  Status Page
                </Link>
                <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                  Release Notes
                </Link>
                <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                  Support Portal
                </Link>
              </div>
            </div>
          </nav>
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search"
              className="ml-4 px-6 py-1 rounded bg-white/10 text-white placeholder:text-white/50 text-sm border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
              style={{ width: "200px" }}
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white/50">Ctrl+K</span>
          </div>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center px-3 py-2 rounded text-white focus:outline-none"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      {/* Sidebar and Backdrop OUTSIDE header */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[99] bg-black/70 transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          />
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 z-[100] h-full w-4/5 max-w-xs bg-neutral-900 shadow-2xl flex flex-col pt-8 pb-8 px-6 transition-transform duration-300 transform translate-x-0 md:hidden overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
            <div className="flex items-center space-x-3 mb-8">
              <Image src="/udina-logo-signet.svg" alt="UDINA Logo" width={32} height={32} className="h-8 w-8" />
              <span className="font-bold text-xl text-white">UDINA BTP</span>
            </div>
            <nav className="flex flex-col space-y-4 w-full items-start">
              {navLinks.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="px-2 py-3 rounded-lg text-white text-base font-medium hover:bg-white/10 transition-colors w-full text-left"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="relative w-full mt-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder:text-white/50 text-base border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-white/50">Ctrl+K</span>
              </div>
              <div className="relative group w-full mt-2">
                <button className="flex items-center justify-between w-full px-2 py-3 rounded-lg text-white text-base font-medium hover:bg-white/10 transition-colors">
                  Tools <span className="ml-1">▼</span>
                </button>
                <div className="hidden group-hover:block w-full bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg mt-2 py-2 absolute left-0 z-50">
                  <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    API Documentation
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    SDK Downloads
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    Code Examples
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    Developer Console
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    Status Page
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    Release Notes
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    Support Portal
                  </Link>
                </div>
              </div>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}