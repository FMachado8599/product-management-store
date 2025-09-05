import { create } from "zustand";
type State = {
  q: string;
  estado?: string;
  prioridad?: string;
  tab: "nuevo" | "modificar";
};
type Actions = {
  setQ: (q: string) => void;
  setEstado: (e?: string) => void;
  setPrioridad: (p?: string) => void;
  setTab: (t: "nuevo" | "modificar") => void;
};
export const useFiltersStore = create<State & Actions>((set) => ({
  q: "",
  tab: "modificar",
  setQ: (q) => set({ q }),
  setEstado: (estado) => set({ estado }),
  setPrioridad: (prioridad) => set({ prioridad }),
  setTab: (tab) => set({ tab }),
}));
