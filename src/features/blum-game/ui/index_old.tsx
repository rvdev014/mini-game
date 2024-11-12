import {useEffect, useRef, useState} from 'react';
import './FallingStars.css'; // Your custom CSS for styling and animation

function random(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

export const BlumGameOld = () => {
    const containerElem = useRef<HTMLDivElement | null>(null);

    const gameTime = useRef(0);
    const gameTimer = useRef(0);
    const interval = useRef(0);
    const bombInterval = useRef(0);

    const [score, setScore] = useState(0)
    const [running, setRunning] = useState(false)

    const [stars, setStars] = useState([]);
    const [bombs, setBombs] = useState([]);

    const starData = () => {
        return {
            id: Math.random().toString(36).substring(7),
            position: Math.random() * (85 - 10) + 10,
            duration: random(4, 5),
            width: random(30, 40),
        }
    }

    const bombData = () => {
        return {
            id: Math.random().toString(36).substring(7),
            position: random(10, 85),
            duration: random(4, 6),
            width: random(40, 50),
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
        document.body.classList.add('shake');
        console.log('navigator.vibrate', navigator.vibrate)
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]); // Vibrate for 200ms, pause for 100ms, then vibrate again for 200ms
        }

        // Remove the explosion effect after it completes
        setTimeout(() => {
            explosion.classList.remove('active');
            document.body.classList.remove('shake');
        }, 1000);
    };

    const onClaim = (id, e) => {
        setScore(prev => prev + 1);

        const plusOne = document.createElement('div');
        plusOne.classList.add('plus-one');
        plusOne.textContent = '+1';

        // Append the +1 element to the star
        const star = e.currentTarget;
        const starImg = star.querySelector('img');
        star.appendChild(plusOne);

        starImg.classList.add('claimed');

        // Remove the +1 element after the animation ends
        setTimeout(() => {
            plusOne.remove();
            starImg.remove();
        }, 300); // Match the duration of the riseAndFade animation
    };

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

            gameTimer.current = setInterval(() => {
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
            }, Math.random() + (500 - 100) + 100);
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
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.position}%`,
                        animationDuration: `${star.duration}s`,
                        width: star.width
                    }}
                    onTouchStart={e => onClaim(star.id, e)}
                >
                    <img src="/img/game/star.png" alt="Star"/>
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
                    onTouchStart={e => onBomb(bomb.id, e)}
                >
                    <img className="bomb" src="/img/game/bomb.png" alt="Star"/>
                    <div className="explosion"></div>
                </div>
            ))}

        </div>
    );
};
