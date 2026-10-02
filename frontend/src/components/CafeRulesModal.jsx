import React from 'react';
import { X, ShieldCheck, Heart, Sparkles, Moon, Utensils, Volume2, Users } from 'lucide-react';

export function CafeRulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const rules = [
    {
      icon: ShieldCheck,
      title: '1. Hand Sanitization First',
      desc: 'All visitors must sanitize their hands at our hygiene counter before entering animal play zones to prevent transmission of outdoor germs.'
    },
    {
      icon: Moon,
      title: '2. Let Sleeping Pets Rest',
      desc: 'Animals in snooze baskets or marked "Resting" are off-duty. Please do not wake, pick up, or crowd around sleeping pets.'
    },
    {
      icon: Utensils,
      title: '3. Approved Café Treats Only',
      desc: 'Human food (especially chocolate, coffee, onion, or pastry dough) is strictly toxic to pets. Only feed small portions of staff-issued treats.'
    },
    {
      icon: Volume2,
      title: '4. Soft Voices & Gentle Petting',
      desc: 'Cats and rabbits have sensitive hearing. Avoid loud shouts, sudden aggressive movements, or chasing animals into corners.'
    },
    {
      icon: Users,
      title: '5. Child Supervision',
      desc: 'Children under 12 must be accompanied by an adult at all times while sitting in the petting lounges.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-lg w-full overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e75ff] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0e2445]">Café Petting Guidelines</h3>
              <p className="text-xs text-slate-500 font-medium">Keeping our furry family happy, safe, and healthy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {rules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 text-[#1e75ff] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#0e2445]">{rule.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{rule.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#1e75ff] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm cursor-pointer"
          >
            I Understand & Agree to the Rules
          </button>
        </div>

      </div>
    </div>
  );
}
