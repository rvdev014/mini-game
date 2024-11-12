import {useEffect, useRef} from "react";
import styles from './styles.module.scss';
import {getCustomProperty, incrementCustomProperty, setCustomProperty} from "../utils/helper.ts";

const SPEED = 0.05;
const SPEED_SCALE = 2;
const ROCK_INTERVAL = 1200;
const JUMP_SPEED = 0.5;
const GRAVITY = 0.0015;

const PLAYER_RUN_INTERVAL = 300;

const PLAYER_INITIAL_BOTTOM = 2;

export const Game = () => {

    const worldRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const groundRef_1 = useRef<HTMLDivElement>(null);
    const groundRef_2 = useRef<HTMLDivElement>(null);

    const lastTime = useRef(0);
    const yVelocity = useRef(JUMP_SPEED);
    const isJumping = useRef(false);
    const rockInterval = useRef(ROCK_INTERVAL);
    const playerRunInterval = useRef(PLAYER_RUN_INTERVAL);

    const animationFrameId = useRef<number>();

    function moveRock(delta: number) {
        const rocks = worldRef.current?.querySelectorAll(`.${styles.rock}`);
        rocks?.forEach(rock => {
            incrementCustomProperty(rock, '--left', delta * SPEED * SPEED_SCALE * -1);
        });

        if (rockInterval.current <= 0) {
            const rock = document.createElement('div');
            rock.classList.add(styles.rock);
            rock.innerHTML = '<img src="/img/game/rock.png" alt="rock"/>';

            const rockTop = Math.random() * 100;
            setCustomProperty(rock, '--top', rockTop);
            setCustomProperty(rock, '--left', 100);

            worldRef.current?.appendChild(rock);

            rockInterval.current = ROCK_INTERVAL;
        }

        rockInterval.current -= delta;
    }

    function moveGround(delta: number) {
        const grounds = worldRef.current?.querySelectorAll(`.${styles.ground}`);
        grounds?.forEach(ground => {
            incrementCustomProperty(ground, "--left", delta * SPEED * SPEED_SCALE * -1);
            if (getCustomProperty(ground, "--left") <= -300) {
                incrementCustomProperty(ground, "--left", 600);
            }
        });
    }

    function playerRun(delta: number) {
        const player = playerRef.current;
        const playerImage = player.querySelector('img');

        if (isJumping.current) {
            playerImage.src = '/img/game/gj.png';
            return;
        }

        if (playerRunInterval.current <= 0) {
            if (playerImage?.src?.includes('gw_1')) {
                playerImage.src = '/img/game/gw_2.png';
            } else {
                playerImage.src = '/img/game/gw_1.png';
            }
            playerRunInterval.current = PLAYER_RUN_INTERVAL;
        }

        playerRunInterval.current -= delta;
    }

    function playerHandleJump(delta: number) {
        const player = playerRef.current;
        const playerImage = player?.querySelector('img');

        if (!isJumping.current) return;

        incrementCustomProperty(player, '--bottom', yVelocity.current * 3);
        if (getCustomProperty(player, '--bottom') <= PLAYER_INITIAL_BOTTOM) {
            setCustomProperty(player, '--bottom', PLAYER_INITIAL_BOTTOM);
            isJumping.current = false;

            playerImage.src = '/img/game/gw_1.png';
        }

        yVelocity.current -= GRAVITY * delta;
    }

    function playerOnJump() {
        if (isJumping.current) return;
        isJumping.current = true;
        yVelocity.current = JUMP_SPEED;
    }

    function gameLoop(time: number) {
        const delta = time - lastTime.current;
        lastTime.current = time;

        playerRun(delta);
        playerHandleJump(delta);

        moveGround(delta);
        moveRock(delta);

        animationFrameId.current = requestAnimationFrame(gameLoop);
    }

    useEffect(() => {
        if (!worldRef.current) {
            return;
        }

        console.log('Game mounted');
        animationFrameId.current = requestAnimationFrame(gameLoop);

        worldRef.current.addEventListener('touchend', playerOnJump);

        return () => {
            console.log('Game unmounted');
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [worldRef]);



    return (
        <div className={styles.wrapper}>

            <main className={styles.world} ref={worldRef}>

                <div className={styles.player} ref={playerRef}>
                    <img src="/img/game/gw_1.png" alt="gw1"/>
                </div>

                <div className={styles.rock}>
                    <img src="/img/game/rock.png" alt="rock"/>
                </div>

                <div className={styles.ground} ref={groundRef_1}/>
                <div className={`${styles.ground} ${styles.ground2}`} ref={groundRef_2}/>
            </main>

        </div>
    );
};