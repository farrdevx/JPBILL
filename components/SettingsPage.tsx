
import React, { useState } from 'react';
import { Shield, Globe, Key, Save, AlertCircle } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [panelUrl, setPanelUrl] = useState('https://panel.example.com');
  const [apiKey, setApiKey] = useState('ptlc_xxxxxxxxxxxxxx');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-sm text-zinc-500">Configure your Pterodactyl Panel integration and billing preferences.</p>
      </div>

      <div className="surface rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
          <h3 className="font-bold flex items-center gap-2 text-white">
            <Shield size={18} className="text-indigo-400" />
            Pterodactyl API Access
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Globe size={14} /> Panel URL
              </label>
              <input 
                type="text" 
                value={panelUrl}
                onChange={(e) => setPanelUrl(e.target.value)}
                placeholder="https://panel.yourhosting.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-mono"
              />
              <p className="text-[10px] text-zinc-500">The base URL of your Pterodactyl installation.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Key size={14} /> Client API Key
              </label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ptlc_..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-mono"
              />
              <p className="text-[10px] text-zinc-500">Generate this in your User Settings on the Pterodactyl Panel.</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-indigo-400 shrink-0" />
            <div className="text-xs text-indigo-300 leading-relaxed">
              <span className="font-bold">Security Note:</span> Your API Key is stored locally in your browser's session and is never sent to our servers. Only the Pterodactyl client API is used for real-time management.
            </div>
          </div>
        </div>
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-800 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-600/10">
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="surface rounded-xl p-6">
        <h3 className="font-bold text-white mb-2">Danger Zone</h3>
        <p className="text-sm text-zinc-500 mb-6">Irreversible actions that affect your account and servers.</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 border border-rose-500/20 rounded-lg bg-rose-500/5">
            <div>
              <p className="text-sm font-bold text-rose-400">Suspend All Instances</p>
              <p className="text-[11px] text-zinc-500">Stop all running servers immediately.</p>
            </div>
            <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-md transition-colors">
              Execute Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
