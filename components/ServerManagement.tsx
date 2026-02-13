
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Terminal, 
  Zap, 
  RotateCcw, 
  Square, 
  Skull, 
  Activity, 
  Database, 
  Cpu, 
  HardDrive,
  Copy,
  Check,
  FileCode,
  Calendar,
  Users,
  Shield,
  Network,
  Settings,
  ListRestart,
  Globe,
  Radio
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockServers } from '../services/ptero';
import FilesView from './FilesView';

type ServerTab = 'Console' | 'Files' | 'Databases' | 'Schedules' | 'Users' | 'Backups' | 'Network' | 'Startup' | 'Settings' | 'Activity';

const ServerManagement: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const server = mockServers.find(s => s.id === id);
  const [copied, setCopied] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const activeTab = (searchParams.get('tab') as ServerTab) || 'Console';

  const terminalRef = useRef<HTMLDivElement>(null);

  const [logs, setLogs] = useState<string[]>([
    "[JP-OS] Cluster initializing...",
    "[JP-OS] Network bridge established.",
    "[Container] Starting registry node...",
    "[Server] Server listening on 0.0.0.0:25565",
    "[Server] Terminal synchronized."
  ]);

  useEffect(() => {
    if (terminalRef.current && activeTab === 'Console') {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  const copyIp = () => {
    if (!server) return;
    navigator.clipboard.writeText(`${server.ip}:${server.port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!server || !id) return <div className="p-8 text-center text-zinc-500 font-black uppercase tracking-widest">Node Not Found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusMiniCard label="VCPU" value={`${server.resources?.cpu_absolute}%`} max={`${server.limits.cpu}%`} icon={<Cpu size={18}/>} color="indigo" />
        <StatusMiniCard label="RAM" value="4.2 GB" max={`${server.limits.memory / 1024} GB`} icon={<Database size={18}/>} color="indigo" />
        <StatusMiniCard label="DISK" value="10.7 GB" max={`${server.limits.disk / 1024} GB`} icon={<HardDrive size={18}/>} color="indigo" />
        <StatusMiniCard label="TRAFFIC" value="1.2 MB/s" max="1 Gbps" icon={<Activity size={18}/>} color="indigo" />
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === 'Console' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <div className="bg-[#09090b] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-[580px] shadow-2xl">
                <div className="px-8 py-5 border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <Terminal size={14} className="text-indigo-400" />
                    Terminal Output
                  </div>
                  <div className="flex items-center gap-5">
                     <span className="text-[10px] font-black text-emerald-500 flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       LIVE
                     </span>
                  </div>
                </div>
                <div 
                  ref={terminalRef}
                  className="flex-1 p-8 overflow-y-auto console-text text-[13px] text-zinc-300 space-y-1.5 bg-[#09090b]"
                >
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-zinc-700 select-none font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span className="font-medium">{log}</span>
                    </div>
                  ))}
                </div>
                <div className="p-5 bg-white/[0.02] border-t border-white/5 flex gap-4">
                  <span className="text-indigo-500 font-mono flex items-center justify-center pl-4 font-black">$</span>
                  <input 
                    type="text" 
                    placeholder="Enter command protocol..." 
                    className="flex-1 bg-transparent text-sm focus:outline-none text-white console-text font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="surface rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Control Protocol</h3>
                <div className="grid grid-cols-2 gap-4">
                  <PowerButton label="Ignite" icon={<Zap size={18}/>} color="hover:bg-emerald-600 border-emerald-500/10 text-emerald-500 hover:text-white" />
                  <PowerButton label="Recycle" icon={<RotateCcw size={18}/>} color="hover:bg-indigo-600 border-indigo-500/10 text-indigo-400 hover:text-white" />
                  <PowerButton label="Abort" icon={<Square size={18}/>} color="hover:bg-amber-600 border-amber-500/10 text-amber-500 hover:text-white" />
                  <PowerButton label="Purge" icon={<Skull size={18}/>} color="hover:bg-rose-600 border-rose-500/10 text-rose-500 hover:text-white" />
                </div>
              </div>

              <div className="surface rounded-[2.5rem] p-8">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Locator Data</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-bold">Registry IP</span>
                      <button onClick={copyIp} className="text-indigo-400 font-mono font-bold hover:text-white transition-colors flex items-center gap-2">
                        {server.ip}:{server.port}
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-bold">Node Identity</span>
                      <span className="text-white font-extrabold uppercase tracking-widest text-[10px]">SG-Indigo-01</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Files' && <FilesView serverId={id} />}
      </div>
    </div>
  );
};

const StatusMiniCard = ({ label, value, max, icon }: any) => {
  return (
    <div className="surface p-6 rounded-[2rem] flex items-center justify-between border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center text-indigo-400">{icon}</div>
        <div>
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">{label}</p>
          <p className="text-lg font-black text-white tracking-tighter">{value}</p>
        </div>
      </div>
    </div>
  );
};

const PowerButton = ({ label, icon, color }: any) => (
  <button className={`flex items-center justify-center gap-3 py-4 bg-white/[0.02] border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${color}`}>
    {icon}
    {label}
  </button>
);

export default ServerManagement;
