import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface SelectionCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ title, subtitle, icon: Icon, selected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(20, 18, 16, 1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 w-full aspect-square
        ${selected 
          ? 'bg-[#1a1814] border-[#ffdb58] shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
          : 'bg-[#141210] border-[#3d342b] hover:border-[#d4af37]'}
      `}
    >
      <div className={`mb-4 transition-colors ${selected ? 'text-[#ffdb58]' : 'text-[#8a8175]'}`}>
        <Icon size={40} strokeWidth={1.5} />
      </div>
      
      <h3 className={`font-serif text-lg font-bold mb-1 transition-colors ${selected ? 'text-[#ffdb58]' : 'text-[#e6c68b]'}`}>
        {title}
      </h3>
      
      <span className={`text-[10px] uppercase tracking-widest font-sans transition-colors ${selected ? 'text-[#d4af37]' : 'text-[#5c554d]'}`}>
        {subtitle}
      </span>
    </motion.button>
  );
};
