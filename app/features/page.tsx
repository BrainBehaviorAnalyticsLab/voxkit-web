"use client"
import { Footer, Navbar } from '../../layout';
import { Cpu, Layers, BarChart3, Workflow, Code, Zap, Lock, Puzzle } from 'lucide-react';

export default function FeaturesPage() {
  // Easy to add/remove engines
  const engines = [
    {
      name: "Montreal Forced Aligner (MFA)",
      status: "production",
      description: "Industry-standard forced alignment with speaker-adaptive training. Achieves human-level reliability on diverse speech samples.",
      capabilities: ["Phoneme-level alignment", "Speaker adaptation", "Multi-language support"]
    },
    {
      name: "Wav2TextGrid (W2TG)",
      status: "production",
      description: "Alternative alignment engine providing complementary approaches to forced alignment workflows.",
      capabilities: ["Fast alignment", "Lightweight models", "TextGrid output"]
    },
    {
      name: "WhisperX",
      status: "development",
      description: "ASR-based alignment leveraging OpenAI's Whisper for emerging use cases in clinical research.",
      capabilities: ["Multilingual ASR", "Word-level timestamps", "Low-resource languages"]
    }
  ];

  // Easy to add/remove analyzers
  const analyzers = [
    {
      name: "Default Analyzer",
      description: "Extracts core dataset metadata including file counts, speaker demographics, and total duration.",
      outputs: ["Speaker counts", "Audio duration", "File inventory"]
    },
    {
      name: "Custom Analyzers",
      description: "Extensible analyzer system allows researchers to implement domain-specific metadata extraction.",
      outputs: ["User-defined metrics", "CSV summaries", "Dataset validation"]
    }
  ];

  // Easy to add/remove pipeline stackers
  const stackers = [
    {
      name: "Training Pipeline",
      icon: <Zap className="w-6 h-6" />,
      description: "Train custom acoustic models on your datasets with configurable hyperparameters and evaluation metrics.",
      workflow: ["Dataset selection", "Model configuration", "Training execution", "Performance evaluation"]
    },
    {
      name: "Prediction Pipeline",
      icon: <Cpu className="w-6 h-6" />,
      description: "Generate phoneme-level alignments using trained or pretrained models with comprehensive output tracking.",
      workflow: ["Model selection", "Dataset alignment", "TextGrid generation", "Quality assessment"]
    },
    {
      name: "GOP Extraction",
      icon: <BarChart3 className="w-6 h-6" />,
      description: "Extract Goodness of Pronunciation scores for pronunciation assessment and speech disorder analysis.",
      workflow: ["Alignment input", "GOP computation", "Score aggregation", "Result export"]
    }
  ];

  const coreFeatures = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Layered Architecture",
      description: "Clean separation between GUI, storage, engine, and analyzer layers enables independent development and testing of each component."
    },
    {
      icon: <Puzzle className="w-8 h-8" />,
      title: "Modular Engine System",
      description: "Abstract base class pattern allows seamless integration of new alignment toolkits without modifying core application logic."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Comprehensive Metadata",
      description: "Every dataset, model, and alignment stores complete provenance information for reproducible research workflows."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Extensible Analyzers",
      description: "Plugin-based analyzer system supports custom metadata extraction without touching the core codebase."
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
            A modular platform designed for speech pathology research, bridging the gap between advanced ML tools and clinical applications.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-20 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-500 rounded-2xl p-10 tile">
          <h2 className="text-3xl font-bold mb-4 text-white text-center">Mission</h2>
          <p className="text-lg text-slate-200 text-center max-w-4xl mx-auto leading-relaxed">
            VoxKit democratizes access to state-of-the-art forced alignment and speech analysis tools, enabling speech-language pathology researchers to conduct rigorous phonetic research without requiring deep technical expertise. By abstracting away infrastructure complexity while maintaining full analytical transparency, VoxKit reduces barriers between clinical questions and computational answers.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 hover:border-cyan-400/50 transition-all tile"
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
            <h2 className="text-3xl font-bold mb-4">Alignment Engines</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              VoxKit's engine abstraction layer supports multiple forced alignment backends, allowing researchers to compare performance across toolkits or switch engines as their needs evolve.
            </p>
          </div>
          <div className="space-y-6">
            {engines.map((engine, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 hover:border-cyan-400/50 transition-all tile"
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
                <div className="flex flex-wrap gap-2">
                  {engine.capabilities.map((capability, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Stackers */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Pipeline Workflows</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Guided multi-step workflows for common research tasks, from model training to alignment generation and pronunciation assessment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stackers.map((stacker, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 hover:border-cyan-400/50 transition-all tile"
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
              Extract structured metadata from datasets at registration time, enabling quality assurance and dataset characterization without manual inspection.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyzers.map((analyzer, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 hover:border-cyan-400/50 transition-all tile"
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
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-500 rounded-2xl p-10 tile">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">What Makes VoxKit Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-200">
            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">For Non-Technical Researchers</h3>
              <p>Graphical interface eliminates command-line barriers while maintaining full control over analysis parameters and model configurations.</p>
            </div>
            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">For Technical Teams</h3>
              <p>Extensible architecture with well-documented APIs enables integration of proprietary tools and custom analysis pipelines.</p>
            </div>
            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">Reproducibility First</h3>
              <p>Every operation is versioned with complete provenance tracking, from dataset registration through alignment generation.</p>
            </div>
            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">Clinical Grounding</h3>
              <p>Designed around established research methodologies in speech pathology rather than generic audio processing workflows.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-300 mb-6 text-lg">
            Ready to explore VoxKit's capabilities in depth?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/docs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Code className="w-5 h-5" />
              API Documentation
            </a>
            <a
              href="/foundations"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-8 py-4 rounded-lg font-semibold transition-all"
            >
              <Workflow className="w-5 h-5" />
              Research Foundations
            </a>
            
            <a  href="/download"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Download VoxKit
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}