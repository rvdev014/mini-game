import {create} from "zustand";
import {IBlumGameStore} from "./types.ts";

export const DINO_GAME_TIME = 60;

const initialStore = {
    intervalsAndTimeouts: [] as number[],

    gameTime: DINO_GAME_TIME,
    gameScore: 0,
    isStarted: false,
    isGameOver: false,
} as IBlumGameStore;

export const useDinoGameStore = create<IBlumGameStore>((set, get) => ({
    ...initialStore,

    onStartGame: async () => {

    },

    pauseGame: async () => {
        document.querySelectorAll('.star').forEach(star => star.classList.add('paused'));
        get().clearIntervalsAndTimeouts();
    },

    resumeGame: async () => {
        document.querySelectorAll('.star').forEach(star => star.classList.remove('paused'));
    },

    finishGame: async () => {
        get().clearIntervalsAndTimeouts();
        set({
            isStarted: false,
            isGameOver: true,
        })
    },

    reset: async () => {
        get().finishGame();
        set(initialStore)
    },

    addTimeout: (callback, delay) => {
        set(state => ({
            intervalsAndTimeouts: [...state.intervalsAndTimeouts, setTimeout(callback, delay)]
        }));
    },

    addInterval: (callback, delay) => {
        set(state => ({
            intervalsAndTimeouts: [...state.intervalsAndTimeouts, setInterval(callback, delay)]
        }));
    },

    clearIntervalsAndTimeouts: () => {
        get().intervalsAndTimeouts.forEach(id => {
            clearInterval(id);
            clearTimeout(id);
        });
        set({intervalsAndTimeouts: []});
    }
}));
