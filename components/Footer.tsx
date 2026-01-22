import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-950 py-8 border-t border-slate-900">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Maxime Larrieu-Panini Portfolio. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-slate-500">
        </div>
      </div>
    </footer>
  );
};
