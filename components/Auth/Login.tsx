
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, Github, Chrome, Loader2, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#110d23] relative font-sans">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/50 mb-6 p-3">
             <Zap className="w-full h-full text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Protocol Access</h1>
          <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Authorized Session Only</p>
        </div>

        <div className="bg-[#181330] rounded-[2rem] p-10 sm:p-12 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Account Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="identity@jpshop.tech"
                  className="w-full bg-[#110d23] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-600 transition-all text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Access Phrase</label>
                <Link to="#" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#110d23] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-600 transition-all text-white"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 btn-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Connect Session
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest">
              <span className="bg-[#181330] px-4 text-zinc-600">Secure Authentication Hub</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3.5 bg-[#110d23] border border-white/10 rounded-xl hover:bg-[#110d23]/80 transition-all group">
              <Chrome size={18} className="text-zinc-500 group-hover:text-white" />
              <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3.5 bg-[#110d23] border border-white/10 rounded-xl hover:bg-[#110d23]/80 transition-all group">
              <Github size={18} className="text-zinc-500 group-hover:text-white" />
              <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white tracking-widest">Github</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-zinc-500 font-bold">
          New terminal user? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Request ID</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
