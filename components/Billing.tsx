
import React from 'react';
import { CreditCard, History, Plus, ArrowUpRight, ArrowDownRight, Gift } from 'lucide-react';

const history = [
  { id: 'T1', type: 'credit', desc: 'Credit Top-up', amount: 50.00, date: 'Mar 12, 2024' },
  { id: 'T2', type: 'debit', desc: 'Survival Realm Renewal', amount: 12.00, date: 'Mar 10, 2024' },
  { id: 'T3', type: 'debit', desc: 'Dev API Node Renewal', amount: 5.00, date: 'Mar 05, 2024' },
  { id: 'T4', type: 'credit', desc: 'Promo Code: ALPHA20', amount: 10.00, date: 'Feb 28, 2024' },
];

const Billing: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wallet Balance */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent flex flex-col justify-center">
          <div>
            <p className="text-zinc-500 font-medium mb-1">Available Balance</p>
            <h2 className="text-6xl font-black gradient-text tracking-tighter">$1,245.50</h2>
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20">
                <Plus size={20} />
                Add Credits
              </button>
              <button className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10 text-zinc-300">
                <Gift size={20} />
                Redeem Code
              </button>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-6">Subscription Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Active Services</span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Monthly Burn Rate</span>
              <span className="font-bold text-red-400">-$64.50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Est. Runway</span>
              <span className="font-bold text-green-400">19 Months</span>
            </div>
          </div>
          <button className="mt-8 py-3 w-full bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm font-semibold">
            Manage Invoices
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <History className="text-indigo-400" />
            Recent Activity
          </h2>
          <button className="text-indigo-400 text-sm font-semibold hover:underline">View All History</button>
        </div>
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.type === 'credit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {item.type === 'credit' ? <ArrowUpRight /> : <ArrowDownRight />}
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-indigo-400 transition-colors">{item.desc}</h4>
                  <p className="text-xs text-zinc-500">{item.date} • ID: {item.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-mono font-bold ${item.type === 'credit' ? 'text-green-400' : 'text-zinc-300'}`}>
                  {item.type === 'credit' ? '+' : '-'}${item.amount.toFixed(2)}
                </p>
                <p className="text-[10px] text-zinc-600 uppercase font-black">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Billing;
