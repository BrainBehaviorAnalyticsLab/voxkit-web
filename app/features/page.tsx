"use client"
import { Footer, Navbar } from '../../layout';
import { Cpu, Layers, BarChart3, Workflow, Code, Zap, Lock, Puzzle } from 'lucide-react';
import GridButton from '../../components/GridButton';
export default function FeaturesPage() {
  // Easy to add/remove engines
  const engines = [
    {
      name: "Montreal Forced Aligner (MFA)",
      status: "production",
      description: "Industry-standard forced alignment with speaker-adaptive training. Achieves human-level reliability on diverse speech samples.",
      capabilities: ["Forced Alignment", "Model Training"]
    },
    {
      name: "Wav2TextGrid (W2TG)",
      status: "production",
      description: "Alternative alignment engine implementing state-of-the-art Wav2Vec2 based phonetic alignment.",
      capabilities: ["Forced Alignment", "Model Training"]
    },
    {
      name: "Faster Whisper",
      status: "development",
      description: "Lightweight automatic speech recognition (ASR) engine for transcription tasks, optimized for speed and efficiency.",
      capabilities: ["Transcription"]
    }
  ];

  // Easy to add/remove analyzers
  const analyzers = [
    {
      name: "Default Analyzer",
      description: "Extracts core dataset metadata including file counts, and speaker count.",
      outputs: ["CSV summary", "Bar chart"]
    },
    {
      name: "Custom Analyzers",
      description: "Extensible analyzer system allows researchers to add more...",
      outputs: ["CSV Summary", "Bar chart"]
    }
  ];

  // Easy to add/remove pipeline stackers
  const stackers = [
    {
      name: 'Transcription',
      icon: <Cpu className="w-6 h-6" />,
      description: "Generate text transcriptions from audio datasets using integrated ASR engines.",
      workflow: ["Dataset selection", "ASR engine configuration", "Transcription execution"] 
    },
    {
      name: "Training",
      icon: <Zap className="w-6 h-6" />,
      description: "Train custom acoustic models on your datasets with configurable hyperparameters.",
      workflow: ["Dataset selection", "Model configuration", "Training execution"]
    },
    {
      name: "Predicting",
      icon: <Cpu className="w-6 h-6" />,
      description: "Generate phoneme-level alignments using trained or pretrained models.",
      workflow: ["Model selection", "Dataset alignment", "TextGrid generation"]
    },
    {
      name: "GOP Extraction",
      icon: <BarChart3 className="w-6 h-6" />,
      description: "Extract Goodness of Pronunciation scores for pronunciation assessment and speech disorder analysis.",
      workflow: ["Dataset selection", "Alignment selection", "GOP computation"]
    }
  ];

  const coreFeatures = [
    {
      icon: <Puzzle className="w-8 h-8" />,
      title: "Low level Abstraction",
      description: "Abstract base class patterns allow for the rapid addition of new alignment toolkits and graphical components."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "High Level Configuration",
      description: "Quickly adjust visual flow and guidance to fit the needs of specific research studies and user groups."
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Layered Architecture",
      description: "Clean separation between GUI, storage, engine, and analyzer layers enables independent development and testing of each component."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Metadata Tracking",
      description: "Every dataset, model, and alignment stores provenance information for reproducibility and data sharing."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Features" />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            VoxKit Features
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Enabling cross-functional teams to conduct phonetic research with ease.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-20 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-500 rounded-2xl p-10 tile">
          <h2 className="text-3xl font-bold mb-4 text-white text-center">Mission</h2>
          <p className="text-lg text-slate-200 text-center max-w-4xl mx-auto leading-relaxed">
            To accelerate discovery and improve care in speech-language pathology by providing an intuitive, transparent platform for advanced forced alignment, pronunciation assessment, and phonetic research. Accessible to every researcher, not just programmers.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Bridging Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 transition-all tile"
              >
                <div className="text-cyan-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alignment Engines */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Speech Engines</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              VoxKit's modular api enables seamless integration of speech processing engines (toolkits), from established libraries at the cutting edge and beyond.
            </p>
          </div>
          <div className="space-y-6">
            {engines.map((engine, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 tile"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{engine.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      engine.status === 'production' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {engine.status === 'production' ? 'Production Ready' : 'In Development'}
                    </span>
                  </div>
                </div>
                <p className="text-slate-200 mb-4 leading-relaxed">{engine.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-cyan-300">Tools:</p>
                  <div className="flex flex-wrap gap-2">
                    {engine.capabilities.map((capability, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm flex items-center gap-1"
                      >
                        <span className="text-cyan-400">⚙</span>
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Stackers */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">UI Stackers</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Multi-step capabilities for common research tasks, from model training to alignment generation and pronunciation assessment. Stackers are ordered, added and removed to build custom pipelines.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stackers.map((stacker, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 transition-all tile"
              >
                <div className="text-cyan-400 mb-4">
                  {stacker.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{stacker.name}</h3>
                <p className="text-slate-200 mb-4 leading-relaxed">{stacker.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-cyan-300">Workflow Steps:</p>
                  <ul className="space-y-1">
                    {stacker.workflow.map((step, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-cyan-400 mr-2">→</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dataset Analyzers */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Dataset Analyzers</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Extract structured metadata from datasets at registration time, enabling quality assurance and a tailored method of visualization.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyzers.map((analyzer, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 transition-all tile"
              >
                <h3 className="text-xl font-semibold mb-3 text-white">{analyzer.name}</h3>
                <p className="text-slate-200 mb-4 leading-relaxed">{analyzer.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-cyan-300">Analyzer Outputs:</p>
                  <ul className="space-y-1">
                    {analyzer.outputs.map((output, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Differentiators */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 transition-all tile">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Key Differentiators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-200">
            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">For Non-Technical Researchers</h3>
              <p>Graphical interface eliminates command-line barriers while maintaining full control over analysis parameters and model configurations.</p>
            </div>
            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">For Technical Teams</h3>
              <p>Extensible architecture with well-documented APIs enables integration of proprietary tools and custom analysis pipelines.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-300 mb-6 text-lg">
            Ready to explore VoxKit's capabilities in depth?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
      
            <GridButton
  href="/docs"
  className="text-lg px-8 py-4 rounded-lg text-cyan-400 border-cyan-400"
>
  API Documentation
</GridButton>
            <GridButton
   href="/foundations"
  className="text-lg px-8 py-4 rounded-lg text-cyan-400 border-cyan-400"
>
  Research Foundations
</GridButton>
<GridButton
  href="/download"
  className="text-lg px-8 py-4 rounded-lg text-cyan-400 border-cyan-400"
>
  Download VoxKit
</GridButton>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}