"use client"
import { Download, ChevronDown, Cpu, Users, Zap, Code } from 'lucide-react';
import WaveSeparator from '../components/WaveSeparator';
import DownloadButton from '../components/DownloadButton';
import { Footer, Navbar } from '../layout';

export default function VoxKitLanding() {

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Accessible to All Researchers",
      description: "Bringing cutting-edge ML tools to speech pathology researchers without requiring technical expertise. Focus on your research, not the code."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Cutting-Edge ML Technology",
      description: "Leverage state-of-the-art machine learning algorithms for speech analysis, powered by proven tool stacks like Montreal Forced Aligner."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Highly Extensible API",
      description: "Seamlessly integrate additional low-level alignment toolkits through our flexible API and extend custom functionality to multifunctional teams."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Provenance and Reliability",
      description: "Built with research integrity in mind, VoxKit ensures reproducible results and robust data handling for trustworthy speech analysis."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-750 via-slate-800 to-slate-900 text-white snap-y snap-mandatory overflow-x-hidden">
      <Navbar />


  {/* Hero Section */}
  <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    
          <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight relative z-10">
    <span className="block overflow-visible">
      <span className="fall-in hero-font text-depth bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
        Stop Fighting Tools
      </span>
    </span>
    <span className="block mt-0 overflow-visible">
      <span className="fall-in delay-1 hero-font text-depth bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
        Start Driving Research
      </span>
    </span>
  </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A flexible, researcher-first platform for speech pathology. Harness cutting-edge alignment and analysis tools to build powerful, fully customized workflows—without friction.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="/help/getting-started"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Get Started Today
            </a>
            <a
              href="/foundations"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-slate-500 text-slate-300 hover:border-slate-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Research Foundations
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 -mb-1">

      
    <WaveSeparator 
      color="#0ea5e9" 
      height={40} 
      waveOffset={20} 
      className="w-full"
    />
  </div>
      </section>


      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0ea5e9]/18 via-[#0ea5e9]/8 to-[#0ea5e9]/2">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl sm:text-5xl font-bold mb-4">
        Built for <span className="text-cyan-400">Researchers</span>
      </h2>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto">
        Higher-level access to powerful forced alignment & speech analysis tools.
      </p>
    </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-400/10 hover:bg-slate-800/70 tile"
              >
          <div className="text-cyan-400 mb-4">
            {feature.icon}
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-white">{feature.title}</h3>
          <p className="text-slate-200 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
    <div className="flex justify-center mt-12">
      <a
        href="/features"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
      >
        View the Capability
        <ChevronDown className="w-5 h-5 -rotate-90" />
      </a>
    </div>
  </div>
</section>


      {/* Technical Details Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-500 rounded-2xl p-12 text-center shadow-xl shadow-black/20 tile">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Powered by Industry-Standard Tools
            </h2>
            <p className="text-lg text-slate-100 max-w-3xl mx-auto mb-8">
              VoxKit integrates state-of-the-art machine learning algorithms and speech processing libraries, including the renowned Montreal Forced Aligner (MFA). This ensures that all researchers have access to reliable, accurate, and cutting-edge technology for their speech pathology studies.
            </p>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Code className="w-5 h-5" />
              Explore the Code
            </a>
          </div>
        </div>
      </section>
      <WaveSeparator className="-mt-6 md:-mt-8" color="#0ea5e9" height={40} waveOffset={20}/>

      {/* Call to Action Section */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0ea5e9]/18 via-[#0ea5e9]/8 to-[#0ea5e9]/2">
  <div className="max-w-7xl mx-auto text-center">      
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Download VoxKit today and join researchers advancing speech pathology by streamlining speech analysis and processing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/help/getting-started"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Getting Started Guide
            </a>
            <a
              href="/help/expected-workflow"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-8 py-4 rounded-lg font-semibold transition-all"
            >
              <Code className="w-5 h-5" />
              Expected Workflow
            </a>
            <a
              href="/download"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Now
            </a>
          </div>
        </div>
      </section>
      <Footer />
      
    </div>
  );
}