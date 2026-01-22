import React from 'react';
import { Project } from '../types';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExtendedProject extends Project {
  kpi?: string;
}

const projects: ExtendedProject[] = [
  {
    id: 'p2',
    title: 'Energy Grid Monitoring',
    client: 'EDF',
    kpi: '-40% Stream Latency',
    description: 'Critical real-time energy monitoring dashboard for 500+ operational managers. Micro-frontends architecture and Node.js stream optimization.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Micro-frontends'],
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'p4',
    title: 'Global Logistics Hub',
    client: 'CMA-CGM',
    kpi: '99.9% Uptime',
    description: 'Modernizing the global maritime tracking system. Optimization of massive logistics data APIs and Docker/K8s containerization.',
    technologies: ['TypeScript', 'React', 'Docker', 'Kubernetes'],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'p1',
    title: 'AI Crypto Engine',
    client: 'Unifox.ai',
    kpi: '0 to 1 Launch',
    description: 'End-to-end backend infrastructure design for an AI-powered crypto investment tool. Implementation of Git workflows and CI/CD.',
    technologies: ['Django', 'Python', 'AI/ML', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'p3',
    title: 'Predictive Log Analyzer',
    client: 'Thales / TBM',
    kpi: 'Million Logs/Day',
    description: 'Data engineering tool for the TBM transport network. Proactive fault identification via mass log SQL analysis.',
    technologies: ['SQL', 'Big Data', 'Metabase', 'Python'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=800',
  }
];

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-32 bg-brand-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4">Portfolio</h2>
            <h3 className="text-4xl md:text-6xl font-bold text-white font-serif mb-6 leading-tight">High-Impact Projects.</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              A selection of missions combining industrial rigor and technological innovation.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white text-sm font-medium">
              4 Major Clients
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-2xl">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                
                {/* KPI Tag */}
                {project.kpi && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-xl">
                    {project.kpi}
                  </div>
                )}

                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">{project.client}</p>
                  <h4 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                    {project.title}
                    <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 px-4">
                <p className="text-slate-400 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
