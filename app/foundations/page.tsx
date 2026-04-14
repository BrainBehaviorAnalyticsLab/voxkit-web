"use client"
import { Footer, Navbar } from '../../layout';
import { BookOpen, Users, AlertCircle, TrendingUp } from 'lucide-react';

export default function InspirationPage() {
  const researchFindings = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "MFA Achieves Human-Level Reliability",
      source: "Mahr et al., 2021",
      finding: "MFA-SAT reached 86% accuracy on child speech (ages 3-6), the only system approaching human interrater agreement.",
      implementation: "VoxKit defaults to MFA while supporting alternative engines for comparative research.",
      limitation: "MFA-SAT was trained on adult speech; researchers should validate performance on their specific datasets."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Phoneme Class Reliability Varies",
      source: "Mahr et al., 2021",
      finding: "Vowels showed 83% accuracy across systems. Fricative accuracy improved significantly with child age (OR = 1.29/year).",
      implementation: "VoxKit tracks alignment metadata and speaker age, enabling age-stratified accuracy analysis.",
      limitation: "These patterns emerged from elicited single-word productions and may not generalize to spontaneous speech."
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Clinical AI Often Overfits Small Datasets",
      source: "Berisha & Liss, 2024",
      finding: "Most clinical speech datasets contain only minutes to hours of audio with uncertain labels, leading to poor generalization.",
      implementation: "VoxKit enables comprehensive metadata tracking and versioned provenance for transparent reporting.",
      limitation: "VoxKit facilitates rigorous documentation but cannot solve fundamental overfitting—researchers must apply appropriate validation."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Interpretable Measures Outperform Black Boxes",
      source: "Berisha & Liss, 2024",
      finding: "Low-dimensional, clinically grounded measures (e.g., hypernasality, articulatory precision) outperform opaque embeddings.",
      implementation: "VoxKit's analyzer architecture supports custom, interpretable feature extraction from alignment outputs.",
      limitation: "Alignment errors can propagate to downstream measures. Researchers must validate that phonetic boundaries are reliable for their specific analyses."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Foundations" />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            Research Foundations
          </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            VoxKit acts on (and interprets) findings from key research studies in speech pathology to <span className="text-blue-300">support research teams</span> and <span className="text-blue-300">reduce technical barriers</span>.
            </p>
        </div>

        {/* Research Findings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {researchFindings.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-8 transition-all tile"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-cyan-400 flex-shrink-0 mt-1">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 italic">{item.source}</p>
                </div>
              </div>
              
              <div className="space-y-4 ml-10">
                <div>
                  <p className="text-sm font-semibold text-cyan-300 mb-1">Key Finding</p>
                  <p className="text-slate-200">{item.finding}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-green-300 mb-1">VoxKit Implementation</p>
                  <p className="text-slate-200">{item.implementation}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-amber-300 mb-1">Critical Consideration</p>
                  <p className="text-slate-200">{item.limitation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Box */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-500 rounded-2xl p-10 tile">
          <h2 className="text-2xl font-bold mb-4 text-white">VoxKit&apos;s Research-Driven Design</h2>
          <div className="space-y-3 text-slate-200">
            <p>
              <span className="text-cyan-400 font-semibold">Guided workflows:</span> Guidance and layout can be customized to fit the direction and use case for specific studies/research
            </p>
            <p>
              <span className="text-cyan-400 font-semibold">Flexible architecture:</span> Base classes and modular components allow developers to extend and adapt VoxKit
            </p>
            <p>
              <span className="text-cyan-400 font-semibold">Metadata-rich outputs:</span> Metadata tracking enables reportable results and and reduces overhead
            </p>
            <p>
              <span className="text-cyan-400 font-semibold">Honest positioning:</span> VoxKit is research infrastructure, not a clinical decision-support system, it reduces technical barriers while maintaining scientific rigor
            </p>
          </div> 
          <div className="mt-8 pt-6 border-t border-slate-600">
            <p className="text-sm text-slate-300 italic">
              VoxKit prioritizes usability, flexibility, and transparency to empower researchers to utilize the cutting edge.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}