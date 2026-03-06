import React from 'react';
import { motion } from 'motion/react';
import { Copy, RefreshCw, Feather, BookMarked } from 'lucide-react';

interface ScrollDisplayProps {
  content: string;
  isLoading: boolean;
  onCopy: () => void;
  onReset: () => void;
  title?: string;
  subtitle?: string;
}

export const ScrollDisplay: React.FC<ScrollDisplayProps> = ({ content, isLoading, onCopy, onReset, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-2xl mx-auto mt-4"
    >
      {/* Dark Card Container */}
      <div className="bg-[#141210] border border-[#3d342b] rounded-sm p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#3d342b] opacity-50"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#3d342b] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#3d342b] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#3d342b] opacity-50"></div>

        {/* Content Container */}
        <div className="relative z-20">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="text-[#d4af37] opacity-80">
              <BookMarked size={32} />
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-[#e6c68b] mb-2">{title || "Crônica Gerada"}</h2>
            <p className="font-serif italic text-[#8a8175] text-sm">"{subtitle || "Onde a imaginação encontra o destino"}"</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0],
                  y: [0, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Feather size={48} className="text-[#d4af37]" />
              </motion.div>
              <p className="text-[#8a8175] font-serif italic animate-pulse">
                Tecendo o destino nas estrelas...
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="prose prose-invert max-w-none">
                {content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className={`mb-4 text-justify text-[#c0b8b0] leading-relaxed font-serif text-lg ${idx === 0 ? 'drop-cap' : ''}`}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-4 my-8 opacity-30">
                <div className="h-[1px] w-16 bg-[#d4af37]"></div>
                <div className="w-2 h-2 rotate-45 border border-[#d4af37]"></div>
                <div className="h-[1px] w-16 bg-[#d4af37]"></div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onCopy}
                  className="w-full py-4 border border-[#3d342b] bg-[#1a1814] text-[#e6c68b] font-serif font-bold uppercase tracking-wider hover:bg-[#25221d] hover:border-[#d4af37] transition-all flex items-center justify-between px-6 rounded-sm group"
                >
                  <span>Copiar Crônica</span>
                  <Copy size={18} className="text-[#8a8175] group-hover:text-[#ffdb58]" />
                </button>
                
                <button
                  onClick={onReset}
                  className="w-full py-4 border border-[#3d342b] bg-[#1a1814] text-[#e6c68b] font-serif font-bold uppercase tracking-wider hover:bg-[#25221d] hover:border-[#d4af37] transition-all flex items-center justify-between px-6 rounded-sm group"
                >
                  <span>Nova História</span>
                  <RefreshCw size={18} className="text-[#8a8175] group-hover:text-[#ffdb58]" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
