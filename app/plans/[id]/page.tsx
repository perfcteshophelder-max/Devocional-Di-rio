'use client';

import { use, useEffect, useState } from 'react';
import { getPlanById } from '@/data/plans';
import { getDevotionalById } from '@/data/devotionals';
import { useAppStore } from '@/store/app-store';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, Circle, PlayCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function PlanDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const plan = getPlanById(resolvedParams.id);
  
  const activePlans = useAppStore(state => state.activePlans);
  const markPlanDayCompleted = useAppStore(state => state.markPlanDayCompleted);
  const startPlan = useAppStore(state => state.startPlan);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <main className="min-h-screen bg-slate-50 pb-24"></main>;
  }

  const activePlan = activePlans.find(p => p.planId === resolvedParams.id);
  const isStarted = !!activePlan;

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Plano não encontrado</h1>
        <button onClick={() => router.back()} className="px-6 py-3 bg-primary text-white rounded-xl font-medium">
          Voltar
        </button>
      </div>
    );
  }

  const progress = activePlan ? Math.round((activePlan.completedDays.length / plan.durationDays) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-primary text-white pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 mb-4 rounded-full hover:bg-white/10 transition-colors inline-block"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-secondary/20 text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            {plan.durationDays} Dias
          </span>
          {isStarted && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
              {progress}% Concluído
            </span>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-2 leading-tight">{plan.title}</h1>
        <p className="text-primary-foreground/80 text-sm leading-relaxed">
          {plan.description}
        </p>

        {!isStarted && (
          <button
            onClick={() => startPlan(plan.id)}
            className="mt-6 w-full bg-white text-primary font-bold py-3.5 rounded-xl shadow-md hover:bg-slate-50 transition-colors"
          >
            Iniciar Plano
          </button>
        )}
      </div>

      {/* Days List */}
      <div className="px-6 py-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-slate-400" /> Cronograma
        </h2>
        
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {plan.devotionalIds.map((devotionalId, index) => {
            const devotional = getDevotionalById(devotionalId);
            if (!devotional) return null;
            
            const isCompleted = activePlan?.completedDays.includes(index);
            // Day is unlocked if it's the first day, or if the previous day is completed
            const isUnlocked = !isStarted ? false : (index === 0 || activePlan?.completedDays.includes(index - 1));
            
            return (
              <div key={devotionalId} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10",
                  isCompleted ? "bg-primary border-primary text-white" : 
                  isUnlocked ? "border-primary text-primary" : "border-slate-200 text-slate-300"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-slate-100 shadow-sm ml-4 md:ml-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dia {index + 1}</span>
                  </div>
                  <h3 className={cn(
                    "font-bold text-base mb-2 leading-tight",
                    !isUnlocked && !isCompleted ? "text-slate-400" : "text-slate-900"
                  )}>
                    {devotional.title}
                  </h3>
                  
                  {isUnlocked && !isCompleted ? (
                    <Link 
                      href={`/devotional/${devotional.id}`}
                      onClick={() => markPlanDayCompleted(plan.id, index)}
                      className="inline-flex items-center text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg mt-2"
                    >
                      <PlayCircle className="w-4 h-4 mr-1.5" /> Ler Agora
                    </Link>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg mt-2">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Concluído
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg mt-2">
                      Bloqueado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
