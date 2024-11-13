import {create} from "zustand";
import {IBlumGameStore, IFallingItem} from "./types.ts";
import {newBomb, newIce, newStar} from "../utils/helper.ts";

export const GAME_TIME = 60;
export const BOMBS_INTERVAL = 7;
export const ICES_INTERVAL = 12;
export const ICED_TIME = 4000;
export const STARS_INTERVAL = 300;

const initialStore = {
    intervalsAndTimeouts: [] as number[],

    stars: [] as IFallingItem[],
    bombs: [] as IFallingItem[],
    ices: [] as IFallingItem[],
    gameTime: GAME_TIME,
    gameScore: 0,
    isStarted: false,
    isGameOver: false,
} as IBlumGameStore;

export const useBlumGameStore = create<IBlumGameStore>((set, get) => ({
    ...initialStore,

    onStarClick: async (id: string, event) => {
        const starParent = event.currentTarget;
        const starImg = starParent.querySelector('img');

        if (starImg.classList.contains('claimed')) return;

        set(state => ({gameScore: state.gameScore + 1}));

        const plusOne = document.createElement('div');
        plusOne.classList.add('plus-one');
        plusOne.textContent = '+1';
        starParent.appendChild(plusOne);

        starImg.classList.add('claimed');

        get().addTimeout(() => {
            event.currentTarget?.remove();
            set(state => ({stars: state.stars.filter(star => star.id !== id)}));
        }, 300);
    },

    onBombClick: async (id: string, event) => {
        set({gameScore: 0});

        const bombParent = event.currentTarget;
        const bombImg = bombParent.querySelector('.bomb');

        if (bombImg.classList.contains('firing')) return;

        const explosion = bombParent.querySelector('.explosion');
        const containerElem = document.querySelector('.falling-stars-container');

        // Start the bomb firing animation
        bombImg.classList.add('firing');
        bombImg.style.display = 'none';

        explosion.classList.add('active');
        containerElem?.classList.add('shake');
        if (navigator.vibrate) {
            navigator.vibrate([200]);
        }

        // Remove the explosion effect after it completes
        get().addTimeout(() => {
            explosion.classList.remove('active');
            containerElem?.classList.remove('shake');
            set(state => ({bombs: state.bombs.filter(bomb => bomb.id !== id)}));
        }, 1000);
    },

    onIceClick: async (id: string, event) => {
        const iceParent = event.currentTarget;
        const iceImg = iceParent.querySelector('img');

        if (iceImg.classList.contains('claimed')) return;

        const containerElem = document.querySelector('.falling-stars-container');
        containerElem?.classList.add('iced-overlay');
        iceImg.classList.add('claimed');
        set(state => ({ices: state.ices.filter(ice => ice.id !== id)}));

        get().pauseGame();
        get().addTimeout(() => {
            get().resumeGame();
            containerElem?.classList.remove('iced-overlay');
        }, ICED_TIME);
    },

    prepareIntervals: async () => {
        if (!get().isStarted) return;

        get().addInterval(() => {
            set({gameTime: get().gameTime - 1});
            if (get().gameTime === 0) {
                get().finishGame();
                return;
            }

            if (get().gameTime % BOMBS_INTERVAL === 0) {
                get().appendBomb(newBomb());
            }

            if (get().gameTime % ICES_INTERVAL === 0) {
                get().appendIce(newIce());
            }
        }, 1000);

        get().addInterval(() => {
            get().appendStar(newStar());
        }, STARS_INTERVAL);
    },

    onStartGame: async () => {
        set({
            gameTime: GAME_TIME,
            gameScore: 0,
            isStarted: true,
            isGameOver: false,
            isRunning: true,
        });
        get().prepareIntervals();
    },

    appendStar: async (item: IFallingItem) => {
        set(state => ({
            stars: state.stars.length >= 15 ? [...state.stars.slice(1), item] : [...state.stars, item],
        }));
    },

    appendBomb: async (item: IFallingItem) => {
        set(state => ({
            bombs: state.bombs.length >= 3 ? [...state.bombs.slice(1), item] : [...state.bombs, item],
        }));
    },

    appendIce: async (item: IFallingItem) => {
        set(state => ({
            ices: state.ices.length >= 3 ? [...state.ices.slice(1), item] : [...state.ices, item],
        }));
    },

    pauseGame: async () => {
        document.querySelectorAll('.star').forEach(star => star.classList.add('paused'));
        get().clearIntervalsAndTimeouts();
        set({isRunning: false});
    },

    resumeGame: async () => {
        document.querySelectorAll('.star').forEach(star => star.classList.remove('paused'));
        get().prepareIntervals();
        set({isRunning: true});
    },

    finishGame: async () => {
        get().clearIntervalsAndTimeouts();
        set({
            stars: [],
            bombs: [],
            ices: [],
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
