
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar({view='Home'}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    let desktopViews;
    let mobileViews;
    let selectedView;

    if (view === 'Home') {
        desktopViews = ['Download', 'Features', 'Foundations', 'Docs', 'Help', 'Feedback'];
        mobileViews = ['Features', 'Docs', 'Help', 'Feedback'];
        selectedView = ''
    } else {
        desktopViews = ['Home', view];
        mobileViews = desktopViews;
        selectedView = view;
    }

    return (
        <nav className="fixed w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-600 z-50 shadow-lg shadow-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-4 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                  <div className="w-1 h-6 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                  <div className="w-1 h-8 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                  <div className="w-1 h-10 bg-blue-500 rounded-full shadow-md shadow-blue-500/50"></div>
                  <div className="w-1 h-8 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                  <div className="w-1 h-6 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                  <div className="w-1 h-4 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                </div>
                <span className="text-2xl font-semibold text-white">VoxKit</span>
              </div>

              {/* Desktop Navigation - Improved hover & spacing */}
              <div className="hidden md:flex items-center space-x-1">
                {desktopViews.map((item) => (
                <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    key={item}
                    className={
                        selectedView === item
                            ? "px-4 py-2 text-white bg-white/10 rounded-lg font-medium opacity-70 cursor-not-allowed pointer-events-none"
                            : "px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                    }
                    aria-current={selectedView === item ? 'page' : undefined}
                    aria-disabled={selectedView === item ? true : undefined}
                    tabIndex={selectedView === item ? -1 : 0}
                >
                    {item}
                </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Navigation - Visible on all screens */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-600 bg-slate-900/95 backdrop-blur-sm">
            <div className="px-4 py-6 max-w-7xl mx-auto">
              {mobileViews.map((item, index) => (
                <div key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="block w-full text-left px-5 py-3 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                  {index < 2 && <div className="h-px bg-white/20 my-2 mx-4"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    )
}