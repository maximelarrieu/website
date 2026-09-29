
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection, onNavigateHome }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.experience'), href: '#experience' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.blog'), href: '#lab' },
    { name: t('nav.skills'), href: '#skills' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const sectionId = href.replace(/^#\/?/, '').replace(/^\//, '');

    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else if (onNavigateHome && !sectionId) {
      onNavigateHome();
    } else {
      const isArticleOrSubpage = window.location.pathname !== '/' && window.location.pathname !== '';
      if (isArticleOrSubpage) {
        window.history.pushState(null, '', sectionId ? `/#${sectionId}` : '/');
        window.dispatchEvent(new Event('popstate'));
      } else if (sectionId) {
        window.history.pushState(null, '', `#${sectionId}`);
      }

      setTimeout(() => {
        if (sectionId) {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 bg-brand-100/80 border border-brand-200/50 rounded-full p-0.5">
      <button 
        onClick={() => setLanguage('fr')} 
        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all ${
          language === 'fr' 
            ? 'bg-accent-soft text-white shadow-sm' 
            : 'text-brand-500 hover:text-brand-900'
        }`}
      >
        FR
      </button>
      <button 
        onClick={() => setLanguage('en')} 
        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all ${
          language === 'en' 
            ? 'bg-accent-soft text-white shadow-sm' 
            : 'text-brand-500 hover:text-brand-900'
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-brand-50/95 backdrop-blur-md border-b border-brand-200/60 py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a 
          href="/" 
          onClick={(e) => handleLinkClick(e, '')}
          className="text-lg font-serif font-bold text-brand-900 tracking-tight cursor-pointer"
        >
          Maxime Larrieu-Panini<span className="text-accent-soft">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-xs font-bold uppercase tracking-widest text-brand-500 hover:text-brand-900 transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          
          <LanguageSwitcher />

          <a 
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="px-5 py-2 rounded-full bg-accent-soft hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-accent-soft/10 active:scale-95 cursor-pointer"
          >
            {t('nav.sayHello')}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <button 
            className="text-brand-900 font-medium"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-brand-50 border-b border-brand-200/60 p-8 md:hidden flex flex-col gap-6 shadow-xl backdrop-blur-2xl">
          {navLinks.map(link => (
            <a 
              key={link.href} 
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-lg font-bold text-brand-900 hover:text-accent-soft transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact')}
            className="w-full py-3.5 bg-accent-soft text-white text-center rounded-xl font-bold transition-colors cursor-pointer"
          >
            {t('nav.sayHello')}
          </a>
        </div>
      )}
    </nav>
  );
};
