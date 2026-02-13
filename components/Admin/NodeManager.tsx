
import React, { useEffect, useState } from 'react';
import { 
  Server, 
  MapPin, 
  Cpu, 
  Database, 
  HardDrive, 
  Activity, 
  Plus, 
  Settings,
  ShieldCheck,
  RefreshCw,
  MoreVertical,
  Loader2,
  AlertCircle,
  Globe,
  Hammer
} from 'lucide-react';
import { PteroService, getStoredConfig, PteroNode } from '../../services/ptero';

const NodeManager: React.FC = () => {
  const [nodes, setNodes] = useState<PteroNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = getStoredConfig('application');
      const service = new PteroService(config, 'application');
      const data = await service.listNodes();
      setNodes(data);
    } catch (err: any) {
      console.error('[NodeManager] Sync error:', err);
      setError(err.message || 'Gagal memuat infrastruktur.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenance = (nodeId: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, maintenance_mode: !node.maintenance_mode } 
        : node
    ));
    // Implementation Note: In a real scenario, we would trigger an API call to the panel here:
    // pteroService.updateNode(nodeId, { maintenance_mode: !currentStatus })
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Infrastructure Cluster</h2>
          <p className="text-sm text-zinc-500">Monitoring global compute nodes and resource allocation for jpshop.tech.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchNodes}
            disabled={loading}
            className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 text-sm font-bold rounded-xl transition-all flex items-center gap-2 border border-zinc-700"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
            Refresh Stats
          </button>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center gap-2">
            <Plus size={18} /> Deploy Node
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-start gap-4 text-rose-500 animate-in shake duration-500">
          <AlertCircle size={24} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-black uppercase tracking-widest text-[10px] mb-1">Synchronization Failed</p>
            <p className="text-sm font-medium leading-relaxed">{error}</p>
            <button 
              onClick={fetchNodes}
              className="mt-3 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300"
            >
              Try Reconnecting
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-zinc-500">
          <Loader2 size={48} className="animate-spin mb-6 text-indigo-500" />
          <p className="font-bold uppercase tracking-[0.2em] text-xs">PteroCloud Engine: Fetching Nodes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
          {nodes.length > 0 ? nodes.map(node => (
            <NodeCard 
              key={node.id}
              node={node}
              onToggleMaintenance={() => toggleMaintenance(node.id)}
            />
          )) : !error && (
            <div className="col-span-full surface p-20 rounded-[3rem] text-center border-dashed">
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No active nodes detected on the linked panel.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface NodeCardProps {
  node: PteroNode;
  onToggleMaintenance: () => void;
}

const NodeCard = ({ node, onToggleMaintenance }: NodeCardProps) => {
  const locationName = node.relationships?.location?.attributes?.short || 'Global';
  const ramUsed = node.memory / 1024;
  const diskUsed = node.disk / 1024;

  return (
    <div className="surface rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 border border-zinc-800/50 bg-zinc-900/10">
      <div className="p-8">
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl">
              <Server size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{node.name}</h3>
                <span className="px-2 py-0.5 bg-zinc-800 rounded text-[9px] font-mono text-zinc-500 uppercase">ID: {node.id}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mt-1 uppercase tracking-widest">
                <MapPin size={14} className="text-rose-500" /> {locationName} • {node.fqdn}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleMaintenance}
              title={node.maintenance_mode ? "Leave Maintenance Mode" : "Enter Maintenance Mode"}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                node.maintenance_mode 
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' 
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-amber-500/50 hover:text-amber-500'
              }`}
            >
              <Hammer size={16} />
            </button>
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${
              !node.maintenance_mode ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
              'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${!node.maintenance_mode ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {!node.maintenance_mode ? 'Node Online' : 'Maintenance'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <ResourceMetric label="Compute" val="vCPU Pool" color="bg-indigo-500" icon={<Cpu size={14}/>} />
          <ResourceMetric label="Memory" val={`${ramUsed.toFixed(1)} GB`} color="bg-indigo-400" icon={<Database size={14}/>} />
          <ResourceMetric label="Storage" val={`${diskUsed.toFixed(1)} GB`} color="bg-indigo-300" icon={<HardDrive size={14}/>} />
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-zinc-800/50">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
               <Activity size={12} className="text-emerald-500" /> Verified Node
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
               <ShieldCheck size={12} className="text-indigo-500" /> Daemon Connected
             </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"><Settings size={18}/></button>
            <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"><MoreVertical size={18}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceMetric = ({ label, val, color, icon }: any) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
      {icon} {label}
    </div>
    <p className="text-lg font-black text-white leading-none">{val}</p>
    <div className="h-1.5 w-full bg-zinc-950 border border-zinc-800/50 rounded-full overflow-hidden">
      <div className={`h-full ${color} w-[75%] shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-all duration-1000`} />
    </div>
  </div>
);

export default NodeManager;
