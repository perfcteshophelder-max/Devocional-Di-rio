'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { getDevotionalOfTheDay } from '@/data/devotionals';
import Link from 'next/link';
import { Clock, Bookmark, Share2, BookOpen, ChevronRight, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const recordActivity = useAppStore(state => state.recordActivity);
  const savedDevotionals = useAppStore(state => state.savedDevotionals);
  const toggleSaveDevotional = useAppStore(state => state.toggleSaveDevotional);
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    recordActivity();
  }, [recordActivity]);

  if (!isMounted) {
    return <main className="flex flex-col min-h-screen pb-20 bg-slate-50"></main>;
  }

  const devotional = getDevotionalOfTheDay();
  const isSaved = savedDevotionals.includes(devotional.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: devotional.title,
          text: `Leia o devocional de hoje: ${devotional.title}\n\n${devotional.mainVerse}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  };

  return (
    <main className="flex flex-col min-h-screen pb-20">
      {/* Header / Hero */}
      <div className="bg-primary text-primary-foreground px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h1 className="text-2xl font-bold mb-1">Bom dia!</h1>
            <p className="text-primary-foreground/80 text-sm">Caminhando com Deus hoje.</p>
          </div>
          <Link href="/profile" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm">
            <User className="w-6 h-6 text-white" />
          </Link>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 relative z-10">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Versículo do Dia</p>
          <p className="text-lg font-serif leading-snug italic mb-3">
            "{devotional.mainVerse.split('(')[0].trim()}"
          </p>
          <p className="text-xs text-primary-foreground/70 text-right">
            {devotional.mainVerse.match(/\((.*?)\)/)?.[1] || ''}
          </p>
        </div>
      </div>

      {/* Devotional of the Day Card */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-secondary/20 text-secondary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {devotional.category}
            </span>
            <div className="flex items-center text-slate-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {devotional.readingTime} min
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
            {devotional.title}
          </h2>
          
          <p className="text-slate-600 text-sm line-clamp-3 mb-5">
            {devotional.reflection}
          </p>
          
          <div className="flex items-center justify-between">
            <Link 
              href={`/devotional/${devotional.id}`}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Iniciar Leitura
            </Link>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => toggleSaveDevotional(devotional.id)}
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  isSaved ? "bg-secondary/20 text-secondary-foreground" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Continue sua jornada</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/plans" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:border-primary/20 transition-colors">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            </div>
            <span className="font-semibold text-slate-900 text-sm">Planos de Leitura</span>
            <span className="text-xs text-slate-500 mt-1">Cresça diariamente</span>
          </Link>
          
          <Link href="/prayer" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:border-primary/20 transition-colors">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">Seus Pedidos</span>
            <span className="text-xs text-slate-500 mt-1">Fale com Deus</span>
          </Link>
        </div>
      </div>

      {/* Recent Devotionals Teaser */}
      <div className="px-6 mt-8 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Explorar Temas</h3>
          <Link href="/devotionals" className="text-sm font-medium text-primary flex items-center">
            Ver todos <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          {['Ansiedade', 'Família', 'Propósito', 'Fé'].map((cat, i) => (
            <Link 
              key={cat} 
              href={`/devotionals?category=${cat}`}
              className={cn(
                "flex-none px-5 py-3 rounded-xl font-medium text-sm border shadow-sm transition-colors",
                i === 0 ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-slate-200 hover:border-primary/30"
              )}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
