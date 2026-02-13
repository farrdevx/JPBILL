
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server as ServerIcon, 
  Settings, 
  Terminal, 
  Power, 
  Globe, 
  Cpu, 
  Database,
  Search,
  Filter,
  XCircle,
  MapPin
} from 'lucide-react';
import { mockServers } from '../services/ptero';

const Servers: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nodeFilter, setNodeFilter] = useState<string>('all');

  const nodes = useMemo(() => {
    const uniqueNodes = Array.from(new Set(mockServers.map(s => s.node)));
    return ['all', ...uniqueNodes];
  }, []);

  const filteredServers = useMemo(() => {
    return mockServers.filter(server => {
      const matchesSearch = 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.ip.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
      const matchesNode = nodeFilter === 'all' || server.node === nodeFilter;

      return matchesSearch && matchesStatus && matchesNode;
    });
  }, [searchQuery, statusFilter, nodeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setNodeFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Virtual Instances</h2>
          <p className="text-sm text-zinc-500">Real-time management and monitoring of your cloud infrastructure.</p>
        </div>
        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/10 transition-all active:scale-95">
          Deploy New Server
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search instances by name, IP, or ID..." 
            className="w-full bg-[#121214] border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-[#121214] border border-zinc-800 rounded-xl px-3 py-1.5 min-w-[140px]">
            <Filter size={14} className="text-zinc-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-300 focus:outline-none cursor-pointer w-full"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="starting">Starting</option>
              <option value="stopped">Stopped</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#121214] border border-zinc-800 rounded-xl px-3 py-1.5 min-w-[140px]">
            <MapPin size={14} className="text-zinc-500" />
            <select 
              value={nodeFilter}
              onChange={(e) => setNodeFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-300 focus:outline-none cursor-pointer w-full"
            >
              {nodes.map(node => (
                <option key={node} value={node}>
                  {node === 'all' ? 'All Locations' : node}
                </option>
              ))}
            </select>
          </div>

          {(statusFilter !== 'all' || nodeFilter !== 'all' || searchQuery !== '') && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <XCircle size={14} />
              Reset
            </button>
          )}
        </div>
      </div>

      {filteredServers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServers.map(server => (
            <div key={server.id} className="surface group hover:border-indigo-500/50 transition-all flex flex-col overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-indigo-500/5">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        server.status === 'running' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                        server.status === 'starting' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
                      }`}></div>
                      <h3 className="font-bold text-lg text-zinc-100 group-hover:text-indigo-400 transition-colors truncate max-w-[180px]">{server.name}</h3>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{server.node}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-1 rounded-md">
                    <Globe size={10} />
                    {server.ip}:{server.port}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#121214] border border-zinc-800/50 p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1.5 mb-1.5">
                      <Cpu size={12} className="text-indigo-500" /> CPU
                    </p>
                    <p className="text-sm font-black text-zinc-100">{server.resources?.cpu_absolute.toFixed(1)}%</p>
                  </div>
                  <div className="bg-[#121214] border border-zinc-800/50 p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1.5 mb-1.5">
                      <Database size={12} className="text-indigo-500" /> RAM
                    </p>
                    <p className="text-sm font-black text-zinc-100">{(server.resources!.memory_bytes / 1024 / 1024 / 1024).toFixed(1)} GB</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/50 pt-4">
                  <span className="font-mono">ID: {server.id}</span>
                  <span className="font-bold text-zinc-400 uppercase tracking-tighter">{server.limits.memory}MB MEMORY</span>
                </div>
              </div>

              <div className="bg-[#121214] border-t border-zinc-800 p-4 flex gap-2">
                <button 
                  onClick={() => navigate(`/servers/${server.id}`)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  <Terminal size={14} />
                  Manage
                </button>
                <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-700">
                  <Settings size={16} />
                </button>
                <button className="p-2.5 bg-zinc-800 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors border border-zinc-700">
                  <Power size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-zinc-800">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600">
            <ServerIcon size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">No instances found</h3>
            <p className="text-sm text-zinc-500 max-w-xs mt-2">We couldn't find any servers matching your search or filters. Try adjusting your criteria.</p>
          </div>
          <button 
            onClick={clearFilters}
            className="px-6 py-2 bg-indigo-600/10 text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-600/20 transition-all border border-indigo-500/20"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Servers;
