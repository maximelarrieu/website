import React from 'react';
import { Experience as ExperienceType } from '../types';
import { motion } from 'framer-motion';

const experiences: ExperienceType[] = [
    {
    id: '1',
    company: 'Abylsen (Project: CMA-CGM)',
    role: 'Senior Consultant - Frontend Architect',
    period: '2025 - Present',
    description: [
      'Modernizing the global container tracking interface used by port authorities and logistics leads worldwide.',
      'Optimizing API response times for high-traffic maritime data using advanced caching strategies and containerized microservices.',
      'Leading the migration of legacy frontend modules to a high-performance React/TypeScript architecture.'
    ]
  },
  {
    id: '2',
    company: 'Abylsen (Project: EDF)',
    role: 'Senior Consultant - Fullstack Lead',
    period: '2025',
    description: [
      'Architecting a critical real-time energy monitoring dashboard used by over 500 operational managers for grid stability.',
      'Reduced data processing latency by 40% through Node.js stream optimization and high-performance SQL query tuning.',
      'Implementing micro-frontend architectures to safely decouple and modernize core legacy systems.'
    ]
  },
  {
    id: '3',
    company: 'Abylsen (Project: Petroineos)',
    role: 'Consultant - Python Developer',
    period: '2025',
    description: [
      'Developed a mission-critical logistics tracking application for complex refinery operations.',
      'Integrated distributed third-party SOAP/REST APIs to automate supply chain workflows and minimize manual errors.',
      'Mentored multi-disciplinary teams on development best practices within a high-compliance industrial environment.'
    ]
  },
  {
    id: '4',
    company: 'Unifox.ai',
    role: 'Core Backend Developer (Founding Team)',
    period: '2022 - 2023',
    description: [
      'Architected the entire "Zero-to-One" infrastructure for a high-frequency AI Crypto investment platform.',
      'Established foundational Git workflows, CI/CD pipelines, and a scalable Django backend architecture.',
      'Developed proprietary algorithms to process and analyze real-time cryptocurrency market data streams.'
    ]
  },
  {
    id: '5',
    company: 'Thales (Project: TBM)',
    role: 'Data Engineer & SQL Specialist',
    period: '2020 - 2021',
    description: [
      'Managed massive log datasets for the Bordeaux Public Transport Network (TBM) infrastructure.',
      'Optimized complex SQL procedures to proactively distinguish hardware failures from software regression patterns.',
      'Engineered data visualization reports enabling maintenance teams to preemptively fix faulty ticket terminal clusters.'
    ]
  }
];

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-brand-900 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Career Trajectory</h2>
          <div className="h-1 w-20 bg-indigo-500"></div>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Client Logos / Summary */}
          <div className="md:col-span-4 space-y-8">
            <p className="text-slate-400 leading-relaxed text-lg">
              My professional journey bridges the precision of <b>Industrial Consulting</b> (Abylsen) with the rapid innovation of <b>Tech Startups</b>. 
              <br/><br/>
              Whether analyzing millions of logs for Thales or building AI financial engines from scratch, I deliver robust, production-grade code for mission-critical environments.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['EDF', 'CMA-CGM', 'Thales', 'Petroineos', 'Unifox.ai'].map((client, i) => (
                <div key={i} className="hover:cursor-pointer h-24 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-center group hover:border-indigo-500/50 transition-all">
                  <span className="font-bold text-xl text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tighter">{client}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="md:col-span-8 space-y-12">
            {experiences.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 border-l border-slate-800"
              >
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-brand-900" />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                  <span className="text-sm font-mono text-indigo-400 mt-1 sm:mt-0">{exp.period}</span>
                </div>
                <p className="text-lg text-slate-300 mb-4 font-medium">{exp.role}</p>
                <ul className="space-y-3">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="text-slate-400 text-sm flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
