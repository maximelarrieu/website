
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowRight, X, Trophy } from 'lucide-react';
import { BlogPost } from '../types';

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Road to Google Cloud Solutions Architect',
    date: 'Oct 24, 2025',
    category: 'Cloud Architecture',
    readTime: '5 min',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Sharing my journey through Google Skills Boost and the core architectural patterns I am mastering for global-scale infrastructures.',
    content: `
      <h2>The Shift to Solutions Architecture</h2>
      <p>Transitioning from a Fullstack Lead to a Solutions Architect involves a paradigm shift from "how to build" to "what to build and why." My focus is now on the Google Cloud Professional Solutions Architect certification.</p>
      
      <h3>Core Focus Areas:</h3>
      <ul>
        <li>Designing for high availability and disaster recovery.</li>
        <li>Optimizing costs through serverless paradigms (Cloud Run, GKE).</li>
        <li>Security by design: IAM hierarchies and VPC Service Controls.</li>
      </ul>
      
      <p>I will be updating this space with deep dives into specific GCP services and how they solve real-world industrial problems like the ones I face at EDF or CMA-CGM.</p>
    `
  },
  {
    id: '2',
    title: 'Deploying Generative AI with Vertex AI',
    date: 'Oct 12, 2025',
    category: 'Vertex AI',
    readTime: '8 min',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    excerpt: 'A technical exploration of Model Garden and deploying Gemini-based agents for industrial automation using Vertex AI Search & Conversation.',
    content: `
      <h2>Why Vertex AI?</h2>
      <p>For my clients in heavy industry, reliability and security are paramount. Vertex AI offers the governance needed to deploy LLMs in production environments.</p>
      
      <h3>Key Learnings:</h3>
      <p>Vertex AI Search allows us to ground models (RAG) in private company documentation without exposing sensitive data to the public internet.</p>
      
      <p>I am currently experimenting with Vector Search for million-entry log analysis to predict failures before they happen—a direct application of what I started at Thales.</p>
    `
  }
];

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="lab" className="py-24 bg-brand-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Trophy className="w-3 h-3" />
              GCP Architect Path
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">Knowledge Lab.</h2>
            <p className="text-slate-400 text-lg">Documenting my transition to Solutions Architecture and AI implementation on Google Cloud.</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
             <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Current Goal</p>
                <p className="text-sm text-white font-medium">Professional Cloud Architect</p>
             </div>
             <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin-slow" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <motion.div 
              key={post.id}
              whileHover={{ y: -5 }}
              className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="h-48 overflow-hidden relative">
                <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-brand-950/80 backdrop-blur-md text-indigo-400 text-[10px] font-bold rounded-full border border-white/5 uppercase">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-brand-950/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 p-2 bg-brand-950 rounded-full text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-64 md:h-96 relative">
                <img src={selectedPost.imageUrl} className="w-full h-full object-cover" alt={selectedPost.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full mb-4 inline-block uppercase tracking-widest">
                    {selectedPost.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold text-white font-serif">{selectedPost.title}</h2>
                </div>
              </div>

              <div className="p-10 md:p-16 prose prose-invert prose-indigo max-w-none">
                 <div className="flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-12 border-b border-slate-800 pb-8">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> Published {selectedPost.date}</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> {selectedPost.readTime} read</span>
                 </div>
                 
                 <div className="text-slate-300 text-lg leading-loose space-y-6 blog-content" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .blog-content h2 { color: white; font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .blog-content h3 { color: #818cf8; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; }
        .blog-content ul { list-style: disc; padding-left: 1.5rem; margin: 1.5rem 0; }
        .blog-content li { margin-bottom: 0.5rem; }
      `}</style>
    </section>
  );
};
