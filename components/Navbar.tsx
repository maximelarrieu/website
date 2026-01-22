
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Lab', href: '#lab' },
    { name: 'Skills', href: '#skills' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-brand-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-xl font-serif font-bold text-white tracking-tighter">
          Maxime Larrieu-Panini<span className="text-indigo-500">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            Hire Expert
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-brand-950 border-b border-slate-800 p-8 md:hidden flex flex-col gap-6 shadow-2xl backdrop-blur-2xl">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-4 bg-indigo-600 text-white text-center rounded-xl font-bold"
          >
            Hire Expert
          </a>
        </div>
      )}
    </nav>
  );
};
