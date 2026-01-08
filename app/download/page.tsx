"use client"
import { Footer, Navbar } from '../../layout';
import DownloadButton from '../../components/DownloadButton';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Download" />
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            Download VoxKit
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get the latest version of VoxKit for your operating system
          </p>
        </div>
        <DownloadButton />
      </div>
      <Footer />
    </div>
  );
}