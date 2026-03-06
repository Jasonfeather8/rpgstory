import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface SelectorGroupProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export const SelectorGroup: React.FC<SelectorGroupProps> = ({ title, options, selected, onSelect }) => {
  return (
    <div className="mb-8">
      <h3 className="text-amber-500 font-serif text-xl mb-4 border-b border-amber-500/20 pb-2 inline-block">
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option)}
            className={`
              relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
              border border-opacity-20 flex items-center justify-center gap-2
              ${
                selected === option
                  ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-slate-200'
              }
            `}
          >
            {option}
            {selected === option && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1"
              >
                <Check size={12} className="text-amber-500" />
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
