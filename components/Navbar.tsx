
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-8 md:px-16 flex justify-between items-center ${
        isScrolled ? 'bg-black/40 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full border border-blue-500/50 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        </div>
        <span className="text-xl font-light tracking-[0.3em] uppercase">Cosmos</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-12">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-[10px] uppercase tracking-[0.4em] text-white/60 hover:text-white hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all"
          >
            {item.label}
          </a>
        ))}
        <button className="px-6 py-2 border border-white/20 text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-colors">
          Connect
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white/80">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-300">
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="absolute top-8 right-8 text-white/60 hover:text-white"
          >
            <X size={32} />
          </button>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-thin tracking-[0.5em] uppercase text-white/60 hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <button className="mt-8 px-12 py-4 border border-white/20 text-sm uppercase tracking-[0.3em]">
            Connect
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
