import React from 'react';
import { Rss } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-brand-50 py-8 border-t border-brand-200/50">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-brand-500 text-xs font-light tracking-wide">
          © {new Date().getFullYear()} Maxime Larrieu-Panini. {t('footer.built')}
        </p>
        <div className="flex items-center gap-6 text-xs text-brand-500 font-light">
          <a
            href="/feed"
            target="_blank"
            rel="noopener noreferrer"
            title="Flux RSS"
            className="inline-flex items-center gap-1.5 text-brand-600 hover:text-accent-soft transition-colors font-medium"
          >
            <Rss className="w-3.5 h-3.5 text-accent-warm" />
            <span>Flux RSS</span>
          </a>
          <span>{t('footer.location')}</span>
        </div>
      </div>
    </footer>
  );
};
