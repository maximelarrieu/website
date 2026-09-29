import React, { useState } from 'react';
import { Mail, Linkedin, Github, MapPin, Send } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Projet d’application web',
    message: ''
  });
  
  // State for the Honeypot field
  const [honeyPot, setHoneyPot] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // HONEYPOT CHECK
    if (honeyPot) {
      console.log("Bot detected.");
      return;
    }

    const { name, email, subject, message } = formData;
    
    const body = `Nom: ${name}
Email: ${email}
Sujet: ${subject}

Message:
${message}`;

    const mailtoLink = `mailto:maxime.larrieu0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="py-24 bg-brand-100">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-900 mb-6 font-serif">{t('contact.title')}</h2>
            <p className="text-brand-500 mb-8 leading-relaxed text-base font-light whitespace-pre-line">
              {t('contact.desc')}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-brand-900">
                <div className="p-3 bg-white rounded-xl border border-brand-200/60">
                  <Mail className="w-5 h-5 text-accent-soft" />
                </div>
                <span className="font-medium text-sm">contact@maximelarrieu.io</span>
              </div>
              <div className="flex items-center gap-4 text-brand-900">
                <div className="p-3 bg-white rounded-xl border border-brand-200/60">
                  <MapPin className="w-5 h-5 text-accent-soft" />
                </div>
                <span className="font-medium text-sm">{t('contact.geo')}</span>
              </div>
            </div>

            <div className="mt-10">
              <h4 className="text-brand-500 font-semibold uppercase tracking-wider text-[10px] mb-3">{t('contact.socials')}</h4>
              <div className="flex gap-3">
                <a href="https://www.linkedin.com/in/maximelarrieulk/" target="_blank" className="p-2.5 bg-white rounded-xl border border-brand-200 text-brand-500 hover:text-brand-900 hover:border-brand-500 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/maximelarrieu" target="_blank" className="p-2.5 bg-white rounded-xl border border-brand-200 text-brand-500 hover:text-brand-900 hover:border-brand-500 transition-all">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-brand-200/60 space-y-5 relative shadow-sm">
            
            <input 
              type="text" 
              name="phone" 
              tabIndex={-1}
              value={honeyPot}
              onChange={(e) => setHoneyPot(e.target.value)}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
              aria-hidden="true"
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-900">{t('contact.form.name')}</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-brand-900 text-sm focus:outline-none focus:border-accent-soft transition-colors" 
                  placeholder={t('contact.form.placeholder.name')} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-900">{t('contact.form.email')}</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-brand-900 text-sm focus:outline-none focus:border-accent-soft transition-colors" 
                  placeholder={t('contact.form.placeholder.email')} 
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-900">{t('contact.form.need')}</label>
              <select 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-brand-900 text-sm focus:outline-none focus:border-accent-soft transition-colors"
              >
                <option value="Projet d’application web">{t('contact.form.opt.app')}</option>
                <option value="Automatisation & Outils internes">{t('contact.form.opt.script')}</option>
                <option value="Intégration IA & Systèmes intelligents">{t('contact.form.opt.ai')}</option>
                <option value="Conseil d’architecture & Cloud">{t('contact.form.opt.consult')}</option>
                <option value="Autre demande">{t('contact.form.opt.other')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-900">{t('contact.form.desc')}</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4} 
                className="w-full bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-brand-900 text-sm focus:outline-none focus:border-accent-soft transition-colors" 
                placeholder={t('contact.form.placeholder.msg')}
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-accent-soft hover:bg-accent-hover text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98">
              {t('contact.form.submit')} <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};
