'use client';

import { useState, useEffect } from 'react';
import { devotionals, CATEGORIES } from '@/data/devotionals';
import Link from 'next/link';
import { BookOpen, Clock, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DevotionalsLibrary() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const filteredDevotionals = devotionals.filter(d => {
    const matchesCategory = activeCategory === 'Todos' || d.category === activeCategory;
    
    if (!searchQuery) return matchesCategory;

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      d.title.toLowerCase().includes(query) || 
      d.reflection.toLowerCase().includes(query) ||
      d.mainVerse.toLowerCase().includes(query) ||
      d.biblicalContext.toLowerCase().includes(query) ||
      d.practicalApplication.toLowerCase().includes(query) ||
      d.guidedPrayer.toLowerCase().includes(query) ||
      d.dailyChallenge.toLowerCase().includes(query);
      
    return matchesCategory && matchesSearch;
  });

  if (!isMounted) {
    return <main className="min-h-screen bg-slate-50 pb-24"></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-primary text-white pt-12 pb-6 px-6 rounded-b-3xl shadow-md sticky top-0 z-20">
        <h1 className="text-2xl font-bold mb-4">Biblioteca</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={cn("h-5 w-5 transition-colors", searchQuery ? "text-primary" : "text-slate-400")} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-3 border border-transparent rounded-xl leading-5 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:ring-0 sm:text-sm transition-all shadow-sm"
            placeholder="Buscar por título, versículo ou conteúdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="px-6 py-5 bg-white border-b border-slate-100 sticky top-[120px] z-10">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          <button
            onClick={() => setActiveCategory('Todos')}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeCategory === 'Todos' 
                ? "bg-primary text-white shadow-md" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Todos
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === category 
                  ? "bg-primary text-white shadow-md" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Devotionals List */}
      <div className="px-6 py-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800">
            {activeCategory === 'Todos' ? 'Recentes' : activeCategory}
          </h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-md">
            {filteredDevotionals.length} resultados
          </span>
        </div>

        {filteredDevotionals.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">Nenhum devocional encontrado</h3>
            <p className="text-slate-500 mt-1">Tente buscar com outras palavras.</p>
          </div>
        ) : (
          filteredDevotionals.map(devotional => (
            <Link 
              key={devotional.id} 
              href={`/devotional/${devotional.id}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-foreground bg-secondary/20 px-2 py-0.5 rounded">
                  {devotional.category}
                </span>
                <div className="flex items-center text-slate-400 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {devotional.readingTime} min
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 leading-tight">{devotional.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{devotional.reflection}</p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
