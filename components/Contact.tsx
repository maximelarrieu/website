import React, { useState } from 'react';
import { Mail, Linkedin, Github, MapPin, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'New Project (Infrastructure)',
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
    
    const body = `Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`;

    const mailtoLink = `mailto:maxime.larrieu0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="py-24 bg-brand-950">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">Let's build the future.</h2>
            <p className="text-slate-400 mb-8 leading-relaxed text-lg">
              Whether you need a robust architecture for a new platform or a custom internal tool to streamline your industrial operations, I am here to provide elite technical leadership.
              <br/><br/>
              Currently available for high-impact freelance missions, architectural consulting, or strategic lead development roles.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <Mail className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-medium">contact@maximelarrieu.io</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-medium">Aix-en-Provence, France (Remote Friendly)</span>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-white font-medium mb-4 uppercase tracking-widest text-xs">Connect on Social</h4>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/maximelarrieulk/" target="_blank" className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/maximelarrieu" target="_blank" className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6 relative shadow-2xl">
            
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

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                  placeholder="e.g. John Smith" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Professional Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                  placeholder="john@company.com" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Inquiry Type</label>
              <select 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-brand-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="New Project (Infrastructure)">Critical Infrastructure Project</option>
                <option value="ERP / Internal Tool">Custom Internal Tooling</option>
                <option value="Consulting">Technical Architecture Consulting</option>
                <option value="Recruitment">Talent Acquisition</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Project Details</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4} 
                className="w-full bg-brand-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                placeholder="Describe your technical requirements or infrastructure vision..."
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95">
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};
