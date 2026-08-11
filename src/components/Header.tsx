import React from 'react';
import { Leaf, BarChart3, Map, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onUploadClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onUploadClick }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">CarbonTrack</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Monitoring</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink 
              icon={<BarChart3 className="w-4 h-4" />} 
              label="Dashboard" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <NavLink 
              icon={<Map className="w-4 h-4" />} 
              label="GIS Map" 
              onClick={() => scrollToSection('gis-map')}
            />
            <NavLink 
              icon={<Lightbulb className="w-4 h-4" />} 
              label="Insights" 
              onClick={() => scrollToSection('insights')}
            />
          </nav>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onUploadClick} className="btn-glow">
              Upload Data
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};