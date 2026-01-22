
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Code2, Terminal, Cpu, Globe, ShieldCheck, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-950">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-8 justify-center md:justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4" />
                <span className="tracking-widest uppercase">Senior Consultant - Abylsen</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span className="tracking-widest uppercase">GCP & Vertex AI Specialist</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 font-serif leading-[0.9]">
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-white to-slate-500">
                Future Systems.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl leading-relaxed font-light">
              Fullstack Architect documenting the convergence of industrial power and <span className="text-white font-medium border-b border-indigo-500/50">Google Cloud AI</span>. 
              Solutions Lead for <span className="text-white font-medium">EDF</span>, <span className="text-white font-medium">CMA-CGM</span> & <span className="text-white font-medium">Petroineos</span>.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center md:justify-start items-center">
              <a 
                href="#projects"
                className="group relative px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:scale-105 transition-all flex items-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Explore My Work</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <div className="flex gap-4">
                {[Terminal, Cpu, Globe].map((Icon, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-slate-600"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
};
