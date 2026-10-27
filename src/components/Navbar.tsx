import React, { useState } from 'react';
import { Home, Sparkles, Compass, BarChart3, Info, History, Menu, X, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  historyCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'predict', label: 'Predict Price' },
    { id: 'explore', label: 'Explore Properties' },
    { id: 'insights', label: 'Market Insights' },
    { id: 'about', label: 'About Model' },
    { id: 'history', label: `History (${historyCount})` }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with intelligent brand icon */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              HomeWise <span className="text-emerald-600 dark:text-emerald-400">AI</span>
            </span>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                  activeTab === link.id
                    ? 'text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400 font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action button + theme toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveTab('predict')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-sm whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Predict Price</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setActiveTab('predict');
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-2.5 text-center text-xs font-semibold text-white bg-emerald-600 rounded-lg"
          >
            Predict Price Now
          </button>
        </div>
      )}
    </header>
  );
};
