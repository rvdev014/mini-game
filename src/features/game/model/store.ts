import {create} from "zustand";

interface IGameStore {
    init: () => void;
}

const initialStore = {} as IGameStore;

export const useGameStore = create<IGameStore>((set, get) => ({
    ...initialStore,

    init: async () => {

    }
});