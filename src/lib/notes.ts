import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Note = { id: string; iso: string; text: string; at: number };

type Store = {
  notes: Note[];
  tuoi: number | null;
  sinh: string | null;
  addNote: (iso: string, text: string) => void;
  removeNote: (id: string) => void;
  setTuoi: (tuoi: number) => void;
  setSinh: (sinh: string | null) => void;
  replaceAll: (notes: Note[], tuoi: number | null, sinh?: string | null) => void;
};

export const useLichStore = create<Store>()(
  persist(
    (set) => ({
      notes: [],
      tuoi: null,
      sinh: null,
      addNote: (iso, text) => {
        const clean = text.trim().slice(0, 500);
        if (!clean) return;
        set((s) => ({
          notes: [{ id: crypto.randomUUID(), iso, text: clean, at: Date.now() }, ...s.notes].slice(0, 300),
        }));
      },
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      setTuoi: (tuoi) => set({ tuoi }),
      setSinh: (sinh) => set({ sinh }),
      replaceAll: (notes, tuoi, sinh = null) => set({ notes: notes.slice(0, 300), tuoi, sinh }),
    }),
    {
      name: "lich-am-viet",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function parseBackup(raw: unknown): { notes: Note[]; tuoi: number | null; sinh: string | null } | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.notes)) return null;
  const notes: Note[] = [];
  for (const item of o.notes) {
    if (!item || typeof item !== "object") continue;
    const n = item as Record<string, unknown>;
    if (typeof n.iso !== "string" || typeof n.text !== "string") continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.iso)) continue;
    const text = n.text.trim().slice(0, 500);
    if (!text) continue;
    notes.push({
      id: typeof n.id === "string" ? n.id.slice(0, 80) : crypto.randomUUID(),
      iso: n.iso,
      text,
      at: typeof n.at === "number" ? n.at : Date.now(),
    });
  }
  const tuoi = typeof o.tuoi === "number" && o.tuoi >= 0 && o.tuoi <= 11 ? Math.floor(o.tuoi) : null;
  const sinh = typeof o.sinh === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.sinh) ? o.sinh : null;
  return { notes: notes.slice(0, 300), tuoi, sinh };
}
