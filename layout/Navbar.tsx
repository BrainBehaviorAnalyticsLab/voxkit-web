"use client";

import { useState } from "react";
import Link from "next/link";

const ALL_VIEWS = [
  "Home",
  "Installation",
  "Features",
  "Foundations",
  "Docs",
  "Help",
] as const;

export default function Navbar({ view = "Home" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const selectedView = view;

  return (
    <nav className="fixed w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-600 z-50 shadow-lg shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-4 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                <div className="w-1 h-6 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                <div className="w-1 h-8 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                <div className="w-1 h-10 bg-blue-500 rounded-full shadow-md shadow-blue-500/50"></div>
                <div className="w-1 h-8 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                <div className="w-1 h-6 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                <div className="w-1 h-4 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
              </div>
              <span className="text-2xl font-semibold text-white">VoxKit</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {ALL_VIEWS.map((item) => {
                const isCurrent = selectedView === item;
                return (
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    key={item}
                    className={
                      isCurrent
                        ? "px-4 py-2 text-white bg-white/10 rounded-lg font-medium cursor-default pointer-events-none"
                        : "px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                    }
                    aria-current={isCurrent ? "page" : undefined}
                    tabIndex={isCurrent ? -1 : 0}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M6 18L18 6"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-600 bg-slate-900/95 backdrop-blur-sm">
          <div className="px-4 py-6 max-w-7xl mx-auto">
            {ALL_VIEWS.map((item, index) => {
              const isCurrent = selectedView === item;
              return (
                <div key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className={
                      isCurrent
                        ? "block w-full text-left px-5 py-3 text-white bg-white/10 rounded-lg font-medium text-lg pointer-events-none"
                        : "block w-full text-left px-5 py-3 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-lg"
                    }
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                  {index < ALL_VIEWS.length - 1 && (
                    <div className="h-px bg-white/20 my-2 mx-4"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
