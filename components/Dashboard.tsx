
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server, 
  Activity, 
  Globe,
  TrendingUp,
  Cpu,
  Database,
  HardDrive,
  ExternalLink,
  Terminal,
  Layers,
  Zap,
  Shield
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 750 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Authority Deck</h2>
          <p className="text-zinc-500 font-medium">Global infrastructure telemetry and financial metrics.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#181330] rounded-2xl border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Systems Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Active Nodes" value="14" icon={<Layers size={22}/>} change="+2" color="indigo" />
        <MetricCard label="Service Pulse" value="99.9%" icon={<Zap size={22}/>} color="indigo" />
        <MetricCard label="Net Ingress" value="2.4ms" icon={<Globe size={22}/>} color="indigo" />
        <MetricCard label="Credits Balance" value="$1,245.50" icon={<TrendingUp size={22}/>} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 surface rounded-[2.5rem] p-10 border-white/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-white">Ingress Flow</h3>
              <p className="text-xs text-zinc-500 mt-1">Packets per second monitoring</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  tick={{ fill: '#71717a', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={10} 
                  tick={{ fill: '#71717a', fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#110d23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === data.length - 1 ? '#6366f1' : '#2b2347'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface rounded-[2.5rem] p-10 flex flex-col border-white/5">
          <h3 className="text-xl font-bold text-white mb-8">Node Load</h3>
          <div className="space-y-8 flex-1">
            <ResourceGauge label="CPU POOL" value={65} icon={<Cpu size={16} />} color="bg-indigo-500" />
            <ResourceGauge label="RAM POOL" value={42} icon={<Database size={16} />} color="bg-indigo-400" />
            <ResourceGauge label="DISK POOL" value={82} icon={<HardDrive size={16} />} color="bg-indigo-300" />
          </div>
          <button className="w-full mt-12 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5">
            Optimize Resources
          </button>
        </div>
      </div>

      <div className="surface rounded-[2.5rem] overflow-hidden border-white/5">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Global Instances</h3>
          <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">View History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#110d23] text-zinc-500 border-b border-white/5">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Instance Name</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Locator</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">State</th>
                <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <TableRow id="hub-01" name="Auth-Cluster-JP" node="SG-01" status="Online" />
              <TableRow id="db-01" name="Master-DB-Node" node="US-04" status="Online" />
              <TableRow id="redis-01" name="Cache-Registry" node="EU-02" status="Syncing" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, change, color }: any) => {
  return (
    <div className="surface p-8 rounded-[2rem] flex flex-col gap-5 border-white/5">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
          {icon}
        </div>
        {change && (
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
        <h4 className="text-3xl font-black mt-2 text-white tracking-tighter">{value}</h4>
      </div>
    </div>
  );
};

const ResourceGauge = ({ label, value, icon, color }: any) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        {icon}
        {label}
      </div>
      <span className="text-[10px] font-black text-white">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-[#110d23] rounded-full overflow-hidden border border-white/5">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const TableRow = ({ id, name, node, status }: { id: string, name: string, node: string, status: string }) => {
  const navigate = useNavigate();
  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="px-10 py-6">
        <span className="font-bold text-white text-sm">{name}</span>
      </td>
      <td className="px-10 py-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">{node}</td>
      <td className="px-10 py-6">
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
          status === 'Online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-400'
        }`}>
          {status}
        </span>
      </td>
      <td className="px-10 py-6 text-right">
        <button 
          onClick={() => navigate(`/servers/${id}`)}
          className="btn-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
        >
          Manage
        </button>
      </td>
    </tr>
  );
};

export default Dashboard;
