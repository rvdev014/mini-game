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

    gameScore: number;
    gameTime: number;

    stars: IFallingItem[];
    appendStar: (item: IFallingItem) => void;

    bombs: IFallingItem[];
    appendBomb: (item: IFallingItem) => void;

    ices: IFallingItem[];
    appendIce: (item: IFallingItem) => void;

    isStarted: boolean;
    isRunning: boolean;
    isGameOver: boolean;

    onIceClick: (id: string, event: any) => void;
    onStarClick: (id: string, event: any) => void;
    onBombClick: (id: string, event: any) => void;

    onStartGame: () => Promise<void>;
    prepareIntervals: () => Promise<void>;
    clearIntervals: () => Promise<void>;
    finishGame: () => Promise<void>;
    pauseGame: () => Promise<void>;
    resumeGame: () => Promise<void>;
    reset: () => Promise<void>;
}
