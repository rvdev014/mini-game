export interface IFallingItem {
    id: string;
    position: number;
    duration: number;
    width: number;
}

export interface IBlumGameStore {
    intervalsAndTimeouts: number[];
    addInterval: (callback: () => void, delay: number) => void;
    addTimeout: (callback: () => void, delay: number) => void;
    clearIntervalsAndTimeouts: () => void;

    gameTime: number;
    gameScore: number;

    isStarted: boolean;
    isGameOver: boolean;
    isRunning: boolean;

    onStartGame: () => void;
    prepareIntervals: () => Promise<void>;
    finishGame: () => Promise<void>;
    pauseGame: () => Promise<void>;
    resumeGame: () => Promise<void>;
    reset: () => Promise<void>;
}
