
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
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register onRegister={handleLogin} />} />
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
    <div className="flex min-h-screen bg-[#110d23] text-[#f8fafc] font-sans selection:bg-indigo-500/30">
      <SidebarWrapper 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-[#110d23] border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
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
            <button className="p-2.5 text-zinc-400 hover:text-indigo-400 transition-colors bg-white/5 rounded-xl border border-white/5">
              <Bell size={20} />
            </button>
            <div className="h-8 w-[1px] bg-white/5 mx-2"></div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none mb-1">Davin Sky</p>
                <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-black">Administrator</p>
              </div>
              <Link to="/account" className="w-10 h-10 rounded-xl bg-[#181330] border border-white/10 overflow-hidden hover:border-indigo-500 transition-all p-0.5">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Ptero" alt="Avatar" className="w-full h-full rounded-lg" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-10 overflow-y-auto relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/servers/:id" element={<ServerManagement />} />
            <Route path="/store" element={<Store />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<SettingsPage />} />
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
        fixed inset-y-0 left-0 z-50 w-72 bg-[#181330] border-r border-white/5 transform transition-transform duration-300 ease-in-out
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
    <div className="p-8 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
        <Zap className="w-6 h-6 text-white fill-white" />
      </div>
      <div>
        <span className="text-xl font-bubbly text-white tracking-wide">PteroCloud</span>
        <span className="block text-[8px] font-black uppercase text-indigo-400 tracking-[0.2em]">Authority Nodes</span>
      </div>
    </div>

    <nav className="flex-1 px-6 space-y-2 mt-4">
      <p className="px-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Registry Hub</p>
      <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Overview" />
      <SidebarLink to="/servers" icon={<ServerIcon size={20} />} label="My Instances" />
      <SidebarLink to="/store" icon={<ShoppingCart size={20} />} label="Deploy Hub" />
      <SidebarLink to="/billing" icon={<Wallet size={20} />} label="Balance" />

      <p className="px-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-10 mb-4">Privileged</p>
      <SidebarLink to="/admin" icon={<Crown size={20} className="text-amber-500" />} label="Authority Deck" />
    </nav>

    <div className="p-6 mt-auto">
      <div className="space-y-1">
        <SidebarLink to="/account" icon={<User size={18} />} label="Account" />
        <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full p-3 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all text-sm font-bold mt-2"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  </>
);

const AdminSidebar = ({ onLogout }: { onLogout: () => void }) => (
  <>
    <div className="p-8 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
        <Crown className="w-6 h-6 text-white" />
      </div>
      <div>
        <span className="block text-xl font-bubbly text-white">Authority</span>
        <span className="block text-[8px] font-black uppercase text-indigo-400 tracking-[0.2em]">System Root</span>
      </div>
    </div>

    <nav className="flex-1 px-6 space-y-2 mt-4">
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2 px-3 py-2.5 text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all bg-white/5 rounded-xl border border-white/5">
          <ChevronLeft size={14} /> Exit Admin
        </Link>
      </div>
      
      <p className="px-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Core Management</p>
      <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Authority Deck" />
      <SidebarLink to="/admin/nodes" icon={<Layers size={20} />} label="Infrastructure" />
      <SidebarLink to="/admin/users" icon={<Users size={20} />} label="Directory" />
      <SidebarLink to="/admin/plans" icon={<Zap size={20} />} label="Plan Modules" />
      <SidebarLink to="/admin/settings" icon={<Settings2 size={20} />} label="Core Core" />
    </nav>

    <div className="p-6 border-t border-white/5">
      <button 
        onClick={onLogout}
        className="flex items-center gap-3 w-full p-3 text-zinc-400 hover:text-rose-400 rounded-xl transition-all text-sm font-bold"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  </>
);

const ServerSidebar = ({ server, onLogout }: { server: any, onLogout: () => void }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'Console';

  return (
    <>
      <div className="p-6 border-b border-white/5">
        <Link to="/servers" className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-indigo-400 transition-all mb-6 group uppercase tracking-widest">
          <ChevronLeft size={14} /> Back to Registry
        </Link>
        <div className="flex items-center gap-4 p-4 bg-[#110d23] rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
             <ServerIcon size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-white truncate">{server.name}</h3>
            <p className="text-[10px] text-indigo-400 font-bold truncate">SERVER ID</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
        <TabSidebarLink tab="Console" icon={<Terminal size={20} />} active={currentTab === 'Console'} />
        <TabSidebarLink tab="Files" icon={<FileCode size={20} />} active={currentTab === 'Files'} />
        <TabSidebarLink tab="Databases" icon={<Database size={20} />} active={currentTab === 'Databases'} />
        <TabSidebarLink tab="Schedules" icon={<Calendar size={20} />} active={currentTab === 'Schedules'} />
        <TabSidebarLink tab="Users" icon={<Users size={20} />} active={currentTab === 'Users'} />
        <TabSidebarLink tab="Backups" icon={<Shield size={20} />} active={currentTab === 'Backups'} />
        <TabSidebarLink tab="Network" icon={<Network size={20} />} active={currentTab === 'Network'} />
        <TabSidebarLink tab="Startup" icon={<ListRestart size={20} />} active={currentTab === 'Startup'} />
        <TabSidebarLink tab="Settings" icon={<Settings size={20} />} active={currentTab === 'Settings'} />
      </nav>

      <div className="p-6">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full p-3 text-zinc-400 hover:text-rose-400 rounded-xl transition-all text-sm font-bold"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  return (
    <nav className="flex items-center text-[11px] font-black text-zinc-500 gap-3 uppercase tracking-widest">
      <Link to="/" className="hover:text-white transition-colors">Portal</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={name}>
            <ChevronRight size={14} className="text-zinc-700" />
            {isLast ? (
              <span className="text-white">{name.replace(/-/g, ' ')}</span>
            ) : (
              <Link to={routeTo} className="hover:text-white transition-colors">
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
        flex items-center gap-4 p-3.5 rounded-xl transition-all text-sm font-bold
        ${isActive 
          ? 'sidebar-active' 
          : 'text-zinc-400 hover:text-white hover:bg-white/5'}
        ${className || ''}
      `}
    >
      <span>{icon}</span>
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
        flex items-center gap-4 p-3.5 rounded-xl transition-all text-sm font-bold
        ${active 
          ? 'bg-indigo-600 text-white' 
          : 'text-zinc-400 hover:text-white hover:bg-white/5'}
      `}
    >
      <span>{icon}</span>
      {tab}
    </Link>
  );
};

export default App;
