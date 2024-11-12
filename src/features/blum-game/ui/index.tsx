import {useEffect, useRef} from 'react';
import './FallingStars.css';
import {useBlumGameStore} from "../model/store.ts";
import {secondsToTimer} from "../utils/helper.ts"; // Your custom CSS for styling and animation

function random(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

export const BlumGame = () => {
    const containerElem = useRef<HTMLDivElement | null>(null);

    const isStarted = useBlumGameStore(state => state.isStarted);
    const isGameOver = useBlumGameStore(state => state.isGameOver);

    const ices = useBlumGameStore(state => state.ices);
    const stars = useBlumGameStore(state => state.stars);
    const bombs = useBlumGameStore(state => state.bombs);

    const gameTime = useBlumGameStore(state => state.gameTime);
    const gameScore = useBlumGameStore(state => state.gameScore);
    const onStartGame = useBlumGameStore(state => state.onStartGame);

    const onIceClick = useBlumGameStore(state => state.onIceClick);
    const onStarClick = useBlumGameStore(state => state.onStarClick);
    const onBombClick = useBlumGameStore(state => state.onBombClick);

    const resetGame = useBlumGameStore(state => state.reset);

    useEffect(() => {
        return () => {
            resetGame()
        }
    }, []);

    return (
        <div className="falling-stars-container" ref={containerElem}>
            <div className="iced-overlay"/>

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
                            <h1>Blum Game</h1>
                            <button className="startBtn" onClick={onStartGame}>Start game</button>
                        </div>
                    )}
                </>
            )}

            {stars.map(star => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.position}%`,
                        animationDuration: `${star.duration}s`,
                        width: star.width
                    }}
                    onTouchStart={e => onStarClick(star.id, e)}
                >
                    <img src="/img/game/star.png" alt="Star"/>
                </div>
            ))}

            {ices.map(ice => (
                <div
                    key={ice.id}
                    className="star"
                    style={{
                        left: `${ice.position}%`,
                        animationDuration: `${ice.duration}s`,
                        width: ice.width
                    }}
                    onTouchStart={e => onIceClick(ice.id, e)}
                >
                    <img src="/img/game/ice.png" alt="Ice"/>
                </div>
            ))}

            {bombs.map(bomb => (
                <div
                    key={bomb.id}
                    className="star"
                    style={{
                        left: `${bomb.position}%`,
                        animationDuration: `${bomb.duration}s`,
                        width: bomb.width
                    }}
                    onTouchStart={e => onBombClick(bomb.id, e)}
                >
                    <img className="bomb" src="/img/game/bomb.png" alt="Star"/>
                    <div className="explosion"></div>
                </div>
            ))}

        </div>
    );
};
