'use client';

import { use, useEffect, useState } from 'react';
import { getDevotionalById } from '@/data/devotionals';
import { useAppStore } from '@/store/app-store';
import Link from 'next/link';
import { ChevronLeft, Bookmark, Share2, CheckCircle2, Heart, BookOpen, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DevotionalReading({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const devotional = getDevotionalById(resolvedParams.id);
  
  const savedDevotionals = useAppStore(state => state.savedDevotionals);
  const completedDevotionals = useAppStore(state => state.completedDevotionals);
  const toggleSaveDevotional = useAppStore(state => state.toggleSaveDevotional);
  const markDevotionalCompleted = useAppStore(state => state.markDevotionalCompleted);

  const [isRead, setIsRead] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (devotional && completedDevotionals.includes(devotional.id)) {
      setIsRead(true);
    }
  }, [devotional, completedDevotionals]);

  if (!isMounted) {
    return <main className="min-h-screen bg-white pb-24"></main>;
  }

  if (!devotional) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Devocional não encontrado</h1>
        <button onClick={() => router.back()} className="px-6 py-3 bg-primary text-white rounded-xl font-medium">
          Voltar
        </button>
      </div>
    );
  }

  const isSaved = savedDevotionals.includes(devotional.id);

  const handleComplete = () => {
    markDevotionalCompleted(devotional.id);
    setIsRead(true);
    // Optional: show a toast or celebration animation here
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: devotional.title,
          text: `Leia este devocional: ${devotional.title}\n\n${devotional.mainVerse}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {devotional.category}
        </span>
        <div className="flex space-x-1">
          <button 
            onClick={() => toggleSaveDevotional(devotional.id)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Bookmark className={cn("w-5 h-5", isSaved ? "fill-secondary text-secondary" : "text-slate-600")} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <article className="px-6 py-8 max-w-prose mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 leading-tight font-serif">
          {devotional.title}
        </h1>

        {/* Main Verse */}
        <div className="bg-slate-50 border-l-4 border-primary p-5 rounded-r-2xl mb-10 relative">
          <BookOpen className="absolute top-4 right-4 w-5 h-5 text-primary/20" />
          <p className="text-lg font-serif italic text-slate-800 leading-relaxed mb-3">
            "{devotional.mainVerse.split('(')[0].trim()}"
          </p>
          <p className="text-sm font-bold text-primary text-right">
            {devotional.mainVerse.match(/\((.*?)\)/)?.[1] || ''}
          </p>
        </div>

        {/* Context */}
        <section className="mb-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" /> Contexto Bíblico
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {devotional.biblicalContext}
          </p>
        </section>

        {/* Reflection */}
        <section className="mb-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" /> Reflexão
          </h2>
          <div className="text-slate-800 leading-relaxed space-y-4 text-lg">
            {devotional.reflection.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Application */}
        <section className="mb-10 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" /> Aplicação Prática
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {devotional.practicalApplication}
          </p>
        </section>

        {/* Question */}
        <section className="mb-10">
          <div className="bg-secondary/10 p-6 rounded-3xl border border-secondary/20 text-center">
            <h2 className="text-xs font-bold text-secondary-foreground uppercase tracking-widest mb-4">
              Para Refletir
            </h2>
            <p className="text-lg font-medium text-slate-900 italic">
              "{devotional.reflectionQuestion}"
            </p>
          </div>
        </section>

        {/* Prayer */}
        <section className="mb-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <Heart className="w-4 h-4 mr-2" /> Oração Guiada
          </h2>
          <p className="text-slate-700 leading-relaxed italic border-l-2 border-slate-200 pl-4 py-2">
            {devotional.guidedPrayer}
          </p>
        </section>

        {/* Challenge & Extra Verse */}
        <div className="grid grid-cols-1 gap-4 mb-12">
          <div className="bg-slate-900 text-white p-6 rounded-3xl">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Desafio do Dia</h3>
            <p className="text-sm leading-relaxed">{devotional.dailyChallenge}</p>
          </div>
          <div className="bg-slate-100 p-6 rounded-3xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Versículo Extra</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{devotional.extraVerse}</p>
          </div>
        </div>

        {/* Complete Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleComplete}
            disabled={isRead}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300",
              isRead 
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                : "bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary/90 active:scale-95"
            )}
          >
            {isRead ? (
              <>
                <CheckCircle2 className="w-6 h-6 mr-2" />
                Devocional Concluído
              </>
            ) : (
              'Marcar como Lida'
            )}
          </button>
          
          {!isRead && (
            <p className="text-xs text-slate-400 mt-4 text-center">
              Ao marcar como lida, este devocional será adicionado ao seu histórico de progresso.
            </p>
          )}
        </div>
      </article>
    </main>
  );
}
