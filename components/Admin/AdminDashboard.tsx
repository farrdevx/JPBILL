
import React from 'react';
import { 
  Users, 
  Server, 
  Database, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Shield,
  Layers,
  Cpu,
  Globe,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 4200, users: 120 },
  { name: 'Tue', revenue: 3800, users: 115 },
  { name: 'Wed', revenue: 5100, users: 140 },
  { name: 'Thu', revenue: 4800, users: 130 },
  { name: 'Fri', revenue: 6200, users: 180 },
  { name: 'Sat', revenue: 7500, users: 210 },
  { name: 'Sun', revenue: 6800, users: 190 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">System Authority</h2>
          <p className="text-zinc-500">Global oversight for jpshop infrastructure and financial intelligence.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs font-bold">
            <Shield size={14} />
            Privileged Session
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-xs font-bold">
            <Database size={14} />
            SQL Node: 159.89.170.25
          </div>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard label="Monthly Revenue" value="$42,850.00" change="+12.5%" trend="up" icon={<TrendingUp size={18}/>} />
        <AdminMetricCard label="Active Users" value="1,248" change="+48" trend="up" icon={<Users size={18}/>} />
        <AdminMetricCard label="SQL Latency" value="18ms" change="-4ms" trend="up" icon={<Activity size={18}/>} />
        <AdminMetricCard label="System Alerts" value="3" change="-2" trend="up" icon={<AlertCircle size={18}/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 surface rounded-[2.5rem] p-8 border-zinc-800 bg-zinc-900/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" />
              Financial Growth
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Daily</button>
              <button className="px-3 py-1.5 bg-indigo-600 rounded-lg text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-600/20">Weekly</button>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Database Health & Infrastructure */}
        <div className="space-y-6">
          <div className="surface rounded-[2.5rem] p-8 border-zinc-800 bg-zinc-900/10">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Database size={18} className="text-purple-400" />
              SQL Node Sync
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-100">jpshop_db</p>
                  <p className="text-[10px] text-zinc-500 font-mono">159.89.170.25:3306</p>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                   <Zap size={10} className="text-emerald-500" />
                   <span className="text-[8px] font-black text-emerald-500 uppercase">Linked</span>
                </div>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[94%] animate-pulse" />
              </div>
              <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase">
                <span>94% Consistency</span>
                <span>Last Sync: 2s ago</span>
              </div>
            </div>
          </div>

          <div className="surface rounded-[2.5rem] p-8 border-zinc-800 bg-zinc-900/10">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Activity size={18} className="text-indigo-400" />
              System Load
            </h3>
            <div className="space-y-4">
              <LoadMetric label="CPU Clusters" value={45} />
              <LoadMetric label="Memory Pool" value={72} />
              <LoadMetric label="Network I/O" value={28} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadMetric = ({ label, value }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-500" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const AdminMetricCard = ({ label, value, change, trend, icon }: any) => (
  <div className="surface p-6 rounded-[2rem] border-zinc-800 flex flex-col gap-4 group hover:border-indigo-500/30 transition-all bg-zinc-900/10">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/5 transition-all">
        {icon}
      </div>
      <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${
        trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
      }`}>
        {trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-black text-white tracking-tight">{value}</h4>
    </div>
  </div>
);

export default AdminDashboard;
