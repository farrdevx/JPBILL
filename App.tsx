
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server as ServerIcon, 
  ShoppingCart, 
  Wallet, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X,
  Zap,
  ChevronRight,
  ChevronLeft,
  Terminal,
  FileCode,
  Database,
  Calendar,
  Users,
  Shield,
  Network,
  ListRestart,
  Activity,
  User,
  Crown,
  Layers,
  Settings2,
  Lock
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Store from './components/Store';
import Servers from './components/Servers';
import Billing from './components/Billing';
import ServerManagement from './components/ServerManagement';
import SettingsPage from './components/SettingsPage';
import Account from './components/Account';
import AdminDashboard from './components/Admin/AdminDashboard';
import NodeManager from './components/Admin/NodeManager';
import MemberDirectory from './components/Admin/MemberDirectory';
import PlanOrchestrator from './components/Admin/PlanOrchestrator';
import SystemSettings from './components/Admin/SystemSettings';
import AIChat from './components/AIChat';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { mockServers } from './services/ptero';

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ptero_auth_session') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('ptero_auth_session', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ptero_auth_session');
  };

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register onRegister={handleLogin} />} />

        {/* Protected Application Routes */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <AuthenticatedLayout 
                isMobileMenuOpen={isMobileMenuOpen} 
                setIsMobileMenuOpen={setIsMobileMenuOpen} 
                onLogout={handleLogout} 
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

const AuthenticatedLayout: React.FC<{ 
  isMobileMenuOpen: boolean, 
  setIsMobileMenuOpen: (v: boolean) => void,
  onLogout: () => void
}> = ({ isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30">
      <SidebarWrapper 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#09090b] border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#09090b]"></span>
            </button>
            <div className="h-8 w-[1px] bg-zinc-800 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-zinc-100 leading-none mb-1">Davin Sky</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Administrator</p>
              </div>
              <Link to="/account" className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-indigo-500 transition-colors">
                <img src="https://api.dicebear.com/7.x/shapes/svg?seed=Ptero" alt="Avatar" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative">
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/servers/:id" element={<ServerManagement />} />
            <Route path="/store" element={<Store />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/nodes" element={<NodeManager />} />
            <Route path="/admin/users" element={<MemberDirectory />} />
            <Route path="/admin/plans" element={<PlanOrchestrator />} />
            <Route path="/admin/settings" element={<SystemSettings />} />

            <Route path="*" element={<Dashboard />} />
          </Routes>
          <AIChat />
        </main>
      </div>
    </div>
  );
};

const SidebarWrapper: React.FC<{ 
  isMobileMenuOpen: boolean, 
  setIsMobileMenuOpen: (v: boolean) => void,
  onLogout: () => void
}> = ({ isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const serverMatch = location.pathname.match(/^\/servers\/([^\/]+)/);
  const serverId = serverMatch ? serverMatch[1] : null;
  const server = serverId ? mockServers.find(s => s.id === serverId) : null;

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#121214] border-r border-zinc-800 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex flex-col h-full">
        {isAdminPath ? (
          <AdminSidebar onLogout={onLogout} />
        ) : server ? (
          <ServerSidebar server={server} onLogout={onLogout} />
        ) : (
          <GlobalSidebar onLogout={onLogout} />
        )}
      </div>
    </aside>
  );
};

const GlobalSidebar = ({ onLogout }: { onLogout: () => void }) => (
  <>
    <div className="p-6 flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-white">PteroCloud</span>
    </div>

    <nav className="flex-1 px-4 space-y-1">
      <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Cloud Services</p>
      <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
      <SidebarLink to="/servers" icon={<ServerIcon size={18} />} label="My Instances" />
      <SidebarLink to="/store" icon={<ShoppingCart size={18} />} label="Deploy Hub" />
      <SidebarLink to="/billing" icon={<Wallet size={18} />} label="Finance" />

      <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-8 mb-2">Internal Access</p>
      <SidebarLink to="/admin" icon={<Crown size={18} className="text-amber-500" />} label="Admin Panel" />
    </nav>

    <div className="p-4 border-t border-zinc-800 space-y-1">
      <SidebarLink to="/account" icon={<User size={18} />} label="Account Settings" />
      <SidebarLink to="/settings" icon={<Settings size={18} />} label="Panel Connection" />
      <button 
        onClick={onLogout}
        className="flex items-center gap-3 w-full p-2.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-md transition-colors text-sm font-medium"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  </>
);

const AdminSidebar = ({ onLogout }: { onLogout: () => void }) => (
  <>
    <div className="p-6 flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
        <Crown className="w-5 h-5 text-white" />
      </div>
      <div>
        <span className="block text-lg font-bold tracking-tight text-white">Authority</span>
        <span className="block text-[8px] font-black uppercase text-indigo-400 tracking-[0.2em]">PteroCloud Admin</span>
      </div>
    </div>

    <nav className="flex-1 px-4 space-y-1">
      <div className="mb-4">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">
          <ChevronLeft size={14} /> Back to Client Area
        </Link>
      </div>
      
      <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Global Analytics</p>
      <SidebarLink to="/admin" icon={<LayoutDashboard size={18} />} label="Authority Deck" />
      <SidebarLink to="/admin/nodes" icon={<Layers size={18} />} label="Infrastructure" />
      <SidebarLink to="/admin/users" icon={<Users size={18} />} label="Member Directory" />
      
      <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-8 mb-2">Management</p>
      <SidebarLink to="/admin/plans" icon={<Zap size={18} />} label="Plan Orchestrator" />
      <SidebarLink to="/admin/settings" icon={<Settings2 size={18} />} label="System Core" />
    </nav>

    <div className="p-4 border-t border-zinc-800 space-y-1">
      <button 
        onClick={onLogout}
        className="flex items-center gap-3 w-full p-2.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-md transition-colors text-sm font-medium"
      >
        <LogOut size={18} />
        Sign Out
      </button>
      <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
           <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Privileged Access</span>
        </div>
        <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Session is encrypted and monitored for security audit.</p>
      </div>
    </div>
  </>
);

const ServerSidebar = ({ server, onLogout }: { server: any, onLogout: () => void }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'Console';

  return (
    <>
      <div className="p-4 border-b border-zinc-800">
        <Link to="/servers" className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors mb-4 group">
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          BACK TO SERVERS
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-500">
             <ServerIcon size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{server.name}</h3>
            <p className="text-[10px] text-zinc-500 font-mono truncate">{server.id}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Management</p>
        <TabSidebarLink tab="Console" icon={<Terminal size={18} />} active={currentTab === 'Console'} />
        <TabSidebarLink tab="Files" icon={<FileCode size={18} />} active={currentTab === 'Files'} />
        <TabSidebarLink tab="Databases" icon={<Database size={18} />} active={currentTab === 'Databases'} />
        <TabSidebarLink tab="Schedules" icon={<Calendar size={18} />} active={currentTab === 'Schedules'} />
        <TabSidebarLink tab="Users" icon={<Users size={18} />} active={currentTab === 'Users'} />
        
        <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-6 mb-2">System</p>
        <TabSidebarLink tab="Backups" icon={<Shield size={18} />} active={currentTab === 'Backups'} />
        <TabSidebarLink tab="Network" icon={<Network size={18} />} active={currentTab === 'Network'} />
        <TabSidebarLink tab="Startup" icon={<ListRestart size={18} />} active={currentTab === 'Startup'} />
        <TabSidebarLink tab="Settings" icon={<Settings size={18} />} active={currentTab === 'Settings'} />
        <TabSidebarLink tab="Activity" icon={<Activity size={18} />} active={currentTab === 'Activity'} />
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-3">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full p-2.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-md transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
        <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] font-bold text-zinc-500">UPTIME</span>
             <span className="text-[10px] font-bold text-emerald-500">ONLINE</span>
          </div>
          <p className="text-sm font-mono text-zinc-300">2d 14h 55m</p>
        </div>
      </div>
    </>
  );
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  return (
    <nav className="flex items-center text-sm text-zinc-400 gap-2">
      <Link to="/" className="hover:text-white cursor-pointer transition-colors">Portal</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={name}>
            <ChevronRight size={14} />
            {isLast ? (
              <span className="text-zinc-100 font-medium capitalize">{name.replace(/-/g, ' ')}</span>
            ) : (
              <Link to={routeTo} className="hover:text-white transition-colors capitalize">
                {name.replace(/-/g, ' ')}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; className?: string }> = ({ to, icon, label, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link 
      to={to} 
      className={`
        flex items-center gap-3 p-2.5 rounded-md transition-all text-sm font-medium
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}
        ${className || ''}
      `}
    >
      <span className={isActive ? 'text-white' : 'text-zinc-500'}>
        {icon}
      </span>
      {label}
    </Link>
  );
};

const TabSidebarLink = ({ tab, icon, active }: { tab: string, icon: React.ReactNode, active: boolean }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  searchParams.set('tab', tab);
  const to = `${location.pathname}?${searchParams.toString()}`;

  return (
    <Link 
      to={to} 
      className={`
        flex items-center gap-3 p-2.5 rounded-md transition-all text-sm font-medium
        ${active 
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}
      `}
    >
      <span className={active ? 'text-indigo-400' : 'text-zinc-500'}>
        {icon}
      </span>
      {tab}
    </Link>
  );
};

export default App;
