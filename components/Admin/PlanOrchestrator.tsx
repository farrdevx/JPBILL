
import React, { useState } from 'react';
import { 
  Zap, 
  Cpu, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  MoreVertical,
  X,
  Info
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  category: string;
  price: number;
  cpu: number;
  ram: number;
  disk: number;
  popular?: boolean;
  active: boolean;
}

const INITIAL_PLANS: Plan[] = [
  { id: '1', name: 'Starter Hub', category: 'Minecraft', price: 3.99, cpu: 100, ram: 2048, disk: 10, active: true },
  { id: '2', name: 'Community Pro', category: 'Minecraft', price: 12.99, cpu: 200, ram: 8192, disk: 50, popular: true, active: true },
  { id: '3', name: 'Cloud Node S1', category: 'VPS Standard', price: 5.00, cpu: 100, ram: 2048, disk: 40, active: true },
];

const PlanOrchestrator: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this package?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Plan Orchestrator</h2>
          <p className="text-sm text-zinc-500">Define compute resources, storage quotas, and automated billing tiers.</p>
        </div>
        <button 
          onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id}
            plan={plan}
            onEdit={() => { setEditingPlan(plan); setIsModalOpen(true); }}
            onDelete={() => handleDelete(plan.id)}
          />
        ))}
      </div>

      {/* Plan Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="surface w-full max-w-2xl rounded-[2.5rem] border-indigo-500/20 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white">{editingPlan ? 'Refine Package' : 'New Package Entity'}</h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Resource Orchestration</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Package Name</label>
                    <input type="text" placeholder="e.g. Extreme NVMe Hub" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Service Category</label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600">
                      <option>Minecraft Gaming</option>
                      <option>VPS Standard</option>
                      <option>VPS High-RAM</option>
                      <option>Database Node</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monthly Price ($)</label>
                    <input type="number" placeholder="9.99" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">CPU (%)</label>
                      <input type="number" defaultValue="100" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">RAM (MB)</label>
                      <input type="number" defaultValue="2048" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Storage (GB)</label>
                    <input type="number" defaultValue="10" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl mt-4">
                    <Info size={16} className="text-indigo-400 shrink-0" />
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">Resources will be automatically applied to Pterodactyl limits upon deployment.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  {editingPlan ? 'Apply Updates' : 'Deploy Package'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PlanCard = ({ plan, onEdit, onDelete }: { plan: Plan, onEdit: () => void, onDelete: () => void }) => (
  <div className={`surface rounded-[2rem] p-8 flex flex-col relative overflow-hidden group border transition-all ${
    plan.popular ? 'border-indigo-500/40 shadow-2xl shadow-indigo-500/5' : 'border-zinc-800'
  }`}>
    {!plan.active && (
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
        <span className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">Inactive Plan</span>
      </div>
    )}

    {plan.popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
        Most Popular
      </div>
    )}

    <div className="flex items-start justify-between mb-8">
      <div>
        <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{plan.name}</h3>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{plan.category}</p>
      </div>
      <button className="p-2 text-zinc-600 hover:text-white transition-colors"><MoreVertical size={18} /></button>
    </div>

    <div className="grid grid-cols-3 gap-3 mb-8">
      <ResourceBadge label="CPU" val={`${plan.cpu}%`} icon={<Cpu size={12}/>} />
      <ResourceBadge label="RAM" val={`${plan.ram/1024}GB`} icon={<Database size={12}/>} />
      <ResourceBadge label="DISK" val={`${plan.disk}GB`} icon={<HardDrive size={12}/>} />
    </div>

    <div className="pt-6 border-t border-zinc-800 mt-auto flex items-center justify-between">
      <div>
        <p className="text-2xl font-black text-white">${plan.price.toFixed(2)}</p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monthly Rate</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="p-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all">
          <Edit3 size={16} />
        </button>
        <button onClick={onDelete} className="p-3 bg-zinc-900 border border-zinc-800 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 rounded-xl transition-all">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

const ResourceBadge = ({ label, val, icon }: any) => (
  <div className="bg-zinc-950 border border-zinc-800/50 p-3 rounded-2xl text-center flex flex-col items-center">
    <div className="text-indigo-500 mb-1">{icon}</div>
    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mb-1">{label}</p>
    <p className="text-xs font-black text-zinc-200">{val}</p>
  </div>
);

export default PlanOrchestrator;
