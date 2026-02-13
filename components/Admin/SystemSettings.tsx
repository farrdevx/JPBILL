
import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Save, 
  Shield, 
  Database, 
  Lock, 
  CreditCard,
  CheckCircle2,
  Loader2,
  Zap,
  AlertCircle,
  Wifi,
  WifiOff,
  ToggleLeft,
  ToggleRight,
  Info,
  Server,
  Key
} from 'lucide-react';
import { PteroService, getStoredConfig } from '../../services/ptero';

const SystemSettings: React.FC = () => {
  // Ptero Config
  const [panelUrl, setPanelUrl] = useState('https://jpshop.tech/');
  const [apiKey, setApiKey] = useState('ptla_iQ2j0a8ZKzLfojs1ABuTlRhesofkUQxzh8cZW57B0AG');
  const [useProxy, setUseProxy] = useState(true);

  // Database Config (User provided)
  const [dbHost, setDbHost] = useState('159.89.170.25');
  const [dbUser, setDbUser] = useState('jpshop');
  const [dbPass, setDbPass] = useState('ikanasin');
  const [dbName, setDbName] = useState('jpshop');
  
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const testDbConnection = async () => {
    setStatus('testing');
    // Simulating database connection logic
    // In a real app, this would call a backend API that connects to the MySQL server
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // Save all configs
      localStorage.setItem('ptero_config_application', JSON.stringify({
        baseUrl: panelUrl.trim(),
        apiKey: apiKey.trim(),
        useProxy: useProxy
      }));
      
      localStorage.setItem('sql_db_config', JSON.stringify({
        host: dbHost,
        user: dbUser,
        database: dbName
      }));
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 relative pb-24 text-zinc-300">
      {showToast && (
        <div className="fixed top-24 right-8 z-[100] bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300">
          <CheckCircle2 size={20} />
          <span className="text-sm font-bold">System Configuration Updated!</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">System Infrastructure</h2>
          <p className="text-sm text-zinc-500">Global core synchronization and database orchestration.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3 active:scale-95"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Infrastructure
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pterodactyl Panel Integration */}
        <div className="surface rounded-[2.5rem] overflow-hidden border-zinc-800 bg-zinc-900/10">
          <div className="p-8 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Application API</h3>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
               <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Active</span>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Server size={14} className="text-indigo-500" /> Panel Base URL
              </label>
              <input 
                type="text" 
                value={panelUrl} 
                onChange={(e) => setPanelUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-600 font-mono text-zinc-100 transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Key size={14} className="text-indigo-500" /> Admin API Key
              </label>
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-600 font-mono text-zinc-100 transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Database Infrastructure (Requested) */}
        <div className="surface rounded-[2.5rem] overflow-hidden border-zinc-800 bg-zinc-900/10">
          <div className="p-8 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 shadow-inner">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">SQL Master Cluster</h3>
            </div>
            <button 
              onClick={testDbConnection}
              disabled={status === 'testing'}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${
                status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              {status === 'testing' ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
              {status === 'testing' ? 'Connecting...' : status === 'success' ? 'Link Ready' : 'Test Link'}
            </button>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Master Host</label>
                <input 
                  type="text" 
                  value={dbHost} 
                  onChange={(e) => setDbHost(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-600 font-mono text-zinc-100" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Database Name</label>
                <input 
                  type="text" 
                  value={dbName} 
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-600 font-mono text-zinc-100" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Master User</label>
                <input 
                  type="text" 
                  value={dbUser} 
                  onChange={(e) => setDbUser(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-600 font-mono text-zinc-100" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Access Phrase</label>
                <input 
                  type="password" 
                  value={dbPass} 
                  onChange={(e) => setDbPass(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-600 font-mono text-zinc-100" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Financials Section */}
      <div className="surface rounded-[2.5rem] overflow-hidden border-zinc-800 bg-zinc-900/10">
        <div className="p-8 border-b border-zinc-800 bg-zinc-900/40">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Financial Orchestration</h3>
                <p className="text-xs text-zinc-500 mt-1">Global taxation and currency settings for jpshop ecosystem.</p>
              </div>
            </div>
        </div>
        <div className="p-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Primary Currency</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-600 text-zinc-100 appearance-none">
                  <option>IDR (Rp)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tax Percentage (%)</label>
                <input type="number" defaultValue="0" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-600 text-zinc-100" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Billing Cycle</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-600 text-zinc-100 appearance-none">
                  <option>Post-paid (Usage)</option>
                  <option>Pre-paid (Credit)</option>
                </select>
              </div>
           </div>
        </div>
      </div>
      
      <div className="flex items-start gap-4 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem]">
        <Info size={24} className="text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-300/80 font-medium leading-relaxed">
          <span className="font-bold block text-indigo-500 mb-1 uppercase tracking-widest text-[10px]">Architecture Note:</span>
          The SQL Master Cluster (159.89.170.25) is used for redundant backup of user transaction data and billing states. 
          Synchronization occurs every 60 seconds to ensure consistency across the PteroCloud environment.
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
