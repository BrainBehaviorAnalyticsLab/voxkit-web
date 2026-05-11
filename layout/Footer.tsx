import Image from 'next/image';
import Link from 'next/link';

type FooterLink = { label: string; href: string; external?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

const GITHUB_URL = 'https://github.com/BrainBehaviorAnalyticsLab/voxkit-desktop';

const columns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Download', href: '/download' },
      { label: 'Documentation', href: '/docs' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Tutorials', href: '/help/getting-started' },
      { label: 'Contact', href: `${GITHUB_URL}/issues`, external: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'User Guides', href: '/help/expected-workflow' },
      { label: 'MFA', href: 'https://montreal-forced-aligner.readthedocs.io/en/latest/index.html', external: true },
      { label: 'FAQ', href: '/help/troubleshooting' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Forum', href: `${GITHUB_URL}/discussions`, external: true },
      { label: 'Research Papers', href: '/foundations' },
      { label: 'Contribute', href: GITHUB_URL, external: true },
    ],
  },
];

export default function Footer() {
    return (
    <footer className="pt-12 pb-4 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col items-center text-center">
              <h4 className="font-semibold text-white mb-4">{col.title}</h4>
              <div className="space-y-2">
                {col.links.map((link) => (
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
              </div>
            ))}
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch pt-4 border-t border-slate-700/50 text-sm">
            <div className="w-full md:w-1/3 text-center px-4 mb-0 md:mb-0 flex items-center justify-center">
              <Image src="/collab.png" alt="Collaboration" width={160} height={80} className="hidden md:block mt-2 mb-0 h-20 w-auto object-contain" />
            </div>

            {/* vertical separator */}
            <div aria-hidden="true" className="hidden md:block border-l border-slate-700/50 mx-4"></div>

            <div className="w-full md:w-1/3 text-slate-400 text-center px-4 mb-0 md:mb-0 flex items-center justify-center">
              © 2026 WiscLab x BrainBehaviorAnalyticsLab
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
