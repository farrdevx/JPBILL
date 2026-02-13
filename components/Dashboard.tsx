
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
  Terminal
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
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Overview</h2>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            All Systems Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Servers" value="14" icon={<Server size={18}/>} change="+2" />
        <MetricCard label="Avg. Uptime" value="99.98%" icon={<Activity size={18}/>} change="0.01%" />
        <MetricCard label="Global Latency" value="24ms" icon={<Globe size={18}/>} />
        <MetricCard label="Cloud Balance" value="$421.50" icon={<TrendingUp size={18}/>} isCurrency />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface rounded-xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-zinc-100">Network Usage</h3>
            <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12} 
                  tick={{ fill: '#71717a' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12} 
                  tick={{ fill: '#71717a' }}
                />
                <Tooltip 
                  cursor={{ fill: '#27272a' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#6366f1' : '#3f3f46'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface rounded-xl p-6 flex flex-col">
          <h3 className="font-bold text-zinc-100 mb-6 flex items-center justify-between">
            Node Resources
            <ExternalLink size={14} className="text-zinc-500 hover:text-white cursor-pointer" />
          </h3>
          <div className="space-y-6 flex-1">
            <ResourceGauge label="vCPU Allocation" value={65} icon={<Cpu size={14} />} color="bg-indigo-500" />
            <ResourceGauge label="Memory Usage" value={42} icon={<Database size={14} />} color="bg-indigo-400" />
            <ResourceGauge label="Storage Pool" value={82} icon={<HardDrive size={14} />} color="bg-indigo-300" />
          </div>
          <button className="w-full mt-8 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-lg transition-colors">
            Node Settings
          </button>
        </div>
      </div>

      <div className="surface rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="font-bold text-white">Recent Deployments</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1c1c1f] text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-3 font-semibold">Instance Name</th>
              <th className="px-6 py-3 font-semibold">Node</th>
              <th className="px-6 py-3 font-semibold">Config</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <TableRow id="hub-01" name="NodeJS API" node="Singapore-1" config="2vCPU / 4GB" status="Online" />
            <TableRow id="db-01" name="Postgres-DB" node="USA-West" config="1vCPU / 2GB" status="Online" />
            <TableRow id="redis-01" name="Redis-Cache" node="Germany-4" config="0.5vCPU / 1GB" status="Starting" />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, change, isCurrency }: any) => (
  <div className="surface p-5 rounded-xl flex flex-col gap-3 group hover:border-zinc-600 transition-colors">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-zinc-800 text-zinc-400 group-hover:text-indigo-400 transition-colors rounded">
        {icon}
      </div>
      {change && (
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
          {change}
        </span>
      )}
    </div>
    <div>
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</p>
      <h4 className="text-2xl font-bold mt-1">{value}</h4>
    </div>
  </div>
);

const ResourceGauge = ({ label, value, icon, color }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-bold text-zinc-200">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const TableRow = ({ id, name, node, config, status }: { id: string, name: string, node: string, config: string, status: string }) => {
  const navigate = useNavigate();
  return (
    <tr className="hover:bg-zinc-800/50 transition-colors group">
      <td className="px-6 py-4 font-medium text-zinc-100">{name}</td>
      <td className="px-6 py-4 text-zinc-400">{node}</td>
      <td className="px-6 py-4 text-zinc-400">{config}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
          status === 'Online' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
          'bg-amber-500/10 text-amber-500 border-amber-500/20'
        }`}>
          <span className={`w-1 h-1 rounded-full ${status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        {status === 'Online' && (
          <button 
            onClick={() => navigate(`/servers/${id}`)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all shadow-lg shadow-indigo-600/10"
          >
            <Terminal size={12} />
            Manage
          </button>
        )}
      </td>
    </tr>
  );
};

export default Dashboard;
