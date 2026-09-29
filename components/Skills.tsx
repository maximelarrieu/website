import React from 'react';
import { Database, Layers, Code2, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';

export const Skills: React.FC = () => {
  const { t } = useLanguage();

  const offerings = [
    {
      icon: <Database className="w-6 h-6 text-accent-soft" />,
      titleKey: "skills.offering.1.title",
      descKey: "skills.offering.1.desc"
    },
    {
      icon: <Layers className="w-6 h-6 text-accent-soft" />,
      titleKey: "skills.offering.2.title",
      descKey: "skills.offering.2.desc"
    },
    {
      icon: <Bot className="w-6 h-6 text-accent-soft" />,
      titleKey: "skills.offering.3.title",
      descKey: "skills.offering.3.desc"
    }
  ];

  const skills = [
    { categoryKey: "skills.group.frontend", items: ["React", "TypeScript", "Vue.js", "TailwindCSS"] },
    { categoryKey: "skills.group.backend", items: ["Node.js", "NestJS", "FastAPI", "Python", "PostgreSQL"] },
    { categoryKey: "skills.group.devops", items: ["Docker", "Kubernetes", "Google Cloud", "CI/CD Pipelines"] },
    { categoryKey: "skills.group.ai", items: ["Ollama & LLMs locaux", "Systèmes Multi-Agents", "RAG & Vector DBs", "APIs LLM & Orchestration"] },
    { categoryKey: "skills.group.practices", items: ["Git", "Méthodes Agiles", "Tests unitaires", "Linux"] }
  ];

  const getSkillLabel = (item: string) => {
    if (item === "Ollama & LLMs locaux") return t('skill.ai.localmodels');
    if (item === "Systèmes Multi-Agents") return t('skill.ai.multiagents');
    if (item === "RAG & Vector DBs") return t('skill.ai.rag');
    if (item === "APIs LLM & Orchestration") return t('skill.ai.apis');
    if (item === "Méthodes Agiles") return t('skill.practices.scrum');
    if (item === "Tests unitaires") return t('skill.practices.test');
    return item;
  };

  return (
    <section id="skills" className="py-24 bg-brand-50 border-t border-brand-200/50">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-xs font-bold text-accent-soft uppercase tracking-widest mb-4">{t('skills.badge')}</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-brand-900 mb-6 font-serif">{t('skills.title')}</h3>
          <p className="text-brand-500 max-w-2xl mx-auto text-base leading-relaxed font-light">
            {t('skills.desc')}
          </p>
        </div>

        {/* High Level Services */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {offerings.map((offer, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-brand-200/60 hover:border-accent-soft/30 hover:shadow-md transition-all group shadow-sm"
            >
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-102 transition-transform border border-brand-200/60">
                {offer.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-900 font-serif mb-3">{t(offer.titleKey)}</h3>
              <p className="text-brand-500 leading-relaxed text-sm font-light">
                {t(offer.descKey)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="h-px w-full bg-brand-200/60 mb-20" />

        {/* Technical Stack */}
        <div className="text-center mb-10">
            <h2 className="text-xl font-bold font-serif text-brand-900 flex items-center justify-center gap-3">
                <Code2 className="w-5 h-5 text-accent-soft" />
                {t('skills.tech')}
            </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-brand-200/60 transition-colors">
              <h3 className="text-accent-soft font-bold mb-4 text-[10px] uppercase tracking-widest">{t(skillGroup.categoryKey)}</h3>
              <ul className="space-y-2.5">
                {skillGroup.items.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2 text-brand-900 text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-accent-soft/40 rounded-full" />
                    {getSkillLabel(skill)}
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
