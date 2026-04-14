"use client"

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Footer, Navbar } from '../../../layout';
import helpContent from '../../../data/help-content.json';
import Link from 'next/link';

interface Section {
  type: string;
  content?: string;
  items?: string[];
  language?: string;
}

interface HelpTopic {
  title: string;
  description: string;
  icon: string;
  sections: Section[];
}

type HelpContent = {
  [key: string]: HelpTopic;
}

const typedHelpContent = helpContent as HelpContent;

interface PageProps {
  params: Promise<{ topic: string }>;
}

export default function HelpTopicPage({ params }: PageProps) {
  const { topic } = use(params);
  const helpTopic = typedHelpContent[topic];

  if (!helpTopic) {
    notFound();
  }

  const allTopics = Object.keys(typedHelpContent);
  const currentIndex = allTopics.indexOf(topic);
  const previousTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  const renderSection = (section: Section, index: number) => {
    switch (section.type) {
      case 'text':
        return (
          <p key={index} className="text-lg text-slate-300 leading-relaxed mb-6">
            {section.content}
          </p>
        );
      
      case 'heading':
        return (
          <h2 key={index} className="text-2xl font-bold text-white mt-10 mb-4 flex items-center">
            <span className="w-1 h-8 bg-blue-500 mr-3 rounded"></span>
            {section.content}
          </h2>
        );
      
      case 'list':
        return (
          <ul key={index} className="space-y-3 mb-6 ml-4">
            {section.items?.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start text-slate-300">
                <span className="text-blue-400 mr-3 mt-1 text-xl">•</span>
                <span className="flex-1 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
      
      case 'code':
        return (
          <div key={index} className="mb-6 rounded-lg overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">{section.language || 'code'}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(section.content || '')}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="bg-slate-900 p-4 overflow-x-auto">
              <code className="text-sm text-slate-300 font-mono leading-relaxed">
                {section.content}
              </code>
            </pre>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Help" />
      
      <div className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
        href="/help" 
        className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
          >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Help Center
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
        <span className="text-6xl mr-4">{helpTopic.icon}</span>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {helpTopic.title}
          </h1>
          <p className="text-xl text-slate-400">
            {helpTopic.description}
          </p>
        </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-700 shadow-2xl mb-12">
          {helpTopic.sections.map((section, index) => renderSection(section, index))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-700">
          <div className="flex-1">
        {previousTopic && (
          <Link 
            href={`/help/${previousTopic}`}
            className="group inline-flex items-center text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Previous</div>
          <div className="font-medium">{typedHelpContent[previousTopic].title}</div>
            </div>
          </Link>
        )}
          </div>
          
          <div className="flex-1 text-right">
        {nextTopic && (
          <Link 
            href={`/help/${nextTopic}`}
            className="group inline-flex items-center text-slate-300 hover:text-white transition-colors"
          >
            <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Next</div>
          <div className="font-medium">{typedHelpContent[nextTopic].title}</div>
            </div>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 p-6 bg-blue-900/20 border border-blue-800/30 rounded-xl">
            <div className="grid md:grid-cols-3 gap-4 text-sm ">
          <a href="https://github.com/BrainBehaviorAnalyticsLab/voxkit-desktop/issues" className="text-slate-300 hover:text-white transition-colors flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Issues
          </a>
          <a href="mailto:support@voxkit.dev" className="text-slate-300 hover:text-white transition-colors flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Support
          </a>
          <Link href="/docs" className="text-slate-300 hover:text-white transition-colors flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documentation
          </Link>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
