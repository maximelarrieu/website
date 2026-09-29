import React, { lazy, Suspense, useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Blog } from './components/Blog';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AIChat } from './components/AIChat';
import { ArticlePage } from './components/ArticlePage';

const KeystaticAdmin = lazy(() => import('./components/KeystaticAdmin').then(m => ({ default: m.KeystaticAdmin })));

function parseArticleRoute(): { slug: string; lang: 'fr' | 'en' } | null {
  const pathname = window.location.pathname;
  const hash = window.location.hash;

  // 1. English routes: /en/blog/, /en/article/, /en/posts/
  if (pathname.startsWith('/en/blog/')) {
    const slug = pathname.replace('/en/blog/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'en' };
  }
  if (pathname.startsWith('/en/article/')) {
    const slug = pathname.replace('/en/article/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'en' };
  }
  if (pathname.startsWith('/en/posts/')) {
    const slug = pathname.replace('/en/posts/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'en' };
  }

  // English hashes
  if (hash.startsWith('#/en/blog/')) {
    const slug = hash.replace('#/en/blog/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'en' };
  }
  if (hash.startsWith('#/en/article/')) {
    const slug = hash.replace('#/en/article/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'en' };
  }
  if (hash.startsWith('#/en/posts/')) {
    const slug = hash.replace('#/en/posts/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'en' };
  }

  // 2. Default (French) routes: /blog/, /article/, /posts/
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'fr' };
  }
  if (pathname.startsWith('/article/')) {
    const slug = pathname.replace('/article/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'fr' };
  }
  if (pathname.startsWith('/posts/')) {
    const slug = pathname.replace('/posts/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'fr' };
  }

  // French hashes
  if (hash.startsWith('#/blog/')) {
    const slug = hash.replace('#/blog/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'fr' };
  }
  if (hash.startsWith('#/article/')) {
    const slug = hash.replace('#/article/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'fr' };
  }
  if (hash.startsWith('#/posts/')) {
    const slug = hash.replace('#/posts/', '').replace(/\/$/, '').trim();
    if (slug) return { slug, lang: 'fr' };
  }

  // Handle direct slug e.g. /transformation-d-un-mini-pc-en-orchestrateur-ia-multi-agents
  const cleanPath = pathname.replace(/^\//, '').replace(/\/$/, '').trim();
  if (
    cleanPath &&
    !['keystatic', 'api', 'images', 'assets', 'src', 'node_modules', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'en', 'feed', 'rss'].some(p => cleanPath.startsWith(p)) &&
    !cleanPath.includes('.') &&
    !cleanPath.includes('/')
  ) {
    return { slug: cleanPath, lang: 'fr' };
  }

  return null;
}

const AppContent: React.FC = () => {
  const isKeystatic = window.location.pathname.startsWith('/keystatic');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(() => {
    const route = parseArticleRoute();
    return route ? route.slug : null;
  });
  const { language } = useLanguage();

  useEffect(() => {
    const handleLocationChange = () => {
      const route = parseArticleRoute();
      setCurrentArticleSlug(route ? route.slug : null);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Prevent scroll locks
  useEffect(() => {
    if (!isKeystatic) {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
  }, [isKeystatic]);

  const handleNavigateHome = () => {
    const targetUrl = language === 'en' ? '/en#lab' : '/#lab';
    window.history.pushState(null, '', targetUrl);
    setCurrentArticleSlug(null);
    setTimeout(() => {
      const labEl = document.getElementById('lab');
      if (labEl) {
        labEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNavigateSection = (sectionId: string) => {
    const prefix = language === 'en' ? '/en' : '';
    const targetUrl = sectionId ? `${prefix}/#${sectionId}` : (prefix || '/');
    window.history.pushState(null, '', targetUrl);
    setCurrentArticleSlug(null);
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
  };

  const handleNavigateToPost = (slug: string, targetLang?: 'fr' | 'en') => {
    const lang = targetLang || (language === 'en' ? 'en' : 'fr');
    const path = lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`;
    window.history.pushState(null, '', path);
    setCurrentArticleSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isKeystatic) {
    return (
      <Suspense fallback={<div className="p-8 text-center font-mono text-brand-500">Chargement de l'administration...</div>}>
        <KeystaticAdmin />
      </Suspense>
    );
  }

  if (currentArticleSlug) {
    return (
      <>
        <ArticlePage
          slug={currentArticleSlug}
          onNavigateHome={handleNavigateHome}
          onNavigateToPost={handleNavigateToPost}
          onNavigateSection={handleNavigateSection}
        />
        <AIChat />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900 font-sans">
      <Navbar onNavigateHome={handleNavigateHome} onNavigateSection={handleNavigateSection} />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Blog onNavigateToPost={handleNavigateToPost} />
        <Skills />
        <Contact />
      </main>
      <AIChat />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
