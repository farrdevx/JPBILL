
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Cpu, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  Gamepad2, 
  Server, 
  Code, 
  Globe, 
  ShieldCheck,
  LayoutGrid,
  Box
} from 'lucide-react';
import { StoreCategory, SubCategory, Plan } from '../types';

const STORE_DATA: StoreCategory[] = [
  {
    id: 'gaming',
    name: 'Gaming Servers',
    description: 'Ultra-low latency infrastructure optimized for real-time multiplayer gaming.',
    subCategories: [
      {
        id: 'minecraft',
        name: 'Minecraft',
        icon: 'Gamepad2',
        packages: [
          // Added required description field to fix TypeScript errors
          { id: 'mc-1', name: 'Starter Hub', description: 'Perfect for a small group of friends or a private vanilla survival world.', cpu: 100, memory: 2048, disk: 10, price: 3.99, features: ['DDoS Protection', 'Instant Setup', '99.9% Uptime'] },
          { id: 'mc-2', name: 'Community Pro', description: 'Ideal for growing communities with plugins and custom world generation.', cpu: 200, memory: 8192, disk: 50, price: 12.99, features: ['Priority Support', 'Daily Backups', 'Advanced DDoS Shield'], popular: true },
          { id: 'mc-3', name: 'Network Beast', description: 'High-performance node for large networks and modded server clusters.', cpu: 400, memory: 32768, disk: 200, price: 45.00, features: ['Dedicated vCPU Threads', '24/7 Phone Support', 'Custom Domains'] },
        ]
      },
      {
        id: 'rust',
        name: 'Rust',
        icon: 'Zap',
        packages: [
          // Added required description field to fix TypeScript errors
          { id: 'rust-1', name: 'Rust Basic', description: 'Standard performance for a basic Rust server environment.', cpu: 200, memory: 8192, disk: 30, price: 15.00, features: ['SSD NVMe', 'Low Ping'] },
          { id: 'rust-2', name: 'Rust Extreme', description: 'Maximum performance for high-pop competitive Rust gameplay.', cpu: 400, memory: 16384, disk: 60, price: 29.00, features: ['Premium Bandwidth', 'Mod Support'] },
        ]
      }
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    description: 'Enterprise VPS and dedicated resource instances for professional workloads.',
    subCategories: [
      {
        id: 'vps-standard',
        name: 'VPS Standard',
        icon: 'Server',
        packages: [
          // Added required description field to fix TypeScript errors
          { id: 'vps-1', name: 'Cloud Node S1', description: 'Basic cloud instance for light web services or development environments.', cpu: 100, memory: 2048, disk: 40, price: 5.00, features: ['Root Access', 'IPv4 + IPv6'] },
          { id: 'vps-2', name: 'Cloud Node S2', description: 'Balanced compute and memory for production-ready applications.', cpu: 200, memory: 4096, disk: 80, price: 10.00, features: ['Scalable RAM', 'VNC Console'], popular: true },
        ]
      },
      {
        id: 'vps-high-ram',
        name: 'VPS High-RAM',
        icon: 'Database',
        packages: [
          // Added required description field to fix TypeScript errors
          { id: 'vps-hr-1', name: 'Database Node', description: 'High-memory instance optimized for heavy database workloads.', cpu: 400, memory: 32768, disk: 160, price: 35.00, features: ['Optimized for MySQL', 'RAID 10 Storage'] },
        ]
      }
    ]
  },
  {
    id: 'apps',
    name: 'App Hosting',
    description: 'Ready-to-deploy environments for your bots, APIs, and web applications.',
    subCategories: [
      {
        id: 'nodejs',
        name: 'Node.js / Python',
        icon: 'Code',
        packages: [
          // Added required description field to fix TypeScript errors
          { id: 'app-1', name: 'Small Worker', description: 'Lightweight worker for small scripts or simple Discord bots.', cpu: 50, memory: 512, disk: 5, price: 1.50, features: ['Auto-Restart', 'Git Deploy'] },
          { id: 'app-2', name: 'API Master', description: 'Powerful environment for production APIs and web services.', cpu: 100, memory: 2048, disk: 20, price: 5.00, features: ['SSL Included', 'Custom Ports'] },
        ]
      },
      {
        id: 'databases',
        name: 'Dedicated DB',
        icon: 'Box',
        packages: [
          // Added required description field to fix TypeScript errors
          { id: 'db-1', name: 'Redis Instance', description: 'In-memory caching and high-speed data storage with Redis.', cpu: 50, memory: 1024, disk: 10, price: 4.00, features: ['In-Memory Speed'] },
        ]
      }
    ]
  }
];

const Store: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(STORE_DATA[0].id);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState(STORE_DATA[0].subCategories[0].id);

  const activeCategory = useMemo(() => 
    STORE_DATA.find(c => c.id === activeCategoryId) || STORE_DATA[0]
  , [activeCategoryId]);

  const activeSubCategory = useMemo(() => 
    activeCategory.subCategories.find(s => s.id === activeSubCategoryId) || activeCategory.subCategories[0]
  , [activeCategory, activeSubCategoryId]);

  // Reset sub-category when main category changes
  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    const firstSub = STORE_DATA.find(c => c.id === id)?.subCategories[0];
    if (firstSub) setActiveSubCategoryId(firstSub.id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Cloud Store</h2>
        <p className="text-zinc-500 max-w-2xl">{activeCategory.description}</p>
      </div>

      {/* Main Categories Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-px">
        {STORE_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`
              px-6 py-3 text-sm font-bold transition-all border-b-2 
              ${activeCategoryId === cat.id 
                ? 'border-indigo-600 text-indigo-400 bg-indigo-600/5' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
            `}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sub-Categories Selection */}
      <div className="flex flex-wrap gap-3">
        {activeCategory.subCategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubCategoryId(sub.id)}
            className={`
              flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full border transition-all
              ${activeSubCategoryId === sub.id 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'}
            `}
          >
            <SubCategoryIcon iconName={sub.icon} />
            {sub.name}
          </button>
        ))}
      </div>

      {/* Package List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeSubCategory.packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`surface relative p-8 rounded-xl flex flex-col transition-all border group ${
              pkg.popular ? 'border-indigo-500 shadow-xl shadow-indigo-500/5' : 'hover:border-zinc-700'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase font-black px-4 py-1 rounded-full tracking-[0.2em]">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{pkg.name}</h3>
              <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest font-bold">{activeSubCategory.name} Package</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <SpecBox label="CPU" val={`${pkg.cpu}%`} />
              <SpecBox label="RAM" val={`${pkg.memory / 1024}GB`} />
              <SpecBox label="DISK" val={`${pkg.disk}GB`} />
            </div>

            <div className="space-y-3 mb-10 flex-1">
              {pkg.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 size={14} className="text-indigo-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-zinc-800/50">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-white">${pkg.price.toFixed(2)}</span>
                <span className="text-zinc-500 text-sm font-medium">/mo</span>
              </div>
              <button className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 ${
                pkg.popular 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10' 
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}>
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upsell / Protection Section */}
      <div className="surface rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border-dashed border-zinc-800 mt-20">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
             <ShieldCheck size={32} />
          </div>
          <div>
             <h4 className="text-xl font-bold text-white">Advanced DDoS Shielding</h4>
             <p className="text-sm text-zinc-500">All packages in the {activeCategory.name} category include real-time multi-layered protection as standard.</p>
          </div>
        </div>
        <div className="flex gap-4 shrink-0">
          <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-sm transition-all border border-zinc-700">
             View Topology
          </button>
          <button className="px-6 py-2.5 bg-white text-black font-bold rounded-lg text-sm transition-all">
             Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

const SubCategoryIcon = ({ iconName }: { iconName: string }) => {
  switch (iconName) {
    case 'Gamepad2': return <Gamepad2 size={14} />;
    case 'Zap': return <Zap size={14} />;
    case 'Server': return <Server size={14} />;
    case 'Database': return <Database size={14} />;
    case 'Code': return <Code size={14} />;
    case 'Box': return <Box size={14} />;
    default: return <LayoutGrid size={14} />;
  }
};

const SpecBox = ({ label, val }: { label: string, val: string }) => (
  <div className="bg-zinc-950 border border-zinc-800/50 p-2 rounded-lg text-center">
    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mb-0.5">{label}</p>
    <p className="text-[11px] font-bold text-zinc-200">{val}</p>
  </div>
);

export default Store;
