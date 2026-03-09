import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sword, Crosshair, Cpu, 
  Wand2, Building2, Smile, Skull, Mountain, Theater, 
  Ghost, User, UserCheck, Scroll, Trash2, ChevronRight, LogOut, Rocket, Shield,
  Eye, Users, PenTool
} from 'lucide-react';
import { generateStory, generateNames } from './services/gemini';
import { SelectionCard } from './components/SelectionCard';
import { BottomNav } from './components/BottomNav';
import { ScrollDisplay } from './components/ScrollDisplay';
import { LoginScreen } from './components/LoginScreen';
import { supabase } from './lib/supabase';

// Mappings for UI
const NARRATORS_MAP = [
  { id: 'Primeira Pessoa', title: '1ª Pessoa', subtitle: 'Eu vivi isso', icon: Eye },
  { id: 'Terceira Pessoa', title: '3ª Pessoa', subtitle: 'A lenda diz', icon: Users },
];

const SETTINGS_MAP = [
  { id: 'Medieval', title: 'Medieval', subtitle: 'Aço & Feitiçaria', icon: Sword },
  { id: 'Faroeste', title: 'Faroeste', subtitle: 'Poeira & Vingança', icon: Crosshair },
  { id: 'Cyberpunk', title: 'Cyberpunk', subtitle: 'Neon & Neural', icon: Cpu },
  { id: 'Alta Fantasia', title: 'Alta Fantasia', subtitle: 'Deuses & Mitos', icon: Wand2 },
  { id: 'Atualidade', title: 'Atualidade', subtitle: 'Urbano & Real', icon: Building2 },
  { id: 'Ficção Científica', title: 'Ficção Científica', subtitle: 'Estrelas & Vazio', icon: Rocket },
];

const TONES_MAP = [
  { id: 'Feliz', title: 'Otimista', subtitle: 'Luz & Esperança', icon: Smile },
  { id: 'Vingança', title: 'Vingança', subtitle: 'Sangue & Honra', icon: Skull },
  { id: 'Superação', title: 'Superação', subtitle: 'Glória & Esforço', icon: Mountain },
  { id: 'Dramática', title: 'Drama', subtitle: 'Lágrimas & Destino', icon: Theater },
  { id: 'Vilanesca', title: 'Vilanesca', subtitle: 'Sombras & Poder', icon: Ghost },
  { id: 'Heroico', title: 'Heroico', subtitle: 'Coragem & Sacrifício', icon: Shield },
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('create');
  const [step, setStep] = useState<'narrator' | 'setting' | 'tone' | 'gender' | 'name' | 'result'>('narrator');
  
  const [narrator, setNarrator] = useState('');
  const [setting, setSetting] = useState('');
  const [tone, setTone] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [loadingNames, setLoadingNames] = useState(false);
  
  const [history, setHistory] = useState<SavedStory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      loadHistory();
    }
  }, [isAuthenticated, userId]);

  const loadHistory = async () => {
    if (!userId) return;
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Erro ao carregar histórico do Supabase:', error);
        return;
      }
      
      if (data) {
        setHistory(data.map(item => ({
          id: item.id,
          content: item.content,
          setting: item.setting,
          tone: item.tone,
          date: new Date(item.created_at).toLocaleDateString('pt-BR')
        })));
      }
    } catch (err) {
      console.error('Erro inesperado ao carregar histórico:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setStep('result');
    try {
      const result = await generateStory({ tone, setting, gender, narrator, name });
      setStory(result);
      
      // Save to Supabase
      const newStoryData = {
        content: result,
        setting,
        tone,
        user_id: userId,
      };
      
      try {
        const { data, error } = await supabase
          .from('stories')
          .insert([newStoryData])
          .select();
          
        if (error) {
          console.error('Erro ao salvar no Supabase:', error);
          // Fallback to local state if Supabase fails (e.g. table doesn't exist)
          const localStory: SavedStory = {
            id: Date.now().toString(),
            content: result,
            setting,
            tone,
            date: new Date().toLocaleDateString('pt-BR')
          };
          setHistory(prev => [localStory, ...prev].slice(0, 10));
        } else if (data && data.length > 0) {
          const savedStory: SavedStory = {
            id: data[0].id,
            content: data[0].content,
            setting: data[0].setting,
            tone: data[0].tone,
            date: new Date(data[0].created_at).toLocaleDateString('pt-BR')
          };
          setHistory(prev => [savedStory, ...prev].slice(0, 10));
        }
      } catch (err) {
        console.error('Erro inesperado ao salvar:', err);
        // Fallback to local state
        const localStory: SavedStory = {
          id: Date.now().toString(),
          content: result,
          setting,
          tone,
          date: new Date().toLocaleDateString('pt-BR')
        };
        setHistory(prev => [localStory, ...prev].slice(0, 10));
      }
      
    } catch (err) {
      setStory("Os deuses da narrativa estão silenciosos agora... Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const loadNameSuggestions = async () => {
    setStep('name');
    setLoadingNames(true);
    const names = await generateNames(setting, tone, gender);
    setSuggestedNames(names);
    setLoadingNames(false);
  };

  const reset = () => {
    setStep('narrator');
    setNarrator('');
    setSetting('');
    setTone('');
    setGender('');
    setName('');
    setStory(null);
    setSuggestedNames([]);
  };

  const deleteStory = async (id: string) => {
    // Optimistic update
    setHistory(prev => prev.filter(s => s.id !== id));
    
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Erro ao deletar do Supabase:', error);
      }
    } catch (err) {
      console.error('Erro inesperado ao deletar:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserId(null);
    reset();
    setActiveTab('create');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen pb-24 bg-[#0b0a08] text-[#e6c68b] font-sans selection:bg-[#d4af37] selection:text-[#0b0a08]">
      
      {/* Header */}
      <header className="flex flex-col items-center justify-center px-6 py-8 sticky top-0 bg-[#0b0a08]/95 backdrop-blur-md z-40 border-b border-[#3d342b] relative">
        <button 
          onClick={handleLogout}
          className="absolute top-6 right-6 text-[#8a8175] hover:text-[#d4af37] transition-colors flex flex-col items-center gap-1"
          title="Sair"
        >
          <LogOut size={20} />
          <span className="text-[8px] uppercase tracking-widest">Sair</span>
        </button>

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
            {step === 'narrator' && (
              <motion.div 
                key="narrator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl text-[#e6c68b]">Escolha o Narrador</h2>
                  <p className="text-sm text-[#8a8175] italic">"Quem conta esta lenda?"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {NARRATORS_MAP.map((item) => (
                    <SelectionCard
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      icon={item.icon}
                      selected={narrator === item.id}
                      onClick={() => {
                        setNarrator(item.id);
                        setTimeout(() => setStep('setting'), 300);
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

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
                <div className="grid grid-cols-2 gap-4 mb-6">
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
                <button 
                  onClick={() => setStep('narrator')}
                  className="w-full py-3 text-[#8a8175] text-sm hover:text-[#d4af37] transition-colors"
                >
                  Voltar para Narrador
                </button>
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
                      onClick={() => {
                        setGender(item.id);
                        setTimeout(() => loadNameSuggestions(), 300);
                      }}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setStep('tone')}
                  className="w-full py-3 text-[#8a8175] text-sm hover:text-[#d4af37] transition-colors"
                >
                  Voltar para Tons
                </button>
              </motion.div>
            )}

            {step === 'name' && (
              <motion.div 
                key="name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl text-[#e6c68b]">Nomeie seu Herói</h2>
                  <p className="text-sm text-[#8a8175] italic">"Como as lendas o chamarão?"</p>
                </div>
                
                <div className="bg-[#141210] border border-[#3d342b] p-6 rounded-xl shadow-lg mb-8">
                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-widest text-[#8a8175] mb-2 flex items-center gap-2">
                      <PenTool size={14} /> Nome do Personagem
                    </label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0b0a08] border border-[#3d342b] rounded-lg px-4 py-3 text-[#ffdb58] font-serif text-xl focus:outline-none focus:border-[#d4af37] transition-colors placeholder-[#3d342b]"
                      placeholder="Ex: Kaelen"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#8a8175] mb-3">Sugestões dos Oráculos</p>
                    {loadingNames ? (
                      <div className="flex justify-center py-4">
                        <Sparkles className="text-[#d4af37] animate-pulse" size={24} />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {suggestedNames.map((suggestedName, idx) => (
                          <button
                            key={idx}
                            onClick={() => setName(suggestedName)}
                            className="px-4 py-2 bg-[#0b0a08] border border-[#3d342b] text-[#e6c68b] rounded-lg hover:border-[#d4af37] hover:text-[#ffdb58] transition-colors font-serif"
                          >
                            {suggestedName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!name.trim()}
                    className={`
                      w-full py-4 rounded-xl font-serif text-lg font-bold tracking-wide flex items-center justify-center gap-2 transition-all
                      ${name.trim() 
                        ? 'bg-[#d4af37] text-[#0b0a08] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02]' 
                        : 'bg-[#141210] text-[#5c554d] border border-[#3d342b] cursor-not-allowed'}
                    `}
                  >
                    <Sparkles size={20} />
                    GERAR CRÔNICA
                  </button>
                  
                  <button 
                    onClick={() => setStep('gender')}
                    className="w-full py-3 text-[#8a8175] text-sm hover:text-[#d4af37] transition-colors"
                  >
                    Voltar para Gênero
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
                   title={name}
                   subtitle={`${setting} • ${tone}`}
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
