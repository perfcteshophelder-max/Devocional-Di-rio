import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PrayerRequest {
  id: string;
  title?: string;
  description?: string;
  answered: boolean;
  createdAt?: string;
  answeredAt?: string;
  // Legacy fields for backward compatibility
  text?: string;
  date?: string;
}

export interface DiaryEntry {
  id: string;
  text: string;
  date: string;
}

export interface ActivePlan {
  planId: string;
  startedAt: string;
  completedDays: number[];
}

interface AppState {
  savedDevotionals: string[];
  completedDevotionals: string[];
  prayerRequests: PrayerRequest[];
  diaryEntries: DiaryEntry[];
  activePlans: ActivePlan[];
  usageDays: number;
  lastActiveDate: string | null;
  
  // Actions
  toggleSaveDevotional: (id: string) => void;
  markDevotionalCompleted: (id: string) => void;
  addPrayerRequest: (title: string, description?: string) => void;
  togglePrayerAnswered: (id: string) => void;
  deletePrayerRequest: (id: string) => void;
  addDiaryEntry: (text: string) => void;
  deleteDiaryEntry: (id: string) => void;
  startPlan: (planId: string) => void;
  markPlanDayCompleted: (planId: string, dayIndex: number) => void;
  recordActivity: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedDevotionals: [],
      completedDevotionals: [],
      prayerRequests: [],
      diaryEntries: [],
      activePlans: [],
      usageDays: 0,
      lastActiveDate: null,

      toggleSaveDevotional: (id) => set((state) => ({
        savedDevotionals: state.savedDevotionals.includes(id)
          ? state.savedDevotionals.filter(d => d !== id)
          : [...state.savedDevotionals, id]
      })),

      markDevotionalCompleted: (id) => set((state) => {
        if (state.completedDevotionals.includes(id)) return state;
        return { completedDevotionals: [...state.completedDevotionals, id] };
      }),

      addPrayerRequest: (title, description) => set((state) => ({
        prayerRequests: [
          { 
            id: Date.now().toString(), 
            title, 
            description, 
            answered: false, 
            createdAt: new Date().toISOString() 
          },
          ...(state.prayerRequests || [])
        ]
      })),

      togglePrayerAnswered: (id) => set((state) => ({
        prayerRequests: (state.prayerRequests || []).map(p => {
          if (p.id === id) {
            const isNowAnswered = !p.answered;
            return { 
              ...p, 
              answered: isNowAnswered,
              answeredAt: isNowAnswered ? new Date().toISOString() : undefined
            };
          }
          return p;
        })
      })),

      deletePrayerRequest: (id) => set((state) => ({
        prayerRequests: (state.prayerRequests || []).filter(p => p.id !== id)
      })),

      addDiaryEntry: (text) => set((state) => ({
        diaryEntries: [
          { id: Date.now().toString(), text, date: new Date().toISOString() },
          ...(state.diaryEntries || [])
        ]
      })),

      deleteDiaryEntry: (id) => set((state) => ({
        diaryEntries: (state.diaryEntries || []).filter(d => d.id !== id)
      })),

      startPlan: (planId) => set((state) => {
        if (state.activePlans.some(p => p.planId === planId)) return state;
        return {
          activePlans: [...state.activePlans, { planId, startedAt: new Date().toISOString(), completedDays: [] }]
        };
      }),

      markPlanDayCompleted: (planId, dayIndex) => set((state) => ({
        activePlans: state.activePlans.map(p => {
          if (p.planId === planId && !p.completedDays.includes(dayIndex)) {
            return { ...p, completedDays: [...p.completedDays, dayIndex] };
          }
          return p;
        })
      })),

      recordActivity: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastActiveDate !== today) {
          return {
            usageDays: state.usageDays + 1,
            lastActiveDate: today
          };
        }
        return state;
      }),
    }),
    {
      name: 'devocional-storage',
    }
  )
);
