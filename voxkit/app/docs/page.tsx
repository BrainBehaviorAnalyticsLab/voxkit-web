"use client"
import { Footer, Navbar } from '../../layout';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Docs" />
      <div className="pt-50 pb-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-2xl font-medium">
        Coming Soon: Pdoc integration with code base for auto-generated documentation.
      </div>
      <Footer />
    </div>
  );
}