import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-lg border-b border-outline-variant/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-on-surface">
              Intro <span className="text-primary">Internship</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/register" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
              Register
            </Link>
            <Link to="/admin/login" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
              Admin
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={cn('md:hidden border-t border-outline-variant/50 overflow-hidden transition-all duration-300', open ? 'max-h-60' : 'max-h-0')}>
        <div className="px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
            Home
          </Link>
          <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
            Register
          </Link>
          <Link to="/admin/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
