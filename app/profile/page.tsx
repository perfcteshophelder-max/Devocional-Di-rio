'use client';

import { useAppStore } from '@/store/app-store';
import { ChevronLeft, User, Calendar, BookOpen, Heart, Award, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  
  const usageDays = useAppStore(state => state.usageDays);
  const completedDevotionals = useAppStore(state => state.completedDevotionals);
  const savedDevotionals = useAppStore(state => state.savedDevotionals);
  const prayerRequests = useAppStore(state => state.prayerRequests);
  const diaryEntries = useAppStore(state => state.diaryEntries);
  const activePlans = useAppStore(state => state.activePlans);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <main className="min-h-screen bg-slate-50 pb-24"></main>;
  }

  const answeredPrayers = prayerRequests.filter(p => p.answered).length;

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-primary text-white pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        
        <div className="flex items-center mb-8 relative z-10">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold ml-2">Meu Perfil</h1>
        </div>

        <div className="flex flex-col items-center relative z-10">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/20 flex items-center justify-center mb-4 shadow-xl">
            <User className="w-12 h-12 text-white/80" />
          </div>
          <h2 className="text-2xl font-bold">Caminhante</h2>
          <p className="text-primary-foreground/70 text-sm mt-1">Jornada Espiritual</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 grid grid-cols-2 gap-4">
          
          <div className="flex flex-col items-center text-center p-3 bg-orange-50 rounded-2xl border border-orange-100">
            <Flame className="w-6 h-6 text-orange-500 mb-2" />
            <span className="text-2xl font-black text-slate-900">{usageDays}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Dias de Uso</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
            <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-2xl font-black text-slate-900">{completedDevotionals.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Devocionais Lidos</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <Heart className="w-6 h-6 text-emerald-500 mb-2" />
            <span className="text-2xl font-black text-slate-900">{answeredPrayers}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Orações Respondidas</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <Award className="w-6 h-6 text-purple-500 mb-2" />
            <span className="text-2xl font-black text-slate-900">{activePlans.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Planos Iniciados</span>
          </div>

        </div>
      </div>

      {/* Progress Section */}
      <div className="px-6 mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-slate-400" /> Resumo da Jornada
        </h3>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <span className="text-slate-600 font-medium">Devocionais Salvos</span>
            <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{savedDevotionals.length}</span>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <span className="text-slate-600 font-medium">Pedidos de Oração</span>
            <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{prayerRequests.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Anotações no Diário</span>
            <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{diaryEntries.length}</span>
          </div>
        </div>
      </div>
      
      {/* Settings / Info */}
      <div className="px-6 mt-8 mb-8 text-center">
        <p className="text-xs text-slate-400">
          Devocional Diário - Caminhando com Deus<br/>
          Versão 1.0.0
        </p>
      </div>
    </main>
  );
}
