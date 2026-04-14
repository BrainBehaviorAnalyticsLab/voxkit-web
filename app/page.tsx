"use client"
import { Download, ChevronDown, Clock, FileCheck, FolderSync, Users } from 'lucide-react';
import WaveSeparator from '../components/WaveSeparator';
import GridButton from '../components/GridButton';
import { Footer, Navbar } from '../layout';

export default function VoxKitLanding() {

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Time & Money",
      description: "Face it, you didn't get into speech pathology to sit hunched over in a computer terminal all day. What once took days of scripting and debugging now takes minutes. Spend your time on research, not wrestling with command-line tools."
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Publish-Ready Outputs",
      description: "TextGrids, alignments, analysis reports—all formatted and ready to go. Your reviewers will never know how easy it was."
    },
    {
      icon: <FolderSync className="w-8 h-8" />,
      title: "Works With Your Data",
      description: "Got existing datasets? Bring them. VoxKit plays nice with what you've already built. No reformatting marathons required."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Built by Researchers",
      description: "We've been in your shoes—late nights, broken scripts, looming deadlines. VoxKit exists because we needed it too."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-750 via-slate-800 to-slate-900 text-white snap-y snap-mandatory overflow-x-hidden">
      <Navbar />


  {/* Hero Section */}
  <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    
          <div className="max-w-7xl mx-auto text-center">
          {/* iMessage-style Bubble */}
          <div className="flex justify-start mb-6 max-w-4xl mx-auto">
            <div
              className="relative text-white px-5 py-2.5 rounded-[20px] text-sm font-medium"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                maxWidth: '255px',
              }}
            >
              Dear SLP Researchers,
              {/* Tail colored part */}
              <span
                className="absolute bottom-0 -left-[7px] w-5 h-5"
                style={{
                  background: '#06b6d4',
                  borderBottomRightRadius: '16px 14px',
                }}
              />
              {/* Tail cutout */}
              <span
                className="absolute bottom-0 -left-[26px] w-[26px] h-5"
                style={{
                  background: '#182338',
                  borderBottomRightRadius: '10px',
                }}
              />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight relative z-10">
    <span className="block overflow-visible">
      <span className="fall-in hero-font text-depth bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
        Stop Fighting Tools
      </span>
    </span>
    <span className="block mt-0 overflow-visible">
      <span className="fall-in delay-1 hero-font text-depth bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
        Start Driving Progress
      </span>
    </span>
  </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            We built VoxKit so you can focus on the science, not the software. Powerful alignment and analysis tools, zero command-line headaches.
          </p>

          {/* CTA Buttons */}

         <GridButton
  href="/help/getting-started"
  className="text-lg px-8 py-4 rounded-lg text-cyan-400 border-cyan-400"
>
  Get Started Today
</GridButton>
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
        Why <span className="text-cyan-400">You&apos;ll Love It</span>
      </h2>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto">
        Seriously, here&apos;s what we&apos;ve been hearing from labs like yours.
      </p>
    </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 transition-all tile"
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
      <GridButton
        href="/features"
        className="text-lg px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-white"
        rippleColor='rgba(255, 255, 255, 0.5)'
      >
        See What&apos;s Possible  <ChevronDown className="w-5 h-5 -rotate-90" />
      </GridButton>
    </div>
  </div>
</section>


      {/* Technical Details Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 border rounded-xl p-12 text-center shadow-xl shadow-black/20 tile">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              The Good Stuff Under the Hood
            </h2>
            <p className="text-lg text-slate-100 max-w-3xl mx-auto mb-8">
              You&apos;re not getting some watered-down toy. VoxKit wraps battle-tested tools like Montreal Forced Aligner (MFA) in a friendly interface. Same powerful algorithms the big labs use, minus the command-line gymnastics.
            </p>

              <GridButton
  href="/docs"
  className="text-lg px-8 py-4 rounded-lg text-cyan-400 border-cyan-400"
>
  Peek under the Hood
</GridButton>
          </div>
        </div>
      </section>
      <WaveSeparator className="-mt-6 md:-mt-8" color="#0ea5e9" height={40} waveOffset={20}/>

      {/* Call to Action Section */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0ea5e9]/18 via-[#0ea5e9]/8 to-[#0ea5e9]/2">
  <div className="max-w-7xl mx-auto text-center">      
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Try It?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Grab VoxKit and see for yourself. We think you&apos;ll wonder how you ever managed without it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
      <GridButton
  href="/help/expected-workflow"
  className="text-lg px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-white"
>
  Expected Workflow
</GridButton>
      <GridButton
  href="/help/getting-started"
  className="text-lg px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-white"
>
  <Users className="w-5 h-5" /> Getting Started
</GridButton>
      <GridButton
  href="/download"
  className="text-lg px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-white"
>
  <Download className="w-5 h-5" /> Download Now
</GridButton>
  
          </div>
        </div>
      </section>
      <Footer />
      
    </div>
  );
}