"use client"
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DecisionTree, DecisionTreeWidget } from './DecisionTree';

export default function HelpChat() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<DecisionTreeWidget | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && containerRef.current && !widgetRef.current) {
      // Create decision tree
      const tree = new DecisionTree("VoxKit Help");

      // Root question
      tree.addQuestion(
        "root",
        "VoxKit Help",
        "Hi! I'm here to help you find the right information. What would you like to do?",
        {
          "Learn about VoxKit features": "features",
          "Get help with workflows": "workflows",
          "Troubleshoot issues": "troubleshoot",
          "Understand concepts": "concepts"
        },
        true
      );

      // Features branch
      tree.addQuestion(
        "features",
        "Features",
        "What feature would you like to learn about?",
        {
          "Pipeline Stackers": "stackers-explain",
          "Model training": "training-explain",
          "Dataset management": "datasets-explain",
          "Analysis tools": "analysis-explain",
          "Go back": "root"
        }
      );

      // Workflows branch
      tree.addQuestion(
        "workflows",
        "Workflows",
        "Which workflow do you need help with?",
        {
          "Training models": "training-explain",
          "Running alignments": "alignment-explain",
          "Running analyses": "analysis-explain",
          "Extracting features": "extraction-explain",
          "Go back": "root"
        }
      );

      // Troubleshoot branch
      tree.addQuestion(
        "troubleshoot",
        "Troubleshoot",
        "What kind of issue are you experiencing?",
        {
          "Installation problems": "install-explain",
          "Configuration issues": "config-explain",
          "Model not working": "models-explain",
          "Dataset errors": "datasets-explain",
          "Go back": "root"
        }
      );

      // Concepts branch
      tree.addQuestion(
        "concepts",
        "Concepts",
        "What concept would you like to understand better?",
        {
          "What are Stackers?": "stackers-explain",
          "Alignment models": "models-explain",
          "Dataset structure": "datasets-explain",
          "Configuration files": "config-explain",
          "Go back": "root"
        }
      );

      // Explanation nodes with navigation
      tree.addExplanation(
        "stackers-explain",
        "Pipeline Stackers",
        "Stackers are VoxKit's main workflow pages that guide you through multi-step speech processing tasks. Each stacker uses numbered steps to help you complete specific workflows.\n\nReady to learn more?",
        [{ text: "View Complete Stackers Guide", url: "/help/leverage-voxkit" }]
      );

      tree.addExplanation(
        "training-explain",
        "Model Training",
        "The TrainingStacker helps you train or fine-tune alignment models using existing datasets and alignments. This is perfect for adapting models to your specific research needs.\n\nWant to learn how?",
        [{ text: "View Training Guide", url: "/help/leverage-voxkit" }]
      );

      tree.addExplanation(
        "alignment-explain",
        "Forced Alignment",
        "The AlignmentStacker performs forced alignment on audio files, matching your audio with text transcripts to create precise TextGrids.\n\nLet me show you how.",
        [{ text: "View Alignment Guide", url: "/help/leverage-voxkit" }]
      );

      tree.addExplanation(
        "analysis-explain",
        "Acoustic Analysis",
        "The AnalysisStacker runs acoustic analyses on aligned files, extracting valuable measurements from your speech data.\n\nReady to explore?",
        [{ text: "View Analysis Guide", url: "/help/leverage-voxkit" }]
      );

      tree.addExplanation(
        "extraction-explain",
        "Feature Extraction",
        "The ExtractionStacker extracts acoustic features from alignments, preparing your data for further statistical analysis.\n\nLet me guide you.",
        [{ text: "View Extraction Guide", url: "/help/leverage-voxkit" }]
      );

      tree.addExplanation(
        "install-explain",
        "Installation",
        "Having installation issues? The installation guide covers system requirements, setup steps, and common troubleshooting tips.\n\nGet VoxKit running smoothly!",
        [{ text: "View Installation Guide", url: "/help/install-voxkit" }]
      );

      tree.addExplanation(
        "config-explain",
        "Configuration",
        "Configuration is key to VoxKit's flexibility. Learn how to customize settings, manage preferences, and optimize your workflow.\n\nMake VoxKit work for you!",
        [{ text: "View Configuration Guide", url: "/help/configure-voxkit" }]
      );

      tree.addExplanation(
        "models-explain",
        "Model Management",
        "Managing models properly ensures smooth workflows. Learn how to register, organize, and troubleshoot alignment models.\n\nMaster model management!",
        [{ text: "View Model Management Guide", url: "/help/manage-models" }]
      );

      tree.addExplanation(
        "datasets-explain",
        "Dataset Management",
        "Datasets are the foundation of your research. Learn how to register, organize, and work with datasets in VoxKit.\n\nOrganize your data!",
        [{ text: "View Dataset Guide", url: "/help/manage-datasets" }]
      );

      // Import widget class dynamically (since it uses DOM)
      import('./DecisionTree').then(({ DecisionTreeWidget }) => {
        widgetRef.current = new DecisionTreeWidget(
          tree,
          containerRef.current!,
          {
            onLinkClick: (url) => {
              router.push(url);
              setIsOpen(false);
            }
          }
        );
      });
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, [isOpen, router]);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-40"
        aria-label="Open help assistant"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-300 z-50 overflow-hidden text-slate-900">
          <div className="relative h-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 z-10 text-slate-600 hover:text-slate-900 bg-white rounded-full p-2 shadow-md transition-colors"
              aria-label="Close help assistant"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div ref={containerRef} className="h-full [&_.dt-wrapper]:text-slate-900 [&_.dt-title]:text-slate-900 [&_.dt-question-text]:text-slate-900 [&_.dt-explanation-content]:text-slate-900 [&_.dt-links-title]:text-slate-900" />
          </div>
        </div>
      )}
    </>
  );
}
