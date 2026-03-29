'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { Heart, Plus, CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PrayerArea() {
  const prayerRequests = useAppStore(state => state.prayerRequests);
  const addPrayerRequest = useAppStore(state => state.addPrayerRequest);
  const togglePrayerAnswered = useAppStore(state => state.togglePrayerAnswered);
  const deletePrayerRequest = useAppStore(state => state.deletePrayerRequest);

  const [newPrayer, setNewPrayer] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <main className="min-h-screen bg-slate-50 pb-24"></main>;
  }

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrayer.trim()) {
      addPrayerRequest(newPrayer.trim());
      setNewPrayer('');
    }
  };

  const filteredPrayers = prayerRequests.filter(p => {
    if (filter === 'active') return !p.answered;
    if (filter === 'answered') return p.answered;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-primary text-white pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Heart className="w-8 h-8 mr-3 fill-secondary text-secondary" /> 
          Área de Oração
        </h1>
        <p className="text-primary-foreground/80 text-sm">
          "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas..."
        </p>
      </div>

      {/* Add Prayer Form */}
      <div className="px-6 -mt-6 relative z-10">
        <form onSubmit={handleAddPrayer} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center">
          <input
            type="text"
            value={newPrayer}
            onChange={(e) => setNewPrayer(e.target.value)}
            placeholder="Qual é o seu pedido de oração?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-sm py-2"
          />
          <button
            type="submit"
            disabled={!newPrayer.trim()}
            className="ml-3 bg-primary text-white p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="px-6 mt-8 flex space-x-2">
        {(['all', 'active', 'answered'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors",
              filter === f 
                ? "bg-primary text-white" 
                : "bg-slate-200 text-slate-500 hover:bg-slate-300"
            )}
          >
            {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Respondidos'}
          </button>
        ))}
      </div>

      {/* Prayer List */}
      <div className="px-6 mt-6 space-y-4">
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <Heart className="mx-auto h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">Nenhum pedido encontrado</h3>
            <p className="text-slate-500 mt-1 text-sm px-4">
              {filter === 'all' ? 'Comece a registrar seus pedidos de oração acima.' : 
               filter === 'active' ? 'Você não tem pedidos ativos no momento.' : 
               'Nenhum pedido marcado como respondido ainda.'}
            </p>
          </div>
        ) : (
          filteredPrayers.map(prayer => (
            <div 
              key={prayer.id}
              className={cn(
                "bg-white rounded-2xl p-5 shadow-sm border transition-all",
                prayer.answered ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100"
              )}
            >
              <div className="flex items-start justify-between">
                <button 
                  onClick={() => togglePrayerAnswered(prayer.id)}
                  className="mt-0.5 mr-3 flex-shrink-0 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {prayer.answered ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={cn(
                    "text-slate-900 font-medium leading-relaxed",
                    prayer.answered && "line-through text-slate-500"
                  )}>
                    {prayer.text}
                  </p>
                  <div className="flex items-center mt-3 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {format(new Date(prayer.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    
                    {prayer.answered && (
                      <span className="ml-3 text-emerald-600 font-medium bg-emerald-100 px-2 py-0.5 rounded-md">
                        Respondida!
                      </span>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => deletePrayerRequest(prayer.id)}
                  className="ml-3 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
