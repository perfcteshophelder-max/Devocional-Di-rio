'use client';

import { plans } from '@/data/plans';
import { useAppStore } from '@/store/app-store';
import Link from 'next/link';
import { Calendar, PlayCircle, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function PlansPage() {
  const activePlans = useAppStore(state => state.activePlans);
  const startPlan = useAppStore(state => state.startPlan);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <main className="min-h-screen bg-slate-50 pb-24"></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-primary text-white pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <h1 className="text-3xl font-bold mb-2">Planos de Leitura</h1>
        <p className="text-primary-foreground/80 text-sm">
          Jornadas temáticas para aprofundar sua fé.
        </p>
      </div>

      {/* Active Plans Section */}
      {activePlans.length > 0 && (
        <div className="px-6 mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <PlayCircle className="w-5 h-5 mr-2 text-primary" /> Em Andamento
          </h2>
          <div className="space-y-4">
            {activePlans.map(activePlan => {
              const plan = plans.find(p => p.id === activePlan.planId);
              if (!plan) return null;
              
              const progress = Math.round((activePlan.completedDays.length / plan.durationDays) * 100);
              
              return (
                <Link 
                  key={plan.id}
                  href={`/plans/${plan.id}`}
                  className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-primary/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900">{plan.title}</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {progress}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{activePlan.completedDays.length} de {plan.durationDays} dias</span>
                    <span className="flex items-center text-primary font-medium">
                      Continuar <ChevronRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* All Plans Section */}
      <div className="px-6 mt-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-slate-400" /> Descobrir Planos
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {plans.map(plan => {
            const isActive = activePlans.some(p => p.planId === plan.id);
            if (isActive) return null; // Don't show active plans in the discover section
            
            return (
              <div 
                key={plan.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-foreground bg-secondary/20 px-2 py-0.5 rounded">
                    {plan.durationDays} Dias
                  </span>
                  <div className="flex items-center text-slate-400 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    ~5 min/dia
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight">{plan.title}</h3>
                <p className="text-sm text-slate-500 mb-5 line-clamp-2 flex-grow">{plan.description}</p>
                
                <button
                  onClick={() => startPlan(plan.id)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl text-sm transition-colors flex items-center justify-center"
                >
                  Iniciar Plano
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
