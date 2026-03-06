import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'create' | 'library';
  onTabChange: (tab: 'create' | 'library') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0b0a08] border-t border-[#3d342b] px-6 py-4 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <NavItem 
          icon={Sparkles} 
          label="Criar" 
          active={activeTab === 'create'} 
          onClick={() => onTabChange('create')}
        />
        
        {/* Center Decorative Element */}
        <div className="w-12 h-12 -mt-8 bg-[#141210] border border-[#d4af37] rounded-xl rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <div className="-rotate-45 text-[#ffdb58]">
            <Sparkles size={24} fill="currentColor" />
          </div>
        </div>

        <NavItem 
          icon={BookOpen} 
          label="Biblioteca" 
          active={activeTab === 'library'} 
          onClick={() => onTabChange('library')}
        />
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#ffdb58]' : 'text-[#8a8175] hover:text-[#d4af37]'}`}
  >
    <Icon size={24} strokeWidth={active ? 2 : 1.5} />
    <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
  </button>
);
