import React, { useState } from 'react';
import { BarChart3, GraduationCap, Home, Info, ShieldAlert, PieChart, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'orato-ai', label: 'Orato-AI', icon: BarChart3 },
    { id: 'dashboard', label: 'Orato-Stats', icon: Home },
    { id: 'campus-ai', label: 'Campus-AI', icon: GraduationCap },
    { id: 'scam-detector', label: 'Scam Detector', icon: ShieldAlert },
    { id: 'scam-stats', label: 'Scam Stats', icon: PieChart },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (itemId: string) => {
    onTabChange(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#003399] rounded-xl flex items-center justify-center">
              <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Neuravos X Brainware University</h1>
              <p className="text-xs text-gray-500">Professional Analysis Platform</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold text-gray-900">Neuravos X BWU</h1>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-[#003399] text-white shadow'
                      : 'text-[#003399] hover:bg-[#003399]/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#003399]" />
              ) : (
                <Menu className="w-5 h-5 text-[#003399]" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-[#003399] text-white shadow'
                        : 'text-[#003399] hover:bg-[#003399]/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;