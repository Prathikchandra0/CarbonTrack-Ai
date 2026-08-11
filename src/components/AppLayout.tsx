import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplet,
  Trash2,
  Flame,
  Sun,
  Hammer,
  BrainCircuit,
  Map,
  BookOpen,
  Milestone,
  Menu,
  X,
  FileSpreadsheet,
  RefreshCw,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEnvironmental } from '@/context/EnvironmentalContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { hasCustomData, resetToDemo } = useEnvironmental();

  const navigationItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Water Management', path: '/water-management', icon: Droplet },
    { label: 'Waste Management', path: '/waste-management', icon: Trash2 },
    { label: 'Waste-to-Energy', path: '/waste-to-energy', icon: Flame },
    { label: 'Renewable Energy', path: '/renewable-energy', icon: Sun },
    { label: 'Sustainable Materials', path: '/sustainable-materials', icon: Hammer },
    { label: 'AI Monitoring', path: '/ai-monitoring', icon: BrainCircuit },
    { label: 'Environmental GIS', path: '/environmental-gis', icon: Map },
    { label: 'Education Hub', path: '/education', icon: BookOpen },
    { label: 'SDG Goals', path: '/sdg-dashboard', icon: Milestone },
    { label: 'Requirements & POs', path: '/requirements', icon: Award }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl shrink-0">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">CarbonTrack AI</h2>
              <span className="text-xs text-muted-foreground">Eco Intelligence</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {hasCustomData && (
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDemo}
              className="w-full gap-2 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to Demo Data
            </Button>
          </div>
        )}
      </aside>

      {/* Sidebar - Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-background/80 backdrop-blur-sm">
          <aside className="w-64 border-r border-border bg-card p-6 flex flex-col h-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                <span className="font-bold">CarbonTrack AI</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1">
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            {hasCustomData && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetToDemo();
                  setIsMobileOpen(false);
                }}
                className="w-full gap-2 text-xs font-semibold mt-4"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset to Demo Data
              </Button>
            )}
          </aside>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-card/85 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <span className="font-bold text-sm">CarbonTrack AI</span>
          </div>
          <span className="text-xs text-muted-foreground">Demo Version</span>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
};
