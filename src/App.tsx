import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sword, Crosshair, Cpu, 
  Wand2, Building2, Smile, Skull, Mountain, Theater, 
  Ghost, User, UserCheck, Scroll, Trash2, ChevronRight
} from 'lucide-react';
import { generateStory } from './services/gemini';
import { SelectionCard } from './components/SelectionCard';
import { BottomNav } from './components/BottomNav';
import { ScrollDisplay } from './components/ScrollDisplay';

// Mappings for UI
const SETTINGS_MAP = [
  { id: 'Medieval', title: 'Medieval', subtitle: 'Aço & Feitiçaria', icon: Sword },
  { id: 'Faroeste', title: 'Faroeste', subtitle: 'Poeira & Vingança', icon: Crosshair },
  { id: 'Cyberpunk', title: 'Cyberpunk', subtitle: 'Neon & Neural', icon: Cpu },
  { id: 'Alta Fantasia', title: 'Alta Fantasia', subtitle: 'Deuses & Mitos', icon: Wand2 },
  { id: 'Atualidade', title: 'Atualidade', subtitle: 'Urbano & Real', icon: Building2 },
];

const TONES_MAP = [
  { id: 'Feliz', title: 'Otimista', subtitle: 'Luz & Esperança', icon: Smile },
  { id: 'Vingança', title: 'Vingança', subtitle: 'Sangue & Honra', icon: Skull },
  { id: 'Superação', title: 'Superação', subtitle: 'Glória & Esforço', icon: Mountain },
  { id: 'Dramática', title: 'Drama', subtitle: 'Lágrimas & Destino', icon: Theater },
  { id: 'Vilanesca', title: 'Vilanesca', subtitle: 'Sombras & Poder', icon: Ghost },
];

const GENDERS_MAP = [
  { id: 'Masculino', title: 'Masculino', subtitle: 'Herói', icon: User },
  { id: 'Feminino', title: 'Feminino', subtitle: 'Heroína', icon: UserCheck },
];

interface SavedStory {
  id: string;
  content: string;
  setting: string;
  tone: string;
  date: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('create');
  const [step, setStep] = useState<'setting' | 'tone' | 'gender' | 'result'>('setting');
  
  const [setting, setSetting] = useState('');
  const [tone, setTone] = useState('');
  const [gender, setGender] = useState('');
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [history, setHistory] = useState<SavedStory[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    setStep('result');
    try {
      const result = await generateStory({ tone, setting, gender });
      setStory(result);
      
      // Save to history
      const newStory: SavedStory = {
        id: Date.now().toString(),
        content: result,
        setting,
        tone,
        date: new Date().toLocaleDateString('pt-BR')
      };
      
      setHistory(prev => [newStory, ...prev].slice(0, 5)); // Keep max 5
      
    } catch (err) {
      setStory("Os deuses da narrativa estão silenciosos agora... Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('setting');
    setSetting('');
    setTone('');
    setGender('');
    setStory(null);
  };

  const deleteStory = (id: string) => {
    setHistory(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen pb-24 bg-[#0b0a08] text-[#e6c68b] font-sans selection:bg-[#d4af37] selection:text-[#0b0a08]">
      
      {/* Header */}
      <header className="flex flex-col items-center justify-center px-6 py-8 sticky top-0 bg-[#0b0a08]/95 backdrop-blur-md z-40 border-b border-[#3d342b]">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-[1px] w-8 bg-[#d4af37] opacity-50"></div>
          <Scroll size={24} className="text-[#ffdb58]" />
          <div className="h-[1px] w-8 bg-[#d4af37] opacity-50"></div>
        </div>
        <h1 className="font-display text-3xl text-[#ffdb58] font-bold tracking-wider drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
          RPG STORY
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a8175] mt-1">
          The Ancient Scroll
        </p>
      </header>

      <main className="px-6 pt-6 max-w-md mx-auto">
        
        {activeTab === 'create' ? (
          <AnimatePresence mode="wait">
            {step === 'setting' && (
              <motion.div 
                key="setting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl text-[#e6c68b]">Escolha o Cenário</h2>
                  <p className="text-sm text-[#8a8175] italic">"Onde sua lenda começa?"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {SETTINGS_MAP.map((item) => (
                    <SelectionCard
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      icon={item.icon}
                      selected={setting === item.id}
                      onClick={() => {
                        setSetting(item.id);
                        setTimeout(() => setStep('tone'), 300);
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'tone' && (
              <motion.div 
                key="tone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl text-[#e6c68b]">Defina o Tom</h2>
                  <p className="text-sm text-[#8a8175] italic">"Qual a cor da sua alma?"</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {TONES_MAP.map((item) => (
                    <SelectionCard
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      icon={item.icon}
                      selected={tone === item.id}
                      onClick={() => {
                        setTone(item.id);
                        setTimeout(() => setStep('gender'), 300);
                      }}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setStep('setting')}
                  className="w-full py-3 text-[#8a8175] text-sm hover:text-[#d4af37] transition-colors"
                >
                  Voltar para Cenários
                </button>
              </motion.div>
            )}

            {step === 'gender' && (
              <motion.div 
                key="gender"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl text-[#e6c68b]">Selecione o Gênero</h2>
                  <p className="text-sm text-[#8a8175] italic">"Quem empunhará a espada?"</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {GENDERS_MAP.map((item) => (
                    <SelectionCard
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      icon={item.icon}
                      selected={gender === item.id}
                      onClick={() => setGender(item.id)}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!gender}
                    className={`
                      w-full py-4 rounded-xl font-serif text-lg font-bold tracking-wide flex items-center justify-center gap-2 transition-all
                      ${gender 
                        ? 'bg-[#d4af37] text-[#0b0a08] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02]' 
                        : 'bg-[#141210] text-[#5c554d] border border-[#3d342b] cursor-not-allowed'}
                    `}
                  >
                    <Sparkles size={20} />
                    GERAR CRÔNICA
                  </button>
                  
                  <button 
                    onClick={() => setStep('tone')}
                    className="w-full py-3 text-[#8a8175] text-sm hover:text-[#d4af37] transition-colors"
                  >
                    Voltar para Tons
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                 <ScrollDisplay 
                   content={story || ''} 
                   isLoading={loading} 
                   onCopy={() => story && navigator.clipboard.writeText(story)}
                   onReset={reset}
                   title={setting}
                   subtitle={`${tone} • ${gender}`}
                 />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <motion.div
            key="library"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl text-[#e6c68b]">Biblioteca</h2>
              <p className="text-sm text-[#8a8175] italic">"Suas lendas imortais"</p>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#3d342b] rounded-xl">
                <Scroll size={48} className="mx-auto text-[#3d342b] mb-4" />
                <p className="text-[#8a8175]">Nenhuma história forjada ainda.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="bg-[#141210] border border-[#3d342b] p-5 rounded-xl hover:border-[#d4af37] transition-all group relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg text-[#ffdb58] font-bold">{item.setting}</h3>
                    <span className="text-[10px] text-[#8a8175] uppercase tracking-wider">{item.date}</span>
                  </div>
                  <p className="text-sm text-[#8a8175] mb-3">{item.tone} • {item.content.slice(0, 60)}...</p>
                  
                  <div className="flex justify-between items-center mt-4 border-t border-[#3d342b] pt-3">
                    <button 
                      onClick={() => {
                        setStory(item.content);
                        setSetting(item.setting);
                        setTone(item.tone);
                        setStep('result');
                        setActiveTab('create');
                      }}
                      className="text-xs text-[#d4af37] flex items-center gap-1 hover:underline"
                    >
                      Ler Crônica <ChevronRight size={12} />
                    </button>
                    <button 
                      onClick={() => deleteStory(item.id)}
                      className="text-[#8a8175] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
