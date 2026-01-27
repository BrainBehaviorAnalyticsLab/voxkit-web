"use client"
import { Footer, Navbar } from '../../layout';
import helpContent from '../../data/help-content.json';
import Link from 'next/link';

interface HelpTopic {
  title: string;
  description: string;
  icon: string;
}

type HelpContent = {
  [key: string]: HelpTopic;
}

const typedHelpContent = helpContent as HelpContent;

export default function HelpPage() {
  const topics = Object.entries(typedHelpContent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Help" />
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Find answers, learn features, and get the most out of VoxKit with our comprehensive guides and documentation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search help topics..."
              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              onInput={(e) => {
                const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
                document.querySelectorAll('[data-topic]').forEach(card => {
                  const topic = card.getAttribute('data-topic') || '';
                  const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                  const desc = card.querySelector('p')?.textContent?.toLowerCase() || '';
                  if (title.includes(searchTerm) || desc.includes(searchTerm) || topic.includes(searchTerm)) {
                    (card as HTMLElement).style.display = '';
                  } else {
                    (card as HTMLElement).style.display = 'none';
                  }
                });
              }}
            />
            <svg 
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Help Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {topics.map(([key, topic]) => (
            <Link
              key={key}
              href={`/help/${key}`}
              data-topic={key}
              className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start mb-4">
                <span className="text-5xl mr-4">{topic.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                </div>
                <svg 
                  className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Quick Access</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="https://github.com/BrainBehaviorAnalyticsLab/voxkit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center p-6 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">GitHub</h3>
              <p className="text-sm text-slate-400">Report issues and contribute</p>
            </a>

            <a 
              href="mailto:support@voxkit.dev"
              className="flex flex-col items-center text-center p-6 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all group"
            >
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-slate-400">Get help from our team</p>
            </a>

            <Link 
              href="/docs"
              className="flex flex-col items-center text-center p-6 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all group"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-slate-400">Complete API reference</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
