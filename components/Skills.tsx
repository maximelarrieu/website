import React from 'react';
import { Database, Layers, Rocket, Code2, Bitcoin } from 'lucide-react';
import { motion } from 'framer-motion';

export const Skills: React.FC = () => {
  const offerings = [
    {
      icon: <Database className="w-6 h-6 text-indigo-400" />,
      title: "Core Architecture",
      description: "Engineering scalable system designs and robust API layers from the ground up. Specialized in high-concurrency environments."
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      title: "Enterprise Solutions",
      description: "Developing custom ERPs and operational tools with industrial-grade reliability and seamless user experience tailored to niche workflows."
    },
    {
      icon: <Bitcoin className="w-6 h-6 text-indigo-400" />,
      title: "Web3 & Distributed Ledger",
      description: "Deep technical expertise in decentralized systems. Capable of architecting Smart Contracts and integrating secure Web3 protocols."
    }
  ];

  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Vue.js", "TailwindCSS"] },
    { category: "Backend", items: ["Node.js", "NestJS", "FastAPI", "Python", "PostgreSQL"] },
    { category: "Cloud & DevOps", items: ["Docker", "Kubernetes", "Google Cloud", "CI/CD Pipelines"] },
    { category: "Decentralized", items: ["Solidity", "Web3.js", "Smart Contract Security"] },
    { category: "Strategic Tools", items: ["Git", "Agile/Scrum", "TDD", "System Monitoring"] }
  ];

  return (
    <section id="skills" className="py-24 bg-brand-900 border-t border-slate-900">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4">Capabilities</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif">Engineering Excellence.</h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Beyond standard development, I provide a strategic technical vision that ensures long-term scalability and operational robustness.
          </p>
        </div>

        {/* High Level Services */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {offerings.map((offer, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-slate-700">
                {offer.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{offer.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {offer.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="h-px w-full bg-slate-800 mb-20" />

        {/* Technical Stack */}
        <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-200 flex items-center justify-center gap-3">
                <Code2 className="w-6 h-6 text-indigo-500" />
                Specialized Tech Stack
            </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/50 transition-colors">
              <h3 className="text-indigo-400 font-bold mb-5 text-[10px] uppercase tracking-widest">{skillGroup.category}</h3>
              <ul className="space-y-3">
                {skillGroup.items.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
