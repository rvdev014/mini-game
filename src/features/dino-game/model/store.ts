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
        set({
            isStarted: true,
            isGameOver: false,
            isRunning: true,
            gameTime: 0,
            gameScore: 0,
        });
        get().prepareIntervals();

        document.querySelectorAll('[data-type="animation"]')?.forEach(elem => elem.classList.add('running'));
    },

    prepareIntervals: async () => {

    },

    pauseGame: async () => {
        document.querySelectorAll('[data-type="animation"]').forEach(star => star.classList.remove('running'));
        get().clearIntervalsAndTimeouts();
        set({isRunning: false});
    },

    resumeGame: async () => {
        document.querySelectorAll('[data-type="animation"]').forEach(star => star.classList.add('running'));
        set({isRunning: true});
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
