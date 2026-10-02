import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFilterStore = create(
    persist(
        (set) => ({
            selectedArea: null,
            setSelectedArea: (area) => set({ selectedArea: area }),

            selectedType: null,
            setSelectedType: (type) => set({ selectedType: type }),

            language: "KO",
            setLanguage: (language) => set({ language }),
        }),
        {
            name: "trippick-settings",
            partialize: (state) => ({
                language: state.language,
            }),
        }
    )
);