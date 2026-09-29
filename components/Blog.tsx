import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Trophy, Folder, Layers, ChevronDown } from 'lucide-react';
import { useLanguage } from './LanguageContext';

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

interface BlogProps {
  onNavigateToPost?: (slug: string) => void;
}

function sanitizeImageUrl(url?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200';
  if (url.includes('maximelarrieu.io/images/')) {
    return url.substring(url.indexOf('/images/'));
  }
  return url;
}

function parseDateToTimestamp(dateStr?: string): number {
  if (!dateStr) return 0;
  const direct = Date.parse(dateStr);
  if (!isNaN(direct)) return direct;

  const months: Record<string, number> = {
    'janv': 0, 'janvier': 0, 'jan': 0, 'january': 0,
    'févr': 1, 'fevr': 1, 'février': 1, 'fevrier': 1, 'feb': 1, 'february': 1,
    'mars': 2, 'mar': 2, 'march': 2,
    'avr': 3, 'avril': 3, 'apr': 3, 'april': 3,
    'mai': 4, 'may': 4,
    'juin': 5, 'jun': 5, 'june': 5,
    'juil': 6, 'juillet': 6, 'jul': 6, 'july': 6,
    'août': 7, 'aout': 7, 'aug': 7, 'august': 7,
    'sept': 8, 'septembre': 8, 'sep': 8, 'september': 8,
    'oct': 9, 'octobre': 9, 'october': 9,
    'nov': 10, 'novembre': 10, 'november': 10,
    'déc': 11, 'dec': 11, 'décembre': 11, 'decembre': 11, 'december': 11
  };

  const parts = dateStr.toLowerCase().replace(/\./g, '').trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthKey = parts[1];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(year) && months[monthKey] !== undefined) {
      return new Date(year, months[monthKey], day).getTime();
    }
  }

  return 0;
}

function formatDisplayDate(dateStr?: string, isEn?: boolean): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    try {
      const [y, m, d] = dateStr.trim().split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
  return dateStr;
}

export const Blog: React.FC<BlogProps> = ({ onNavigateToPost }) => {
  const [posts, setPosts] = useState<CombinedBlogPost[]>([...staticPosts, ...dynamicPosts]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  useEffect(() => {
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
        console.warn('Could not fetch latest posts from API, falling back to bundled ones:', err);
      });
  }, []);

  const handlePostClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    if (onNavigateToPost) {
      onNavigateToPost(slug);
    } else {
      window.location.href = isEn ? `/en/blog/${slug}` : `/blog/${slug}`;
    }
  };

  // Helper to extract localized category/folder
  const getPostFolder = (post: CombinedBlogPost): string => {
    if (post.isDynamic) {
      const cat = isEn && post.categoryEn?.trim() ? post.categoryEn : post.category;
      return cat?.trim() || 'Général';
    }
    if (post.categoryKey) {
      return t(post.categoryKey) || 'Général';
    }
    const cat = isEn && post.categoryEn?.trim() ? post.categoryEn : post.category;
    return cat?.trim() || 'Général';
  };

  // Compute folders / series groupings
  const folders = useMemo(() => {
    const map = new Map<string, { label: string; count: number; posts: CombinedBlogPost[] }>();
    posts.forEach(post => {
      const folderName = getPostFolder(post);
      const key = folderName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { label: folderName, count: 0, posts: [] });
      }
      const entry = map.get(key)!;
      entry.count += 1;
      entry.posts.push(post);
    });

    return Array.from(map.values());
  }, [posts, isEn]);

  // Filter and sort posts by publication date descending
  const filteredSortedPosts = useMemo(() => {
    let list = posts;
    if (selectedFolder) {
      list = posts.filter(p => getPostFolder(p).toLowerCase() === selectedFolder.toLowerCase());
    }
    return [...list].sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
  }, [posts, selectedFolder, isEn]);

  // Display either the 3 latest or all depending on isExpanded
  const displayedPosts = useMemo(() => {
    if (isExpanded) {
      return filteredSortedPosts;
    }
    return filteredSortedPosts.slice(0, 3);
  }, [filteredSortedPosts, isExpanded]);

  return (
    <section id="lab" className="py-24 bg-brand-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft/10 border border-accent-soft/20 text-accent-soft text-[10px] font-bold uppercase tracking-widest mb-4">
              <Trophy className="w-3 h-3" />
              {t('blog.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 font-serif mb-4">{t('blog.title')}</h2>
            <p className="text-brand-500 font-light text-base">{t('blog.desc')}</p>
          </div>
          <div className="flex items-center gap-4 bg-white/85 p-4 rounded-xl border border-brand-200/65">
             <div className="text-right">
                <p className="text-[10px] text-brand-500 uppercase font-bold tracking-tighter">{t('blog.goal.heading')}</p>
                <p className="text-sm text-brand-900 font-medium">{t('blog.goal.title')}</p>
             </div>
             <div className="w-10 h-10 rounded-full border-2 border-accent-soft/20 border-t-accent-soft animate-spin-slow" />
          </div>
        </div>

        {/* Dossiers / Thematics Navigation Tabs */}
        <div className="mb-10 flex flex-wrap items-center gap-2.5 pb-2">
          <button
            id="blog-tab-all"
            onClick={() => {
              setSelectedFolder(null);
              setIsExpanded(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              selectedFolder === null
                ? 'bg-accent-soft text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-brand-700 border border-brand-200/70 hover:border-brand-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('blog.filter.all')}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedFolder === null ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-600'}`}>
              {posts.length}
            </span>
          </button>

          {folders.map((folder) => {
            const isSelected = selectedFolder?.toLowerCase() === folder.label.toLowerCase();
            return (
              <button
                key={folder.label}
                id={`blog-tab-${folder.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  setSelectedFolder(isSelected ? null : folder.label);
                  setIsExpanded(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'bg-white/80 hover:bg-white text-brand-700 border border-brand-200/70 hover:border-brand-300'
                }`}
              >
                <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-accent-soft' : 'text-brand-500'}`} />
                <span>{folder.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'}`}>
                  {folder.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post) => {
            const displayTitle = post.isDynamic 
              ? (isEn && post.titleEn?.trim() ? post.titleEn : post.title)
              : t(post.titleKey!);
            const folderName = getPostFolder(post);
            const displayReadTime = post.isDynamic 
              ? (isEn && post.readTimeEn?.trim() ? post.readTimeEn : post.readTime)
              : `${t(post.readTimeKey!)} ${t('blog.readtime')}`;
            const displayExcerpt = post.isDynamic 
              ? (isEn && post.excerptEn?.trim() ? post.excerptEn : post.excerpt)
              : t(post.excerptKey!);
            const formattedDate = formatDisplayDate(post.date, isEn);
            const articleUrl = isEn ? `/en/blog/${post.id}` : `/blog/${post.id}`;

            return (
              <motion.a
                key={post.id}
                href={articleUrl}
                onClick={(e) => handlePostClick(e, post.id)}
                whileHover={{ y: -4 }}
                className="bg-white border border-brand-200/60 rounded-2xl overflow-hidden flex flex-col group cursor-pointer shadow-sm relative transition-all hover:shadow-md hover:border-accent-soft/30"
              >
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src={sanitizeImageUrl(post.imageUrl)} 
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes('unsplash.com')) {
                        target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200';
                      }
                    }}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 group-hover:grayscale-0 transition-transform duration-500" 
                    alt={displayTitle} 
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                    <span className="px-3 py-1 bg-white/95 text-brand-900 text-[10px] font-bold rounded-full border border-brand-200 uppercase shadow-xs flex items-center gap-1.5">
                      <Folder className="w-3 h-3 text-accent-soft" />
                      {folderName}
                    </span>
                    {typeof post.orderInSeries === 'number' && (
                      <span className="px-2.5 py-0.5 bg-brand-900/90 text-white text-[9px] font-bold rounded-full uppercase tracking-wider backdrop-blur-xs">
                        {t('blog.folder.part')} {post.orderInSeries}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-brand-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-accent-soft" /> {formattedDate}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-accent-soft" /> {displayReadTime}</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-brand-900 mb-3 group-hover:text-accent-soft transition-colors leading-snug">
                    {displayTitle}
                  </h3>
                  <p className="text-brand-500 font-light text-sm mb-5 leading-relaxed line-clamp-3">
                    {displayExcerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-end pt-2 border-t border-brand-100">
                    <div className="flex items-center gap-1 text-accent-soft text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      {t('blog.read')} <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Expand / Collapse Button if more than 3 articles */}
        {filteredSortedPosts.length > 3 && (
          <div className="mt-12 flex justify-center">
            <button
              id="blog-expand-button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-3 bg-white hover:bg-brand-50 text-brand-800 border border-brand-200/80 hover:border-accent-soft/50 rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center gap-2.5 group cursor-pointer"
            >
              <span>
                {isExpanded 
                  ? t('blog.showLess')
                  : `${t('blog.viewAll')} (${filteredSortedPosts.length})`
                }
              </span>
              <ChevronDown className={`w-4 h-4 text-accent-soft transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

