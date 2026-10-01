import { create } from "zustand";

export const useFilterStore = create((set) => ({
    selectedArea: null,
    setSelectedArea: (area) => set({selectedArea: area}),
    
    selectedType: null,
    setSelectedType: (type) => set({selectedType: type}),
}));