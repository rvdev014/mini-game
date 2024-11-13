import {useEffect, useRef, useState} from 'react';
import './dino.css';
import {useDinoGameStore} from "../model/store.ts";
import {secondsToTimer} from "../../blum-game/utils/helper.ts";

const newCoin = { id: 'coin3', left: '600px', top: '200px' };
const newRock = () => ({
    id: Math.random().toString(36).substring(7),
    left: '300px',
    top: '500px'
});

export const DinoGame = () => {
    const containerElem = useRef<HTMLDivElement | null>(null);

    const isRunning = useDinoGameStore(state => state.isRunning);
    const isStarted = useDinoGameStore(state => state.isStarted);
    const isGameOver = useDinoGameStore(state => state.isGameOver);

    const gameTime = useDinoGameStore(state => state.gameTime);
    const gameScore = useDinoGameStore(state => state.gameScore);
    const onStartGame = useDinoGameStore(state => state.onStartGame);

    const resetGame = useDinoGameStore(state => state.reset);

    const observerRef = useRef<IntersectionObserver | null>(null); // To store the IntersectionObserver instance
    const characterRef = useRef(null); // Reference to the character element
    const [coins, setCoins] = useState([]); // State for coins
    const [obstacles, setObstacles] = useState([]); // State for obstacles

    // Initialize the observer once on game start
    const initializeObserver = () => {
        if (observerRef.current) return; // Don't initialize again if already initialized

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;

                    if (target.classList.contains('rock')) {
                        console.log('Collision with a rock!');
                        // Handle rock collision (e.g., end game, decrease life, etc.)
                    } else if (target.classList.contains('coin')) {
                        console.log('Coin collected!');
                        // Handle coin collection
                        setCoins((prevCoins) => prevCoins.filter(coin => coin.id !== target.id));
                    }
                }
            });
        }, {
            root: null, // Use the browser's viewport as the root
            threshold: 0.5 // 50% of the element should be in view to trigger intersection
        });
    };

    // Function to observe new elements
    const observeElements = (elements) => {
        elements.forEach(element => observerRef.current.observe(element));
    };

    // Add new coin or obstacle and observe them
    const addCoin = (coin) => {
        setCoins(prevCoins => [...prevCoins, coin]);
    };

    const addObstacle = (obstacle) => {
        setObstacles(prevObstacles => [...prevObstacles, obstacle]);
    };

    useEffect(() => {
        // Initialize the observer when the game starts
        initializeObserver();

        setInterval(() => {
            addObstacle(newRock());
        }, 1000);

        return () => {
            // Cleanup observer when component unmounts
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        // Observe newly added coins
        const coinElements = document.querySelectorAll('.coin');
        if (coinElements.length > 0) {
            observeElements(coinElements);
        }

        // Observe newly added rocks
        const rockElements = document.querySelectorAll('.rock');
        if (rockElements.length > 0) {
            observeElements(rockElements);
        }
    }, [coins, obstacles]); // Re-run this when coins or obstacles change

    function onJump(e) {
        if (!isRunning) return;

        const dino = containerElem.current?.querySelector('.dino')!;
        if (dino?.classList.contains('jumping')) {
            return;
        }

        dino.style.backgroundImage = "url('/img/game/gj.png')";
        dino.classList.add('jumping');
        // Remove the jump class after the animation ends
        dino.addEventListener('animationend', () => {
            dino.classList.remove('jumping');
        }, { once: true });
    }

    const pauseGame = async () => {
        if (useDinoGameStore.getState().isRunning) {
            await useDinoGameStore.getState().pauseGame();
        } else {
            await useDinoGameStore.getState().resumeGame();
        }
    }

    console.log('obstacles', obstacles)

    return (
        <div className="dino-wrapper">
            <div className="dino-container" ref={containerElem} onClick={onJump}>

                <div className="score-board">
                    <span className="timer">{secondsToTimer(gameTime)}</span>
                    <div className="score"><span>{gameScore}</span></div>
                    <button onClick={pauseGame}>Pause</button>
                </div>

                {!isStarted && (
                    <>
                        {isGameOver ? (
                            <div className="start-game">
                                <h1>Game over</h1>
                                <h2>Your score: {gameScore}</h2>
                                <button className="startBtn" onClick={onStartGame}>Restart game</button>
                            </div>
                        ) : (
                            <div className="start-game">
                                <h1>Dino Game</h1>
                                <button className="startBtn" onClick={onStartGame}>Start game</button>
                            </div>
                        )}
                    </>
                )}

                <div className="dino" data-type="animation" ref={characterRef}></div>

                <div className="ground-container">
                    <div className="ground" data-type="animation"></div>
                    <div className="ground" data-type="animation"></div>
                </div>

                {coins.map((coin) => (
                    <div
                        key={coin.id}
                        className="coin"
                    ></div>
                ))}

                {obstacles.map((obstacle) => (
                    <div
                        key={obstacle.id}
                        className="rock running"
                    >
                        <img src="/img/game/rock.png" alt="Rock"/>
                    </div>
                ))}

            </div>
        </div>
    );
};
