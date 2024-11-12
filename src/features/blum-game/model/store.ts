import {create} from "zustand";
import {IBlumGameStore, IFallingItem} from "./types.ts";
import {newBomb, newIce, newStar} from "../utils/helper.ts";

export const GAME_TIME = 60;
export const BOMBS_INTERVAL = 7;
export const ICES_INTERVAL = 12;
export const STARS_INTERVAL = 300;

const initialStore = {
    intervalsAndTimeouts: [],

    stars: [],
    bombs: [],
    ices: [],
    gameTime: GAME_TIME,
    gameScore: 0,
    bombSeconds: 0,
    isStarted: false,
    isGameOver: false,
} as IBlumGameStore;

export const useBlumGameStore = create<IBlumGameStore>((set, get) => ({
    ...initialStore,

    init: async () => {
    },

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

    onIceClick: async (id: string, event) => {
        const iceParent = event.currentTarget;
        const iceImg = iceParent.querySelector('img');

        if (iceImg.classList.contains('claimed')) return;

        const containerElem = document.querySelector('.falling-stars-container');
        containerElem.classList.add('iced-overlay');
        iceImg.classList.add('claimed');

        get().pauseGame();
        get().addTimeout(() => {
            get().resumeGame();
            containerElem.classList.remove('iced-overlay');
            set(state => ({ices: state.ices.filter(ice => ice.id !== id)}));
        }, 3000);
    },

    onBombClick: async (id: string, event) => {
        set({gameScore: 0});

        const bombParent = event.currentTarget;
        const bombImg = bombParent.querySelector('.bomb');

        if (bombImg.classList.contains('firing')) return;

        const explosion = bombParent.querySelector('.explosion');

        // Start the bomb firing animation
        bombImg.classList.add('firing');
        bombImg.style.display = 'none';

        explosion.classList.add('active');
        document.body.classList.add('shake');
        if (navigator.vibrate) {
            navigator.vibrate([200]);
        }

        // Remove the explosion effect after it completes
        get().addTimeout(() => {
            explosion.classList.remove('active');
            document.body.classList.remove('shake');
            set(state => ({bombs: state.bombs.filter(bomb => bomb.id !== id)}));
        }, 1000);
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
            isStarted: true
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
    },

    resumeGame: async () => {
        document.querySelectorAll('.star').forEach(star => star.classList.remove('paused'));
        get().prepareIntervals();
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
        const id = setTimeout(callback, delay);
        set(state => ({intervalsAndTimeouts: [...state.intervalsAndTimeouts, id]}));
    },

    addInterval: (callback, delay) => {
        const id = setInterval(callback, delay);
        set(state => ({intervalsAndTimeouts: [...state.intervalsAndTimeouts, id]}));
    },

    clearIntervalsAndTimeouts: () => {
        get().intervalsAndTimeouts.forEach(id => {
            clearInterval(id);
            clearTimeout(id);
        });
        set({intervalsAndTimeouts: []});
    }
}));
