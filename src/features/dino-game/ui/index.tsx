import {useEffect, useRef} from 'react';
import './dino.css';
import {useDinoGameStore} from "../model/store.ts";
import {secondsToTimer} from "../../blum-game/utils/helper.ts";

export const DinoGame = () => {
    const containerElem = useRef<HTMLDivElement | null>(null);

    const isStarted = useDinoGameStore(state => state.isStarted);
    const isGameOver = useDinoGameStore(state => state.isGameOver);

    const gameTime = useDinoGameStore(state => state.gameTime);
    const gameScore = useDinoGameStore(state => state.gameScore);
    const onStartGame = useDinoGameStore(state => state.onStartGame);

    const resetGame = useDinoGameStore(state => state.reset);

    useEffect(() => {
        return () => {
            resetGame()
        }
    }, []);

    function onJump(e) {
        const dino = containerElem.current?.querySelector('.dino');
        if (dino?.classList.contains('jumping')) {
            return;
        }

        dino.style.backgroundImage = "url('/img/game/gj.png')";
        dino.classList.add('jumping');
        useDinoGameStore.getState().addTimeout(() => {
            dino.classList.remove('jumping');
        }, 1000);
    }

    return (
        <div className="dino-wrapper">
            <div className="dino-container" ref={containerElem} onClick={onJump}>

                <div className="score-board">
                    <span className="timer">{secondsToTimer(gameTime)}</span>
                    <div className="score"><span>{gameScore}</span></div>
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

                <div className="dino"></div>
                <div className="ground"></div>

            </div>
        </div>
    );
};
