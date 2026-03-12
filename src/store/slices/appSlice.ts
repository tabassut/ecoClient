import type { StateCreator } from "zustand";

export interface IAppSlice {
  isSidebarOpen: boolean;
  isMiniSidebar: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen: (value: boolean) => void;
  setMiniSidebar: (value: boolean) => void;
}

export const createAppSlice: StateCreator<IAppSlice> = (set) => ({
  isSidebarOpen: false,
  isMiniSidebar: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),
  toggleMiniSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setMiniSidebar: (value) => set({ isMiniSidebar: value }),
});
