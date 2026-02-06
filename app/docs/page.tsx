"use client";
import { Footer, Navbar } from "../../layout";

export default function DocsPage() {
  return (
    <>
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <Navbar view="Docs" />

      {/* Documentation iframe container */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-8 overflow-hidden">
        <div className="max-w-7xl w-full h-full mx-auto">

          {/* Iframe wrapper with styling */}
          <div className="h-full rounded-lg overflow-hidden shadow-2xl border border-slate-700 bg-white">
            <iframe
              src="/docs/index.html"
              className="w-full h-full border-none"
              title="VoxKit API Documentation"
            />
          </div>
        </div>
      </div>

      
    </div>
    <Footer />
    </>
  );
}
