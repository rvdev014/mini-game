import React, {useCallback, useEffect, useRef, useState} from 'react';
import './FallingStars.css'; // Your custom CSS for styling and animation

export const BlumGame = () => {
    const containerElem = useRef<HTMLElement>();

    const gameTime = useRef(0);
    const gameTimer = useRef(0);
    const interval = useRef(0);
    const bombInterval = useRef(0);

    const [score, setScore] = useState(0)
    const [running, setRunning] = useState(false)

    const [stars, setStars] = useState([]);
    const [bombs, setBombs] = useState([]);

    const starData = () =>  {
        return {
            id: Math.random().toString(36).substring(7),
            position: Math.random() * (85 - 10) + 10,
            duration: 6,
            width: Math.floor(Math.random() * (30 - 20 + 1)) + 20,
        }
    }

    const bombData = () => {
        return {
            id: Math.random().toString(36).substring(7),
            position: Math.random() * (85 - 10) + 10,
            duration: 6,
            width: 40,
        }
    }

    const onBomb = (id, e) => {
        setScore(0);

        const bomb = e.currentTarget;
        const bombImg = bomb.querySelector('.bomb');
        const explosion = bomb.querySelector('.explosion');

        // Start the bomb firing animation
        bombImg.classList.add('firing');

        bombImg.style.display = 'none'; // Hide the bomb
        explosion.classList.add('active'); // Show and animate the explosion

        // Remove the explosion effect after it completes
        setTimeout(() => {
            explosion.classList.remove('active');
        }, 1000);
    };

    const claimStar = (id) => {
        console.log('Claiming star', id);
        setStars(prevStars => prevStars.filter(star => star.id !== id));
        setScore(prev => prev + 1);
    };

    useEffect(() => {
        setBombs(prev => [...prev, bombData()]);
        setBombs(prev => [...prev, bombData()]);
        setBombs(prev => [...prev, bombData()]);
        setBombs(prev => [...prev, bombData()]);
    }, []);

    console.log('Bombs', bombs);

    useEffect(() => {
        if (!containerElem.current) return;

        if (!running) {
            setStars([]);
            setBombs([]);
            clearInterval(interval.current);
            clearInterval(gameTimer.current);

            containerElem.current?.addEventListener('click', () => setRunning(true), {once: true});
        } else {
            setScore(0);

            /*gameTimer.current = setInterval(() => {
                gameTime.current += 1;
                if (gameTime.current === 60) {
                    setRunning(false)
                    gameTime.current = 0;
                }
            }, 1000);

            interval.current = setInterval(() => {
                setStars(prev => [...prev, starData()]);
                if (bombInterval.current === 7) {
                    setBombs(prev => [...prev, bombData()]);
                    bombInterval.current = 0;
                } else {
                    bombInterval.current += 1;
                }
            }, Math.random() + (500 - 100) + 100);*/
        }
    }, [containerElem.current, running]);

    const getTime = (time) => {
        return time < 10 ? '0' + time : time;
    }

    return (
        <div className="falling-stars-container" ref={containerElem}>
            <div className="score-board">
                <span className="timer">{'00:' + (getTime(60 - gameTime.current))}</span>
                <div className="score"><span>{score}</span></div>
            </div>

            {stars.map(star => (
                <img
                    src="/img/game/star.png"
                    alt="Star"
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.position}%`,
                        animationDuration: `${star.duration}s`
                    }}
                    onTouchStart={() => claimStar(star.id)}
                    width={star.width}
                />
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
                    onTouchStart={(e) => onBomb(bomb.id, e)}
                >
                    <img
                        className="bomb"
                        src="/img/game/bomb.png"
                        alt="Star"
                    />
                    <div className="explosion"></div>
                </div>
            ))}

        </div>
    );
};
