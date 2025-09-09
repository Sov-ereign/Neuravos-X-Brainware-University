import React from 'react';
import { BarChart3, GraduationCap, Home, Info, ShieldAlert, PieChart } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'orato-ai', label: 'Orato-AI', icon: BarChart3 },
    { id: 'campus-ai', label: 'Campus-AI', icon: GraduationCap },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'scam-detector', label: 'Scam Detector', icon: ShieldAlert },
    { id: 'scam-stats', label: 'Scam Stats', icon: PieChart },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#003399] rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Neuravos X Brainware University</h1>
              <p className="text-xs text-gray-500">Professional Analysis Platform</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-[#003399] text-white shadow'
                      : 'text-[#003399] hover:bg-[#003399]/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;