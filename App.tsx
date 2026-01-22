
import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Blog } from './components/Blog';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AIChat } from './components/AIChat';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-950 text-slate-200 font-sans">
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Blog />
        <Skills />
        <Contact />
      </main>
      <AIChat />
      <Footer />
    </div>
  );
};

export default App;
