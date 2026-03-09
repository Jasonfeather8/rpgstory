import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Scroll, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        // Auto login after signup if email confirmation is not required
        // Or show a message to check email
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onLogin();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onLogin();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Ocorreu um erro ao tentar entrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0a08] flex flex-col items-center justify-center p-6 text-[#e6c68b] font-sans selection:bg-[#d4af37] selection:text-[#0b0a08]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-[#d4af37] opacity-50"></div>
            <Scroll size={32} className="text-[#ffdb58]" />
            <div className="h-[1px] w-12 bg-[#d4af37] opacity-50"></div>
          </div>
          <h1 className="font-display text-4xl text-[#ffdb58] font-bold tracking-wider drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)] mb-2">
            RPG STORY
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a8175]">
            The Ancient Scroll
          </p>
        </div>

        <div className="bg-[#141210] border border-[#3d342b] p-8 rounded-xl shadow-2xl relative overflow-hidden">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#3d342b] opacity-50"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#3d342b] opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#3d342b] opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#3d342b] opacity-50"></div>

          <div className="text-center mb-8 relative z-10">
            <h2 className="font-serif text-2xl text-[#e6c68b]">
              {isSignUp ? 'Forjar Nova Lenda' : 'Adentrar o Santuário'}
            </h2>
            <p className="text-sm text-[#8a8175] italic mt-1">
              {isSignUp ? '"Registre seu nome nos anais da história."' : '"Identifique-se, viajante."'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 flex items-start gap-2 text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a8175] mb-2">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0a08] border border-[#3d342b] rounded-lg px-4 py-3 text-[#e6c68b] focus:outline-none focus:border-[#d4af37] transition-colors placeholder-[#3d342b]"
                placeholder="viajante@reino.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8a8175] mb-2">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0b0a08] border border-[#3d342b] rounded-lg pl-4 pr-12 py-3 text-[#e6c68b] focus:outline-none focus:border-[#d4af37] transition-colors placeholder-[#3d342b]"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8175] hover:text-[#d4af37] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!email || !password || loading}
              className={`
                w-full py-4 mt-4 rounded-xl font-serif text-lg font-bold tracking-wide flex items-center justify-center gap-2 transition-all
                ${email && password && !loading
                  ? 'bg-[#d4af37] text-[#0b0a08] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02]' 
                  : 'bg-[#141210] text-[#5c554d] border border-[#3d342b] cursor-not-allowed'}
              `}
            >
              {loading ? (
                <Sparkles size={20} className="animate-pulse" />
              ) : (
                <Sparkles size={20} />
              )}
              {loading ? 'AGUARDE...' : (isSignUp ? 'CRIAR CONTA' : 'ENTRAR')}
            </button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm text-[#8a8175] hover:text-[#d4af37] transition-colors underline-offset-4 hover:underline"
            >
              {isSignUp ? 'Já possui uma conta? Entre aqui.' : 'Novo viajante? Crie sua conta.'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
