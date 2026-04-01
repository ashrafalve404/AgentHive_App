import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  language: string;
  activeFilter: Record<string, string>;

  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  setLanguage: (lang: string) => void;
  setActiveFilter: (key: string, value: string) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  notificationsEnabled: true,
  language: 'en',
  activeFilter: {},

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
  setLanguage: (lang: string) => set({ language: lang }),
  setActiveFilter: (key: string, value: string) =>
    set((state) => ({
      activeFilter: { ...state.activeFilter, [key]: value },
    })),
  resetFilters: () => set({ activeFilter: {} }),
}));
