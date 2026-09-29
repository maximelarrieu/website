import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';

interface LocalExperience {
  id: string;
  companyKey: string;
  roleKey: string;
  periodKey: string;
  descKeys: string[];
}

const experiencesData: LocalExperience[] = [
  {
    id: '1',
    companyKey: 'CMA-CGM',
    roleKey: 'exp.cma.role',
    periodKey: 'exp.cma.period',
    descKeys: ['exp.cma.desc.1', 'exp.cma.desc.2', 'exp.cma.desc.3']
  },
  {
    id: '2',
    companyKey: 'Petroineos',
    roleKey: 'exp.petro.role',
    periodKey: 'exp.petro.period',
    descKeys: ['exp.petro.desc.1', 'exp.petro.desc.2', 'exp.petro.desc.3']
  },
  {
    id: '3',
    companyKey: 'EDF',
    roleKey: 'exp.edf.role',
    periodKey: 'exp.edf.period',
    descKeys: ['exp.edf.desc.1', 'exp.edf.desc.2', 'exp.edf.desc.3']
  },
  {
    id: '4',
    companyKey: 'Unifox.ai',
    roleKey: 'exp.unifox.role',
    periodKey: 'exp.unifox.period',
    descKeys: ['exp.unifox.desc.1', 'exp.unifox.desc.2', 'exp.unifox.desc.3']
  },
  {
    id: '5',
    companyKey: 'Thales / TBM',
    roleKey: 'exp.thales.role',
    periodKey: 'exp.thales.period',
    descKeys: ['exp.thales.desc.1', 'exp.thales.desc.2', 'exp.thales.desc.3']
  }
];

export const Experience: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="experience" className="py-24 bg-brand-100 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-900 font-serif mb-4">{t('exp.title')}</h2>
          <div className="h-1 w-16 bg-accent-soft"></div>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Client Logos / Summary */}
          <div className="md:col-span-4 space-y-8">
            <p className="text-brand-500 leading-relaxed text-base font-light whitespace-pre-line">
              {t('exp.intro')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['CMA-CGM', 'Petroineos', 'EDF', 'Unifox.ai', 'Thales'].map((client, i) => (
                <div key={i} className="hover:cursor-default h-20 bg-white border border-brand-200/60 rounded-xl flex items-center justify-center group hover:border-accent-soft/40 transition-all shadow-sm">
                  <span className="font-bold text-base text-brand-500 group-hover:text-brand-900 transition-colors uppercase tracking-tight">{client}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="md:col-span-8 space-y-12">
            {experiencesData.map((exp, index) => {
              const displayCompany = exp.companyKey.includes('ai') || exp.companyKey.includes('Thales')
                ? exp.companyKey 
                : `${language === 'fr' ? 'Abylsen (Mission : ' : 'Abylsen (Project: '}${exp.companyKey})`;

              return (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 border-l border-brand-200"
                >
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-soft ring-4 ring-brand-100" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-xl font-serif font-bold text-brand-900">{displayCompany}</h3>
                    <span className="text-xs font-mono text-accent-soft font-semibold mt-1 sm:mt-0">{t(exp.periodKey)}</span>
                  </div>
                  <p className="text-base text-brand-500 mb-4 font-normal italic">{t(exp.roleKey)}</p>
                  <ul className="space-y-2.5">
                    {exp.descKeys.map((descKey, idx) => (
                      <li key={idx} className="text-brand-500 text-sm flex items-start gap-2.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-200 flex-shrink-0" />
                        <span className="leading-relaxed font-light">{t(descKey)}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
