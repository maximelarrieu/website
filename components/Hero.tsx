
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Terminal, Cpu, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-50">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#EAE7E1 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />
      
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-soft/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-warm/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-8 justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 border border-brand-200/85 text-brand-500 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-soft" />
                <span className="tracking-wider uppercase">{t('hero.badge.role')}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-soft/10 border border-accent-soft/20 text-accent-soft text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="tracking-wider uppercase">{t('hero.badge.learning')}</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-900 mb-8 font-serif leading-tight">
              {t('hero.title')}{' '}
              <span className="font-serif italic font-normal text-accent-soft">
                {t('hero.title.italic')}
              </span>.
            </h1>
            
            <p className="text-lg md:text-xl text-brand-500 mb-12 max-w-2xl leading-relaxed font-light">
              {t('hero.desc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-start items-stretch sm:items-center">
              <a 
                href="#projects"
                className="group px-8 py-3.5 bg-brand-900 hover:bg-brand-950 text-brand-50 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-900/10 active:scale-98"
              >
                <span>{t('hero.cta')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <div className="flex gap-3 justify-center">
                {[Terminal, Cpu, Globe].map((Icon, i) => (
                  <div key={i} className="p-3 bg-brand-100 border border-brand-200/80 rounded-full text-brand-500 hover:text-accent-soft hover:border-accent-soft/30 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-200"
      >
        <ChevronDown className="w-6 h-6 text-brand-500" />
      </motion.div>
    </section>
  );
};
