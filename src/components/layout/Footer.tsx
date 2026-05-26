import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">Intro Internship</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Home</Link>
            <Link to="/register" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Register</Link>
          </div>
          <p className="text-xs text-outline">&copy; {new Date().getFullYear()} Intro Internship. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
