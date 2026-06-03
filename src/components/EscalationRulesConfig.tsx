import React, { useState } from 'react';
import { EscalationRule } from '@/lib/types';
import {
  Settings,
  Search,
  RotateCcw,
  Sliders,
  CheckCircle,
  HelpCircle,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

interface EscalationRulesConfigProps {
  rules: EscalationRule[];
  onUpdateRule: (id: string, updated: Partial<EscalationRule>) => void;
  onResetRules: () => void;
}

export default function EscalationRulesConfig({
  rules,
  onUpdateRule,
  onResetRules,
}: EscalationRulesConfigProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter rules list
  const filteredRules = rules.filter((rule) => {
    const query = searchTerm.toLowerCase();
    return (
      rule.name.toLowerCase().includes(query) ||
      rule.description.toLowerCase().includes(query)
    );
  });

  // Helper for priority weight visual styling
  const getWeightColor = (weight: number) => {
    if (weight >= 9) return 'bg-rose-50 border-rose-250 text-rose-700';
    if (weight >= 6) return 'bg-amber-50 border-amber-250 text-amber-700';
    return 'bg-slate-50 border-slate-200 text-slate-600';
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 p-6 md:p-8 gap-8 select-none">
      
      {/* 1. Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            Escalation Rules Configurator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure automated support ticket routing triggers, priority weights, and activation thresholds.
          </p>
        </div>

        <button
          onClick={onResetRules}
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl bg-white text-xs font-semibold text-slate-600 transition-all cursor-pointer"
        >
          <RotateCcw size={13} />
          Reset Default Rules
        </button>
      </div>

      {/* 2. Rule Configuration controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search rules by name or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-55/30 focus:outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/5 transition-all text-slate-700 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Sliders size={13} className="text-slate-400" />
          Active Rules Count: <span className="text-slate-700 ml-1 bg-slate-100 px-2 py-0.5 rounded">{rules.filter(r => r.status === 'Active').length} / {rules.length}</span>
        </div>

      </div>

      {/* 3. Rules Table Dashboard */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex-grow flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold select-none uppercase tracking-wider text-[10px]">
              <tr>
                <th scope="col" className="px-6 py-4">Rule Name</th>
                <th scope="col" className="px-6 py-4">Priority Weight</th>
                <th scope="col" className="px-6 py-4">Description</th>
                <th scope="col" className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-semibold">
                    No rules found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredRules.map((rule) => {
                  return (
                    <tr key={rule.id} className="hover:bg-slate-55/10 transition-colors">
                      
                      {/* Column 1: Rule Name */}
                      <td className="px-6 py-4.5 font-extrabold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Settings size={13} className="text-slate-400" />
                          <span>{rule.name}</span>
                        </div>
                      </td>

                      {/* Column 2: Weight editor */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={rule.weight}
                            onChange={(e) =>
                              onUpdateRule(rule.id, { weight: parseInt(e.target.value, 10) })
                            }
                            className="w-20 md:w-24 custom-slider cursor-pointer"
                          />
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center justify-center min-w-[24px] ${getWeightColor(rule.weight)}`}>
                            {rule.weight}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Description */}
                      <td className="px-6 py-4.5 text-slate-600 font-medium max-w-sm leading-relaxed">
                        {rule.description}
                      </td>

                      {/* Column 4: Status Toggle */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateRule(rule.id, {
                              status: rule.status === 'Active' ? 'Disabled' : 'Active',
                            })
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-extrabold cursor-pointer transition-all ${
                            rule.status === 'Active'
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100/50'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            rule.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-350'
                          }`} />
                          {rule.status}
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Help Notes Card */}
      <div className="bg-indigo-50/15 border border-indigo-150/40 p-4.5 rounded-2xl flex items-start gap-3 select-text">
        <AlertCircle size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-extrabold text-indigo-950">Support Operations Routing Logic Guidance</span>
          <p className="leading-relaxed text-indigo-900 font-medium">
            Toggling rule statuses to <strong>Disabled</strong> will immediately bypass the corresponding automated logic matches inside the AI Copilot. Adjusted priority weights dynamically update calculated decision confidence scores. Rules with weights exceeding <strong>9</strong> are classified as critical infrastructure items.
          </p>
        </div>
      </div>

    </div>
  );
}
