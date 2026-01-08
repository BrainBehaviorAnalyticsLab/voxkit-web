export default function Footer() {
    return (
    <footer className="pt-12 pb-4 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { title: 'Product', links: ['Features', 'Download', 'Documentation'] },
              { title: 'Support', links: ['Help Center', 'Tutorials', 'Contact'] },
              { title: 'Resources', links: ['User Guides', 'MFA', 'FAQ'] },
              { title: 'Community', links: ['Forum', 'Research Papers', 'Contribute'] }
            ].map((col) => (
              <div key={col.title} className="flex flex-col items-center text-center">
              <h4 className="font-semibold text-white mb-4">{col.title}</h4>
              <div className="space-y-2">
                {col.links.map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase().split(' ')[0]}`}
                  className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  {link}
                </a>
                ))}
              </div>
              </div>
            ))}
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch pt-4 border-t border-slate-700/50 text-sm">
            <div className="w-full md:w-1/3 text-center px-4 mb-0 md:mb-0 flex items-center justify-center">
              <img src="/collab.png" alt="Collaboration" className="hidden md:block mt-2 mb-0 h-20 w-auto object-contain" />
            </div>

            {/* vertical separator */}
            <div aria-hidden="true" className="hidden md:block border-l border-slate-700/50 mx-4"></div>

            <div className="w-full md:w-1/3 text-slate-400 text-center px-4 mb-0 md:mb-0 flex items-center justify-center">
              © 2025 BrainBehaviorAnalyticsLab
            </div>

            {/* vertical separator */}
            <div aria-hidden="true" className="hidden md:block border-l border-slate-700/50 mx-4"></div>

            <div className="w-full md:w-1/3 text-slate-400 text-center px-4 flex items-center justify-center">
              Built with ❤️ by the VoxKit Team
            </div>
            </div>
        </div>
      </footer>
      );
}