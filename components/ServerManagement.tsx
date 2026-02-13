
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
  ListRestart
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
  
  // Tab state managed via search param
  const searchParams = new URLSearchParams(location.search);
  const activeTab = (searchParams.get('tab') as ServerTab) || 'Console';

  const terminalRef = useRef<HTMLDivElement>(null);

  const [logs, setLogs] = useState<string[]>([
    "[PteroCloud] Connecting to WebSocket...",
    "[PteroCloud] Authentication successful.",
    "[Container] Starting server software...",
    "[Container] Loading world data...",
    "[Server] Server listening on 0.0.0.0:25565",
    "[Server] Startup completed in 4.2s."
  ]);

  useEffect(() => {
    if (terminalRef.current && activeTab === 'Console') {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  const copyIp = () => {
    navigator.clipboard.writeText(`${server?.ip}:${server?.port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!server) return <div className="p-8 text-center">Server not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusMiniCard label="vCPU" value={`${server.resources?.cpu_absolute}%`} max={`${server.limits.cpu}%`} icon={<Cpu size={16}/>} />
        <StatusMiniCard label="RAM" value="4.2 GB" max={`${server.limits.memory / 1024} GB`} icon={<Database size={16}/>} />
        <StatusMiniCard label="Disk" value="10.7 GB" max={`${server.limits.disk / 1024} GB`} icon={<HardDrive size={16}/>} />
        <StatusMiniCard label="Network" value="1.2 MB/s" max="1 Gbps" icon={<Activity size={16}/>} />
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'Console' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="surface bg-black rounded-xl border border-zinc-800 overflow-hidden flex flex-col h-[500px]">
                <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <Terminal size={12} className="text-indigo-500" />
                    Terminal Console
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       LIVE
                     </span>
                  </div>
                </div>
                <div 
                  ref={terminalRef}
                  className="flex-1 p-4 overflow-y-auto console-text text-[13px] text-zinc-300 space-y-1 bg-[#09090b]"
                >
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-zinc-600 select-none">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span dangerouslySetInnerHTML={{ __html: log.replace(/\[Server\]/g, '<span class="text-indigo-400 font-bold">[Server]</span>') }}></span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-zinc-900/50 border-t border-zinc-800 flex gap-2">
                  <span className="text-indigo-500 font-mono flex items-center justify-center pl-2 font-bold">$</span>
                  <input 
                    type="text" 
                    placeholder="Type a command..." 
                    className="flex-1 bg-transparent text-sm focus:outline-none text-zinc-200 console-text"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="surface rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Power Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <PowerButton label="Start" icon={<Zap size={16}/>} color="hover:bg-emerald-500 hover:text-white" />
                  <PowerButton label="Restart" icon={<RotateCcw size={16}/>} color="hover:bg-indigo-500 hover:text-white" />
                  <PowerButton label="Stop" icon={<Square size={16}/>} color="hover:bg-amber-500 hover:text-white" />
                  <PowerButton label="Kill" icon={<Skull size={16}/>} color="hover:bg-rose-500 hover:text-white text-rose-500" />
                </div>
              </div>

              <div className="surface rounded-xl p-5">
                 <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Resource Timeline</h3>
                 <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { t: 0, v: 20 }, { t: 1, v: 45 }, { t: 2, v: 38 }, { t: 3, v: 72 }, { t: 4, v: 41 }, { t: 5, v: 45 }
                      ]}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#6366f1" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="surface rounded-xl p-5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Instance Info</h3>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Address</span>
                      <button onClick={copyIp} className="text-indigo-400 font-mono hover:underline">{server.ip}:{server.port}</button>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Node</span>
                      <span className="text-zinc-300">Singapore-01</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Allocation</span>
                      <span className="text-zinc-300">25565 (Primary)</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Files' && <FilesView />}

        {activeTab !== 'Console' && activeTab !== 'Files' && (
          <div className="surface min-h-[400px] rounded-xl flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-xl shadow-indigo-600/5">
              <TabIcon tab={activeTab} size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{activeTab} Management</h3>
            <p className="text-sm text-zinc-500 max-w-sm">
              The {activeTab} management module allows you to interact directly with your server's {activeTab.toLowerCase()} in real-time.
            </p>
            <div className="mt-10 flex gap-4">
              <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/10">
                Refresh View
              </button>
              <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-all border border-zinc-700">
                Documentation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabIcon = ({ tab, size }: { tab: ServerTab, size: number }) => {
  switch (tab) {
    case 'Files': return <FileCode size={size} />;
    case 'Databases': return <Database size={size} />;
    case 'Schedules': return <Calendar size={size} />;
    case 'Users': return <Users size={size} />;
    case 'Backups': return <Shield size={size} />;
    case 'Network': return <Network size={size} />;
    case 'Startup': return <ListRestart size={size} />;
    case 'Settings': return <Settings size={size} />;
    case 'Activity': return <Activity size={size} />;
    default: return <Terminal size={size} />;
  }
};

const StatusMiniCard = ({ label, value, max, icon }: any) => (
  <div className="surface p-4 rounded-xl flex items-center justify-between group hover:border-indigo-500/50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-none mb-1">{label}</p>
        <p className="text-base font-bold text-white">{value}</p>
      </div>
    </div>
    <div className="text-right hidden sm:block">
      <p className="text-[10px] font-medium text-zinc-600">LIMIT: {max}</p>
    </div>
  </div>
);

const PowerButton = ({ label, icon, color }: any) => (
  <button className={`flex items-center justify-center gap-2 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${color}`}>
    {icon}
    {label}
  </button>
);

export default ServerManagement;
