import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Check, Copy, BookOpen, User, Tag, Globe, Folder, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DocumentRenderer, DocumentRendererProps } from '@keystatic/core/renderer';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const customDocumentRenderers: DocumentRendererProps['renderers'] = {
  heading: ({ level, children }) => {
    switch (level) {
      case 1:
        return (
          <h1 className="text-2xl md:text-4xl font-bold font-serif text-brand-900 mt-10 mb-5 pb-3 border-b border-brand-200 leading-tight">
            {children}
          </h1>
        );
      case 2:
        return (
          <h2 className="text-xl md:text-3xl font-bold font-serif text-brand-900 mt-8 mb-4 leading-tight">
            {children}
          </h2>
        );
      case 3:
        return (
          <h3 className="text-lg md:text-2xl font-bold font-sans text-brand-900 mt-6 mb-3 leading-snug">
            {children}
          </h3>
        );
      case 4:
        return (
          <h4 className="text-base md:text-xl font-semibold font-sans text-accent-soft mt-5 mb-2">
            {children}
          </h4>
        );
      default:
        return (
          <h2 className="text-xl md:text-3xl font-bold font-serif text-brand-900 mt-8 mb-4 leading-tight">
            {children}
          </h2>
        );
    }
  },
  paragraph: ({ children }) => (
    <p className="text-brand-900 text-base md:text-lg leading-relaxed my-4">{children}</p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent-soft bg-brand-100/60 p-4 md:p-6 rounded-r-xl my-6 text-brand-700 italic">
      {children}
    </blockquote>
  ),
  divider: () => <hr className="my-8 border-brand-200" />,
  code: ({ children }) => (
    <pre className="bg-brand-950 text-brand-100 p-5 rounded-2xl overflow-x-auto my-6 text-sm font-mono border border-brand-900">
      <code>{children}</code>
    </pre>
  ),
};

interface CombinedBlogPost {
  id: string;
  title: string;
  titleEn?: string;
  titleKey?: string;
  date: string;
  category: string;
  categoryEn?: string;
  categoryKey?: string;
  orderInSeries?: number;
  readTime: string;
  readTimeEn?: string;
  readTimeKey?: string;
  imageUrl: string;
  excerpt: string;
  excerptEn?: string;
  excerptKey?: string;
  content: any;
  contentEn?: any;
  contentKey?: string;
  isDynamic?: boolean;
}

const staticPosts: CombinedBlogPost[] = [
  {
    id: '1',
    title: '',
    titleKey: 'blog.1.title',
    date: '24 oct. 2025',
    category: 'Architecture Cloud',
    categoryEn: 'Cloud Architecture',
    categoryKey: 'blog.1.category',
    readTime: '',
    readTimeKey: 'blog.1.readTime',
    imageUrl: '/images/posts/gcp.jpg',
    excerpt: '',
    excerptKey: 'blog.1.excerpt',
    content: '',
    contentKey: 'blog.1.content'
  },
  {
    id: '2',
    title: '',
    titleKey: 'blog.2.title',
    date: '12 oct. 2025',
    category: 'Découvertes',
    categoryEn: 'Discoveries',
    categoryKey: 'blog.2.category',
    readTime: '',
    readTimeKey: 'blog.2.readTime',
    imageUrl: '/images/posts/engineerai.jpg',
    excerpt: '',
    excerptKey: 'blog.2.excerpt',
    content: '',
    contentKey: 'blog.2.content'
  }
];

const rawPosts = import.meta.glob('../content/posts/*.json', { eager: true }) as Record<string, any>;

const dynamicPosts: CombinedBlogPost[] = Object.entries(rawPosts).map(([path, file]) => {
  const slug = path.split('/').pop()?.replace('.json', '') || '';
  const data = file.default || file;
  const rawImage = data.coverImage || data.imageUrl;
  let imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800';
  if (typeof rawImage === 'string' && rawImage.trim()) {
    imageUrl = rawImage;
  } else if (typeof rawImage === 'object' && rawImage?.src) {
    imageUrl = rawImage.src;
  }

  return {
    id: slug,
    title: data.title || '',
    titleEn: data.titleEn || '',
    date: data.date || '',
    category: data.category || '',
    categoryEn: data.categoryEn || '',
    orderInSeries: typeof data.orderInSeries === 'number' ? data.orderInSeries : undefined,
    readTime: data.readTime || '',
    readTimeEn: data.readTimeEn || '',
    imageUrl,
    excerpt: data.excerpt || '',
    excerptEn: data.excerptEn || '',
    content: data.content || '',
    contentEn: data.contentEn || '',
    isDynamic: true,
  };
});

interface ArticlePageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateToPost: (slug: string) => void;
  onNavigateSection?: (sectionId: string) => void;
}

function sanitizeImageUrl(url?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200';
  if (url.includes('maximelarrieu.io/images/')) {
    return url.substring(url.indexOf('/images/'));
  }
  return url;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug, onNavigateHome, onNavigateToPost, onNavigateSection }) => {
  const { t, language, setLanguage } = useLanguage();
  const [posts, setPosts] = useState<CombinedBlogPost[]>([...staticPosts, ...dynamicPosts]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when article loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch('/api/posts')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: CombinedBlogPost[]) => {
        if (Array.isArray(data)) {
          const dynamicFetched = data.map(item => ({ ...item, isDynamic: true }));
          setPosts([...staticPosts, ...dynamicFetched]);
        }
      })
      .catch(err => {
        console.warn('Could not fetch latest posts from API, falling back:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  const post = posts.find(p => p.id === slug);

  // Active displayed fields computed from navbar language selection
  const isEn = language === 'en';
  const hasEnglishContent = Boolean(post?.isDynamic && (post.contentEn?.trim() || post.titleEn?.trim()));

  const displayTitle = post
    ? (isEn && post.titleEn?.trim() ? post.titleEn : (post.isDynamic ? post.title : t(post.titleKey!)))
    : '';

  const displayCategory = post
    ? (isEn && post.categoryEn?.trim() ? post.categoryEn : (post.isDynamic ? post.category : t(post.categoryKey!)))
    : '';

  const displayReadTime = post
    ? (post.isDynamic ? (isEn && post.readTimeEn?.trim() ? post.readTimeEn : post.readTime) : `${t(post.readTimeKey!)} ${t('blog.readtime')}`)
    : '';

  const displayExcerpt = post
    ? (isEn && post.excerptEn?.trim() ? post.excerptEn : (post.isDynamic ? post.excerpt : t(post.excerptKey!)))
    : '';

  const displayContent = post
    ? (isEn && post.contentEn?.trim() ? post.contentEn : (post.isDynamic ? post.content : t(post.contentKey!)))
    : '';

  // Update Page Title, OpenGraph, Meta Description, Canonical link, Hreflang, and Schema.org JSON-LD for Google Search & SEO
  useEffect(() => {
    const isEn = language === 'en';
    const siteSubtitle = isEn ? "Study Journal" : "Carnet d'étude";
    if (displayTitle) {
      document.title = `${displayTitle} | Maxime Larrieu-Panini - ${siteSubtitle}`;
    } else {
      document.title = `Article | Maxime Larrieu-Panini`;
    }

    if (post) {
      const frUrl = `https://maximelarrieu.io/blog/${slug}`;
      const enUrl = `https://maximelarrieu.io/en/blog/${slug}`;
      const canonicalUrl = isEn ? enUrl : frUrl;
      const desc = displayExcerpt || `${displayTitle} - Article par Maxime Larrieu-Panini`;
      const img = post.imageUrl.startsWith('/') ? `https://maximelarrieu.io${post.imageUrl}` : post.imageUrl;

      // Update or create meta tags
      const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
        let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attrName, attrVal);
          document.head.appendChild(el);
        }
        el.setAttribute('content', contentVal);
      };

      setMetaTag('name', 'description', desc);
      setMetaTag('property', 'og:title', displayTitle);
      setMetaTag('property', 'og:description', desc);
      setMetaTag('property', 'og:image', img);
      setMetaTag('property', 'og:image:secure_url', img);
      setMetaTag('property', 'og:url', canonicalUrl);
      setMetaTag('property', 'og:locale', isEn ? 'en_US' : 'fr_FR');
      setMetaTag('property', 'og:locale:alternate', isEn ? 'fr_FR' : 'en_US');
      setMetaTag('property', 'og:type', 'article');
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', displayTitle);
      setMetaTag('name', 'twitter:description', desc);
      setMetaTag('name', 'twitter:image', img);
      setMetaTag('name', 'twitter:url', canonicalUrl);

      // Canonical link
      let linkEl = document.querySelector('link[rel="canonical"]');
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'canonical');
        document.head.appendChild(linkEl);
      }
      linkEl.setAttribute('href', canonicalUrl);

      // Hreflang alternate links for international SEO
      const setHreflang = (langCode: string, hrefVal: string) => {
        let altEl = document.querySelector(`link[rel="alternate"][hreflang="${langCode}"]`);
        if (!altEl) {
          altEl = document.createElement('link');
          altEl.setAttribute('rel', 'alternate');
          altEl.setAttribute('hreflang', langCode);
          document.head.appendChild(altEl);
        }
        altEl.setAttribute('href', hrefVal);
      };

      setHreflang('fr', frUrl);
      setHreflang('en', enUrl);
      setHreflang('x-default', frUrl);

      // JSON-LD Schema.org BlogPosting
      let jsonLdEl = document.getElementById('json-ld-article');
      if (!jsonLdEl) {
        jsonLdEl = document.createElement('script');
        jsonLdEl.setAttribute('type', 'application/ld+json');
        jsonLdEl.setAttribute('id', 'json-ld-article');
        document.head.appendChild(jsonLdEl);
      }
      jsonLdEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': displayTitle,
        'description': desc,
        'inLanguage': isEn ? 'en-US' : 'fr-FR',
        'image': [img],
        'datePublished': post.date || '2026-08-06',
        'author': {
          '@type': 'Person',
          'name': 'Maxime Larrieu-Panini',
          'url': 'https://maximelarrieu.io'
        },
        'publisher': {
          '@type': 'Person',
          'name': 'Maxime Larrieu-Panini',
          'url': 'https://maximelarrieu.io'
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl
        }
      });
    }
  }, [displayTitle, displayExcerpt, post, slug, language]);

  const copyDirectLink = () => {
    const fullUrl = window.location.href;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper to extract localized category / folder name
  const getPostFolderName = (p: CombinedBlogPost): string => {
    if (p.isDynamic) {
      const cat = isEn && p.categoryEn?.trim() ? p.categoryEn : p.category;
      return cat?.trim() || 'Général';
    }
    if (p.categoryKey) {
      return t(p.categoryKey) || 'Général';
    }
    const cat = isEn && p.categoryEn?.trim() ? p.categoryEn : p.category;
    return cat?.trim() || 'Général';
  };

  const currentFolder = post ? getPostFolderName(post) : '';

  // All articles in the current folder/saga, sorted by orderInSeries then date ascending
  const folderArticles = useMemo(() => {
    if (!currentFolder) return [];
    return posts
      .filter(p => getPostFolderName(p).toLowerCase() === currentFolder.toLowerCase())
      .sort((a, b) => {
        if (a.orderInSeries !== undefined && b.orderInSeries !== undefined) {
          return a.orderInSeries - b.orderInSeries;
        }
        if (a.orderInSeries !== undefined) return -1;
        if (b.orderInSeries !== undefined) return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [posts, currentFolder, isEn]);

  const currentSagaIndex = folderArticles.findIndex(p => p.id === slug);
  const isMultiPartSaga = folderArticles.length > 1;

  const prevSagaPost = currentSagaIndex > 0 ? folderArticles[currentSagaIndex - 1] : null;
  const nextSagaPost = currentSagaIndex >= 0 && currentSagaIndex < folderArticles.length - 1 ? folderArticles[currentSagaIndex + 1] : null;

  // Other posts in the same folder (excluding current)
  const sameFolderOtherPosts = useMemo(() => {
    return folderArticles.filter(p => p.id !== slug);
  }, [folderArticles, slug]);

  // Fallback / complement posts from other folders
  const otherFolderPosts = useMemo(() => {
    return posts
      .filter(p => p.id !== slug && getPostFolderName(p).toLowerCase() !== currentFolder.toLowerCase())
      .slice(0, 3);
  }, [posts, slug, currentFolder, isEn]);

  if (!post && !isLoading) {
    return (
      <div className="min-h-screen bg-brand-50 text-brand-900 flex flex-col justify-between">
        <Navbar onNavigateHome={onNavigateHome} onNavigateSection={onNavigateSection} />
        <main className="container mx-auto px-6 py-32 text-center max-w-xl">
          <BookOpen className="w-16 h-16 text-brand-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-serif mb-4">{t('article.notFound')}</h1>
          <p className="text-brand-500 mb-8 font-light">{t('article.notFoundDesc')}</p>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 text-white rounded-full text-sm font-semibold hover:bg-brand-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('article.back')}
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900 font-sans flex flex-col justify-between">
      <Navbar onNavigateHome={onNavigateHome} onNavigateSection={onNavigateSection} />

      <main className="pt-28 pb-24 flex-1">
        {/* Navigation Breadcrumb & Back button */}
        <div className="container mx-auto px-6 max-w-4xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-brand-200/60">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-soft hover:text-brand-900 transition-colors bg-white border border-brand-200 px-4 py-2 rounded-full shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('article.back')}
            </button>

            <div className="flex items-center gap-2.5">
              {/* Language Switcher Pill */}
              <div className="inline-flex items-center bg-white border border-brand-200/80 rounded-full p-0.5 shadow-xs">
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    !isEn
                      ? 'bg-accent-soft text-white shadow-xs'
                      : 'text-brand-600 hover:text-brand-900'
                  }`}
                  title="Version française"
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    isEn
                      ? 'bg-accent-soft text-white shadow-xs'
                      : 'text-brand-600 hover:text-brand-900'
                  }`}
                  title="English version"
                >
                  EN
                </button>
              </div>

              {/* Direct Link Copy Button */}
              <button
                onClick={copyDirectLink}
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 bg-white hover:bg-brand-100 border border-brand-200/80 px-4 py-2 rounded-full transition-all shadow-xs"
                title={t('article.share')}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t('article.copied') : t('article.copyLink')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Container */}
        <article className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-brand-200/80 rounded-3xl overflow-hidden shadow-xl"
          >
            {/* Header Banner */}
            <div className="relative h-72 md:h-96 overflow-hidden bg-brand-900">
              <img
                src={sanitizeImageUrl(post?.imageUrl)}
                alt={displayTitle}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes('unsplash.com')) {
                    target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200';
                  }
                }}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent" />
              
              <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3.5 py-1 bg-accent-soft text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                    <Folder className="w-3 h-3" />
                    {displayCategory}
                  </span>
                  {typeof post?.orderInSeries === 'number' && (
                    <span className="px-2.5 py-1 bg-brand-900/80 backdrop-blur-sm text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                      {t('article.saga.part')} {post.orderInSeries}
                    </span>
                  )}
                  {hasEnglishContent && (
                    <span className="px-2.5 py-1 bg-emerald-700/90 backdrop-blur-sm text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                      {t('article.bilingualBadge')}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white font-serif leading-tight">
                  {displayTitle}
                </h1>
              </div>
            </div>

            {/* Fallback Notice Bar if post is only in French and user selected EN */}
            {post?.isDynamic && isEn && !hasEnglishContent && (
              <div className="px-6 md:px-12 py-3.5 bg-amber-50 border-b border-amber-200/80 flex items-center gap-3 text-xs text-amber-900">
                <Globe className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-medium">{t('article.frOnlyBanner')}</span>
              </div>
            )}

            {/* Metadata bar */}
            <div className="px-6 md:px-12 py-6 bg-brand-50/80 border-b border-brand-200/60 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-brand-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-soft/20 text-accent-soft flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-brand-900 font-bold leading-tight">{t('article.author')}</p>
                  <p className="text-[11px] text-brand-500 font-light">{t('article.consultant')}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-brand-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent-soft" />
                  {post?.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-accent-soft" />
                  {displayReadTime}
                </span>
              </div>
            </div>

            {/* Excerpt intro highlight */}
            {displayExcerpt && (
              <div className="px-6 md:px-12 pt-8 pb-4">
                <p className="text-brand-700 text-lg md:text-xl font-serif italic border-l-4 border-accent-soft pl-6 py-2 bg-brand-50/50 rounded-r-xl leading-relaxed">
                  "{displayExcerpt}"
                </p>
              </div>
            )}

            {/* Interactive Saga / Dossier Navigation & Stepper */}
            {isMultiPartSaga && (
              <div className="mx-6 md:mx-12 my-6 p-5 md:p-6 bg-brand-100/70 border border-brand-200/80 rounded-2xl shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-200/70">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-accent-soft text-white rounded-xl shadow-xs">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-accent-soft tracking-wider block">
                        {t('article.saga.title')}
                      </span>
                      <h3 className="font-serif font-bold text-base md:text-lg text-brand-900 leading-tight">
                        {currentFolder}
                      </h3>
                    </div>
                  </div>
                  <span className="self-start sm:self-center px-3 py-1 bg-white text-brand-700 text-xs font-semibold rounded-full border border-brand-200/80 shadow-2xs">
                    {t('article.saga.part')} {currentSagaIndex + 1} / {folderArticles.length}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-brand-600 font-medium mb-3">
                    {t('article.saga.partOf')} :
                  </p>
                  <div className="space-y-2">
                    {folderArticles.map((sp, idx) => {
                      const isCurrent = sp.id === post?.id;
                      const spTitle = sp.isDynamic
                        ? (isEn && sp.titleEn?.trim() ? sp.titleEn : sp.title)
                        : t(sp.titleKey!);
                      const spReadTime = sp.isDynamic
                        ? (isEn && sp.readTimeEn?.trim() ? sp.readTimeEn : sp.readTime)
                        : `${t(sp.readTimeKey!)} ${t('blog.readtime')}`;

                      return (
                        <div
                          key={sp.id}
                          onClick={() => !isCurrent && onNavigateToPost(sp.id)}
                          className={`flex items-center justify-between p-3 rounded-xl text-xs transition-all ${
                            isCurrent
                              ? 'bg-white border-2 border-accent-soft text-brand-900 shadow-xs font-semibold'
                              : 'bg-white/70 hover:bg-white border border-brand-200/70 text-brand-700 hover:text-accent-soft cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                              isCurrent ? 'bg-accent-soft text-white' : 'bg-brand-200/70 text-brand-700'
                            }`}>
                              {sp.orderInSeries ?? (idx + 1)}
                            </span>
                            <span className="truncate">{spTitle}</span>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {isCurrent ? (
                              <span className="text-[10px] uppercase font-bold text-accent-soft tracking-wider px-2 py-0.5 bg-accent-soft/10 rounded-md">
                                {t('article.saga.current')}
                              </span>
                            ) : (
                              <span className="text-[11px] text-brand-400 font-light flex items-center gap-1">
                                {spReadTime} <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Prev / Next Step Buttons */}
                  {(prevSagaPost || nextSagaPost) && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-brand-200/60">
                      {prevSagaPost ? (
                        <button
                          onClick={() => onNavigateToPost(prevSagaPost.id)}
                          className="flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-accent-soft transition-colors text-left py-1"
                        >
                          <ChevronLeft className="w-4 h-4 text-accent-soft shrink-0" />
                          <span className="truncate">
                            <span className="block text-[10px] text-brand-400 uppercase font-semibold">{t('article.saga.prev')}</span>
                            {prevSagaPost.isDynamic ? (isEn && prevSagaPost.titleEn ? prevSagaPost.titleEn : prevSagaPost.title) : t(prevSagaPost.titleKey!)}
                          </span>
                        </button>
                      ) : <div />}

                      {nextSagaPost && (
                        <button
                          onClick={() => onNavigateToPost(nextSagaPost.id)}
                          className="flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-accent-soft transition-colors text-right justify-end ml-auto py-1"
                        >
                          <span className="truncate">
                            <span className="block text-[10px] text-brand-400 uppercase font-semibold">{t('article.saga.next')}</span>
                            {nextSagaPost.isDynamic ? (isEn && nextSagaPost.titleEn ? nextSagaPost.titleEn : nextSagaPost.title) : t(nextSagaPost.titleKey!)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-accent-soft shrink-0" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main Article Content Body */}
            <div className="p-6 md:p-12 text-brand-900 text-base leading-relaxed space-y-6 blog-content">
              {typeof displayContent === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: displayContent }} />
              ) : (
                <DocumentRenderer document={displayContent || []} renderers={customDocumentRenderers} />
              )}
            </div>

            {/* Social Sharing & Direct Article Link Footer */}
            <div className="px-6 md:px-12 py-8 bg-brand-50 border-t border-brand-200/60 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-accent-soft" />
                <span className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                  {t('article.share')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={copyDirectLink}
                  className="px-4 py-2 bg-white border border-brand-200 rounded-full text-xs font-semibold text-brand-800 hover:bg-brand-100 transition-colors shadow-xs flex items-center gap-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t('article.copied') : t('article.copyLink')}
                </button>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  LinkedIn
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(displayTitle)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  X (Twitter)
                </a>
              </div>
            </div>
          </motion.div>

          {/* Priority 1: Articles in the same folder / saga */}
          {sameFolderOtherPosts.length > 0 && (
            <div className="mt-16">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-serif font-bold text-brand-900 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-accent-soft" />
                  <span>{t('article.saga.readSameFolder')} :</span>
                  <span className="text-accent-soft font-serif">{currentFolder}</span>
                </h3>
                <span className="px-3 py-1 bg-accent-soft/10 text-accent-soft text-xs font-bold rounded-full border border-accent-soft/20">
                  {t('blog.folder.seriesBadge')} • {sameFolderOtherPosts.length + 1} {t('blog.folder.articles')}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sameFolderOtherPosts.map(p => {
                  const pTitle = p.isDynamic 
                    ? (isEn && p.titleEn?.trim() ? p.titleEn : p.title) 
                    : t(p.titleKey!);
                  const pCat = getPostFolderName(p);
                  const pExcerpt = p.isDynamic 
                    ? (isEn && p.excerptEn?.trim() ? p.excerptEn : p.excerpt) 
                    : t(p.excerptKey!);
                  const pReadTime = p.isDynamic
                    ? (isEn && p.readTimeEn?.trim() ? p.readTimeEn : p.readTime)
                    : `${t(p.readTimeKey!)} ${t('blog.readtime')}`;

                  return (
                    <div
                      key={p.id}
                      onClick={() => onNavigateToPost(p.id)}
                      className="bg-white border border-brand-200/90 rounded-2xl overflow-hidden p-5 cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[10px] font-bold text-accent-soft uppercase tracking-wider flex items-center gap-1">
                            <Folder className="w-3 h-3" />
                            {pCat}
                          </span>
                          {typeof p.orderInSeries === 'number' && (
                            <span className="px-2 py-0.5 bg-brand-900 text-white text-[9px] font-bold rounded-full">
                              {t('article.saga.part')} {p.orderInSeries}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-brand-900 group-hover:text-accent-soft transition-colors text-base leading-snug line-clamp-2 mb-2">
                          {pTitle}
                        </h4>
                        <p className="text-xs text-brand-500 font-light line-clamp-2 mb-4">
                          {pExcerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-brand-100 text-[11px] text-brand-400 font-light">
                        <span>{pReadTime}</span>
                        <span className="text-accent-soft font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          {t('blog.read')} <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Priority 2: Other topics and recent articles */}
          {otherFolderPosts.length > 0 && (
            <div className={sameFolderOtherPosts.length > 0 ? "mt-12 pt-10 border-t border-brand-200/80" : "mt-16"}>
              <h3 className="text-xl font-serif font-bold text-brand-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-soft" />
                {sameFolderOtherPosts.length > 0 ? t('article.saga.otherFolders') : t('article.readNext')}
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherFolderPosts.map(p => {
                  const pTitle = p.isDynamic 
                    ? (isEn && p.titleEn?.trim() ? p.titleEn : p.title) 
                    : t(p.titleKey!);
                  const pCat = getPostFolderName(p);
                  const pExcerpt = p.isDynamic 
                    ? (isEn && p.excerptEn?.trim() ? p.excerptEn : p.excerpt) 
                    : t(p.excerptKey!);
                  const pReadTime = p.isDynamic
                    ? (isEn && p.readTimeEn?.trim() ? p.readTimeEn : p.readTime)
                    : `${t(p.readTimeKey!)} ${t('blog.readtime')}`;

                  return (
                    <div
                      key={p.id}
                      onClick={() => onNavigateToPost(p.id)}
                      className="bg-white border border-brand-200 rounded-2xl overflow-hidden p-5 cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1">
                            <Folder className="w-3 h-3 text-brand-400" />
                            {pCat}
                          </span>
                          {typeof p.orderInSeries === 'number' && (
                            <span className="px-2 py-0.5 bg-brand-200 text-brand-700 text-[9px] font-bold rounded-full">
                              {t('article.saga.part')} {p.orderInSeries}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-brand-900 group-hover:text-accent-soft transition-colors text-base leading-snug line-clamp-2 mb-2">
                          {pTitle}
                        </h4>
                        <p className="text-xs text-brand-500 font-light line-clamp-2 mb-4">
                          {pExcerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-brand-100 text-[11px] text-brand-400 font-light">
                        <span>{pReadTime}</span>
                        <span className="text-accent-soft font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          {t('blog.read')} <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />

      <style>{`
        .blog-content h2 { color: #2C2A29; font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; font-family: Playfair Display, serif; }
        .blog-content h3 { color: #5E7065; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .blog-content ul { list-style: disc; padding-left: 1.5rem; margin: 1.25rem 0; }
        .blog-content li { margin-bottom: 0.5rem; font-weight: 300; color: #4A4643; }
        .blog-content p { color: #4A4643; font-weight: 300; line-height: 1.75; font-size: 1.05rem; }
        .blog-content blockquote { border-left: 4px solid #5E7065; padding-left: 1rem; font-style: italic; color: #5E7065; margin: 1.5rem 0; }
        .blog-content code { background-color: #F4F1EA; padding: 0.2rem 0.4rem; rounded: 4px; font-family: monospace; font-size: 0.9rem; color: #2C2A29; }
      `}</style>
    </div>
  );
};
