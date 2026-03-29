'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { Book, Plus, Trash2, Calendar, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SpiritualDiary() {
  const diaryEntries = useAppStore(state => state.diaryEntries);
  const addDiaryEntry = useAppStore(state => state.addDiaryEntry);
  const deleteDiaryEntry = useAppStore(state => state.deleteDiaryEntry);

  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <main className="min-h-screen bg-slate-50 pb-24"></main>;
  }

  const handleSaveEntry = () => {
    if (newEntry.trim()) {
      addDiaryEntry(newEntry.trim());
      setNewEntry('');
      setIsWriting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-primary text-white pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Book className="w-8 h-8 mr-3 text-secondary" /> 
          Diário Espiritual
        </h1>
        <p className="text-primary-foreground/80 text-sm">
          Registre suas reflexões, aprendizados e momentos com Deus.
        </p>
      </div>

      {/* Write Button / Form */}
      <div className="px-6 mt-6">
        {!isWriting ? (
          <button
            onClick={() => setIsWriting(true)}
            className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex items-center justify-center text-primary font-bold hover:bg-slate-50 transition-colors"
          >
            <PenLine className="w-5 h-5 mr-2" /> Escrever Nova Reflexão
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Nova Reflexão</h3>
              <span className="text-xs text-slate-400">
                {format(new Date(), "dd 'de' MMM", { locale: ptBR })}
              </span>
            </div>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="O que Deus falou com você hoje?"
              className="w-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsWriting(false);
                  setNewEntry('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEntry}
                disabled={!newEntry.trim()}
                className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Entries List */}
      <div className="px-6 mt-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-slate-400" /> Suas Anotações
        </h2>

        {diaryEntries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <Book className="mx-auto h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">Seu diário está vazio</h3>
            <p className="text-slate-500 mt-1 text-sm px-4">
              Comece a registrar sua jornada espiritual clicando no botão acima.
            </p>
          </div>
        ) : (
          <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {diaryEntries.map((entry, index) => (
              <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="text-xs font-bold text-white">
                    {format(new Date(entry.date), "dd", { locale: ptBR })}
                  </span>
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white border border-slate-100 shadow-sm ml-4 md:ml-0 group-hover:border-primary/20 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {format(new Date(entry.date), "MMMM yyyy", { locale: ptBR })}
                    </span>
                    <button 
                      onClick={() => deleteDiaryEntry(entry.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {entry.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
