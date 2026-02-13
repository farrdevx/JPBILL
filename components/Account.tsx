
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  User, 
  Key, 
  Terminal, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Smartphone, 
  Plus, 
  Trash2,
  Clock,
  Monitor,
  Globe
} from 'lucide-react';

type AccountTab = 'Account' | 'API Credentials' | 'SSH Keys' | 'Activity';

const Account: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = (searchParams.get('tab') as AccountTab) || 'Account';

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-white tracking-tight">Account Settings</h2>
        <p className="text-zinc-500 text-sm">Manage your personal profile, security, and integration keys.</p>
      </div>

      {/* Account Navigation Tabs */}
      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar">
          {(['Account', 'API Credentials', 'SSH Keys', 'Activity'] as AccountTab[]).map((tab) => (
            <Link
              key={tab}
              to={`/account?tab=${tab}`}
              className={`
                px-8 py-5 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap
                ${activeTab === tab 
                  ? 'text-indigo-400 bg-indigo-500/5' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
              `}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_-2px_8px_rgba(99,102,241,0.4)]"></div>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'Account' && <AccountView />}
        {activeTab === 'API Credentials' && <ApiCredentialsView />}
        {activeTab === 'SSH Keys' && <SshKeysView />}
        {activeTab === 'Activity' && <ActivityView />}
      </div>
    </div>
  );
};

const AccountView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="space-y-8">
      {/* Update Password */}
      <div className="surface p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Lock size={18} className="text-indigo-400" />
          Update Password
        </h3>
        <div className="space-y-5">
          <InputGroup label="Current Password" type="password" placeholder="••••••••••••" />
          <InputGroup label="New Password" type="password" placeholder="••••••••••••" helper="At least 8 characters and unique." />
          <InputGroup label="Confirm New Password" type="password" placeholder="••••••••••••" />
          <button className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/10">
            Update Password
          </button>
        </div>
      </div>

      {/* Update Email */}
      <div className="surface p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Mail size={18} className="text-indigo-400" />
          Update Email Address
        </h3>
        <div className="space-y-5">
          <InputGroup label="Email" type="email" value="farrdevx@gmail.com" readOnly />
          <InputGroup label="Confirm Password" type="password" placeholder="••••••••••••" />
          <button className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/10">
            Update Email
          </button>
        </div>
      </div>
    </div>

    {/* Two Step Verification */}
    <div className="space-y-8">
      <div className="surface p-8 rounded-2xl h-full flex flex-col">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldCheck size={18} className="text-indigo-400" />
          Two-Step Verification
        </h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
               <Smartphone size={24} />
            </div>
            <div>
               <p className="text-zinc-100 font-bold">Status: Disabled</p>
               <p className="text-xs text-zinc-500">Enhance your account security.</p>
            </div>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-8">
            Two-step verification adds an extra layer of security to your account by requiring more than just a password to log in.
          </p>
          <button className="w-full px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-200 transition-all">
            Enable Two-Step
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ApiCredentialsView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="surface p-8 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Key size={18} className="text-indigo-400" />
        Create API Key
      </h3>
      <div className="space-y-5">
        <InputGroup label="Description" placeholder="Deployment Key" helper="A friendly name for this key." />
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Allowed IPs</label>
          <textarea 
            rows={4} 
            placeholder="Leave blank for any address..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
          />
          <p className="text-[10px] text-zinc-600">Provide each IP address on a new line.</p>
        </div>
        <button className="w-full px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/10">
          Create
        </button>
      </div>
    </div>

    <div className="surface p-8 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-6">Active API Keys</h3>
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center">
        <p className="text-zinc-500 text-sm">No API keys exist for this account.</p>
      </div>
    </div>
  </div>
);

const SshKeysView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="surface p-8 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Terminal size={18} className="text-indigo-400" />
        Add SSH Key
      </h3>
      <div className="space-y-5">
        <InputGroup label="SSH Key Name" placeholder="My MacBook Pro" />
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Public Key</label>
          <textarea 
            rows={6} 
            placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
          />
        </div>
        <button className="w-full px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/10">
          Save
        </button>
      </div>
    </div>

    <div className="surface p-8 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-6">Configured SSH Keys</h3>
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center">
        <p className="text-zinc-500 text-sm">No SSH Keys exist for this account.</p>
      </div>
    </div>
  </div>
);

const ActivityView = () => (
  <div className="surface rounded-2xl overflow-hidden">
    <div className="p-8 border-b border-zinc-800">
      <h3 className="text-xl font-bold text-white">Recent Account Activity</h3>
    </div>
    <div className="divide-y divide-zinc-800">
      <ActivityItem user="admin" action="auth:success" ip="172.27.160.1" time="1 day ago" />
      <ActivityItem user="admin" action="auth:success" ip="172.27.160.1" time="1 day ago" />
      <ActivityItem user="admin" action="auth:success" ip="::1" time="2 days ago" />
      <ActivityItem user="admin" action="auth:success" ip="172.27.160.1" time="2 days ago" />
      <ActivityItem user="admin" action="auth:success" ip="172.27.160.1" time="2 days ago" />
    </div>
    <div className="p-4 bg-zinc-900/50 flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
      <span>Showing 1 to 5 of 5 results.</span>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-30" disabled>Previous</button>
        <button className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-30" disabled>Next</button>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ user, action, ip, time }: any) => (
  <div className="p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
        <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user}`} alt="Avatar" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-100">{user}</span>
          <span className="text-zinc-500">—</span>
          <span className="text-indigo-400 font-mono text-xs">{action}</span>
          <Monitor size={14} className="text-zinc-600" />
        </div>
        <p className="text-xs text-zinc-500 mt-1">Logged in</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
           <span className="flex items-center gap-1"><Globe size={10} /> {ip}</span>
           <span className="flex items-center gap-1"><Clock size={10} /> {time}</span>
        </div>
      </div>
    </div>
  </div>
);

const InputGroup = ({ label, helper, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
    <input 
      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all"
      {...props}
    />
    {helper && <p className="text-[10px] text-zinc-600">{helper}</p>}
  </div>
);

export default Account;
