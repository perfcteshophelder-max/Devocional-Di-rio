'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { Heart, Plus, CheckCircle2, Circle, Trash2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PrayerArea() {
  const prayerRequests = useAppStore(state => state.prayerRequests || []);
  const addPrayerRequest = useAppStore(state => state.addPrayerRequest);
  const togglePrayerAnswered = useAppStore(state => state.togglePrayerAnswered);
  const deletePrayerRequest = useAppStore(state => state.deletePrayerRequest);

  const [isWriting, setIsWriting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filter, setFilter] = useState<'active' | 'answered'>('active');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <main className="min-h-screen bg-slate-50 pb-24"></main>;
  }

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addPrayerRequest(newTitle.trim(), newDescription.trim());
      setNewTitle('');
      setNewDescription('');
      setIsWriting(false);
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
      <div className="px-6 mt-6">
        {!isWriting ? (
          <button
            onClick={() => setIsWriting(true)}
            className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex items-center justify-center text-primary font-bold hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Novo Pedido de Oração
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Novo Pedido</h3>
              <span className="text-xs text-slate-400">
                {format(new Date(), "dd 'de' MMM", { locale: ptBR })}
              </span>
            </div>
            
            <form onSubmit={handleAddPrayer}>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Título do pedido (ex: Saúde da minha mãe)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none mb-3 font-medium"
                autoFocus
              />
              
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descrição opcional (detalhes do pedido...)"
                className="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none mb-4 text-sm"
              />
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsWriting(false);
                    setNewTitle('');
                    setNewDescription('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
                >
                  Salvar Pedido
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="px-6 mt-8">
        <div className="flex space-x-2 bg-slate-200/50 p-1 rounded-xl">
          <button
            onClick={() => setFilter('active')}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all",
              filter === 'active' 
                ? "bg-white text-primary shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Pedidos em Oração
          </button>
          <button
            onClick={() => setFilter('answered')}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all",
              filter === 'answered' 
                ? "bg-white text-emerald-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Orações Respondidas
          </button>
        </div>
      </div>

      {/* Prayer List */}
      <div className="px-6 mt-6 space-y-4">
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <Heart className="mx-auto h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">
              {filter === 'active' ? 'Nenhum pedido em oração' : 'Nenhuma oração respondida ainda'}
            </h3>
            <p className="text-slate-500 mt-1 text-sm px-4">
              {filter === 'active' 
                ? 'Comece a registrar seus pedidos de oração clicando no botão acima.' 
                : 'Quando Deus responder suas orações, marque-as para vê-las aqui.'}
            </p>
          </div>
        ) : (
          filteredPrayers.map(prayer => {
            const displayTitle = prayer.title || prayer.text || 'Sem título';
            const creationDate = new Date(prayer.createdAt || prayer.date || new Date().toISOString());
            const daysPraying = differenceInDays(new Date(), creationDate);
            
            return (
              <div 
                key={prayer.id}
                className={cn(
                  "bg-white rounded-2xl p-5 shadow-sm border transition-all",
                  prayer.answered ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className={cn(
                      "font-bold text-slate-900 leading-tight",
                      prayer.answered && "line-through text-slate-500"
                    )}>
                      {displayTitle}
                    </h4>
                    
                    {prayer.description && !prayer.answered && (
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                        {prayer.description}
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => togglePrayerAnswered(prayer.id)}
                    className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {prayer.answered ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    ) : (
                      <Circle className="w-7 h-7" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center text-slate-400">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {format(creationDate, "dd MMM yyyy", { locale: ptBR })}
                    </span>
                    
                    {!prayer.answered ? (
                      <span className="flex items-center text-primary/80 bg-primary/10 px-2 py-1 rounded-md font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Orando há {daysPraying === 0 ? 'menos de 1' : daysPraying} {daysPraying === 1 ? 'dia' : 'dias'}
                      </span>
                    ) : (
                      <span className="flex items-center text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Respondida{prayer.answeredAt ? ` em ${format(new Date(prayer.answeredAt), "dd MMM yyyy", { locale: ptBR })}` : '!'}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => deletePrayerRequest(prayer.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
