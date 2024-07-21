import create from 'zustand';
import { SearchCriteria } from '../types/SearchCriteria';

interface StoreState {
    filteredRows: SearchCriteria[];
    setFilteredRows: (rows: SearchCriteria[]) => void;
}

export const useStore = create<StoreState>((set) => ({
    filteredRows: [],
    setFilteredRows: (rows) => set({ filteredRows: rows }),
}));