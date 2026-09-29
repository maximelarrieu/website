import React, { useState } from 'react';
import { ArrowUpRight, X, Layers, Target, CheckCircle2, Award, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';

interface LocalProject {
  id: string;
  titleKey: string;
  client: string;
  kpiKey: string;
  descKey: string;
  contextKey: string;
  challengeKey: string;
  solutionKey: string;
  impactKey: string;
  technologies: string[];
  imageUrl: string;
}

const projectsData: LocalProject[] = [
    {
    id: '1',
    titleKey: 'project.cma.title',
    client: 'CMA-CGM',
    kpiKey: 'project.cma.kpi',
    descKey: 'project.cma.desc',
    contextKey: 'project.cma.context',
    challengeKey: 'project.cma.challenge',
    solutionKey: 'project.cma.solution',
    impactKey: 'project.cma.impact',
    technologies: ['TypeScript', 'React', 'Docker', 'Kubernetes', 'FastAPI'],
    imageUrl: '/images/projects/cmaproject.jpg',
  },
  {
    id: '2',
    titleKey: 'project.petro.title',
    client: 'Petroineos',
    kpiKey: 'project.petro.kpi',
    descKey: 'project.petro.desc',
    contextKey: 'project.petro.context',
    challengeKey: 'project.petro.challenge',
    solutionKey: 'project.petro.solution',
    impactKey: 'project.petro.impact',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    imageUrl: '/images/projects/petroproject.jpg',
  },
  {
    id: '3',
    titleKey: 'project.edf.title',
    client: 'EDF',
    kpiKey: 'project.edf.kpi',
    descKey: 'project.edf.desc',
    contextKey: 'project.edf.context',
    challengeKey: 'project.edf.challenge',
    solutionKey: 'project.edf.solution',
    impactKey: 'project.edf.impact',
    technologies: ['Python', 'PyGraph'],
    imageUrl: '/images/projects/edfproject.jpg',
  },
  {
    id: '4',
    titleKey: 'project.uni.title',
    client: 'Unifox.ai',
    kpiKey: 'project.uni.kpi',
    descKey: 'project.uni.desc',
    contextKey: 'project.uni.context',
    challengeKey: 'project.uni.challenge',
    solutionKey: 'project.uni.solution',
    impactKey: 'project.uni.impact',
    technologies: ['Django', 'Python', 'PostgreSQL', 'Git', 'CI/CD'],
    imageUrl: '/images/projects/unifoxproject.jpg',
  },
  {
    id: '5',
    titleKey: 'project.thales.title',
    client: 'Thales / TBM',
    kpiKey: 'project.thales.kpi',
    descKey: 'project.thales.desc',
    contextKey: 'project.thales.context',
    challengeKey: 'project.thales.challenge',
    solutionKey: 'project.thales.solution',
    impactKey: 'project.thales.impact',
    technologies: ['SQL', 'Big Data', 'Visual Code', 'Bash'],
    imageUrl: '/images/projects/thalesproject.jpg',
  },

];

export const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<LocalProject | null>(null);

  return (
    <section id="projects" className="py-24 bg-brand-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold text-accent-soft uppercase tracking-widest mb-4">{t('projects.badge')}</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-brand-900 font-serif mb-6 leading-tight">{t('projects.title')}</h3>
            <p className="text-brand-500 font-light text-base leading-relaxed">
              {t('projects.desc')}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-5 py-2.5 bg-brand-100 border border-brand-200/80 rounded-full text-brand-500 text-xs font-medium">
              {t('projects.stats')}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-brand-200/60 bg-brand-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent-soft/40">
                <img 
                  src={project.imageUrl} 
                  alt={t(project.titleKey)} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/30 to-transparent" />
                
                {/* KPI Tag */}
                <div className="absolute top-5 left-5 px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-900 border border-brand-200 text-xs font-semibold rounded-full shadow-sm">
                  {t(project.kpiKey)}
                </div>

                <div className="absolute top-5 right-5 px-3 py-1 bg-brand-900/80 backdrop-blur-sm text-white text-[10px] font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('projects.clickMore')}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="mb-2.5">
                    <span className="inline-block px-3 py-1 bg-accent-soft text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md">
                      {project.client}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold font-serif text-white mb-3 flex items-center gap-2">
                    {t(project.titleKey)}
                    <ArrowUpRight className="w-5 h-5 text-accent-soft group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map(tech => (
                      <span key={tech} className="text-[10px] font-semibold text-brand-700 bg-white/90 border border-white/40 px-2 py-0.5 rounded shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 px-2 flex justify-between items-center">
                <p className="text-brand-500 font-light text-sm leading-relaxed line-clamp-2">
                  {t(project.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-brand-950/50 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white border border-brand-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative text-brand-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2.5 bg-white/90 hover:bg-brand-100 text-brand-600 hover:text-brand-900 rounded-full shadow-md transition-colors z-20 border border-brand-200"
                aria-label={t('projects.modal.close')}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner / Header Image */}
              <div className="h-64 md:h-80 relative overflow-hidden">
                <img 
                  src={selectedProject.imageUrl} 
                  alt={t(selectedProject.titleKey)} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-accent-soft text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                      {selectedProject.client}
                    </span>
                    <span className="px-3 py-1 bg-white/90 text-brand-900 border border-brand-200 text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {t(selectedProject.kpiKey)}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white font-serif leading-tight">
                    {t(selectedProject.titleKey)}
                  </h2>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-8 md:p-12 space-y-8">
                {/* Context */}
                <div className="bg-brand-50 p-6 rounded-2xl border border-brand-200/80">
                  <h3 className="text-xs font-bold text-accent-soft uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent-soft" />
                    {t('projects.modal.context')}
                  </h3>
                  <p className="text-brand-800 text-base leading-relaxed font-light">
                    {t(selectedProject.contextKey)}
                  </p>
                </div>

                {/* Grid: Challenge & Solution */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-brand-200/80 shadow-sm">
                    <h3 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-600" />
                      {t('projects.modal.challenge')}
                    </h3>
                    <p className="text-brand-600 text-sm leading-relaxed font-light">
                      {t(selectedProject.challengeKey)}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-brand-200/80 shadow-sm">
                    <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t('projects.modal.solution')}
                    </h3>
                    <p className="text-brand-600 text-sm leading-relaxed font-light">
                      {t(selectedProject.solutionKey)}
                    </p>
                  </div>
                </div>

                {/* Impact / Results */}
                <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200/70">
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    {t('projects.modal.impact')}
                  </h3>
                  <p className="text-emerald-950 font-medium text-base leading-relaxed">
                    {t(selectedProject.impactKey)}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-accent-soft" />
                    {t('projects.modal.tech')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className="px-3.5 py-1.5 bg-brand-100 text-brand-800 border border-brand-200 rounded-xl text-xs font-semibold shadow-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
