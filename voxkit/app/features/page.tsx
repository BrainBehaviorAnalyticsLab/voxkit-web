"use client"
import { Footer, Navbar } from '../../layout';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Features" />
      <div className="pt-50 pb-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-2xl font-medium">
        Coming Soon: High level overview of VoxKit features and capabilities. Mission statement, key functionalities, and unique selling points.
      </div>
      <Footer />
    </div>
  );
}