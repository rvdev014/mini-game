import {IFallingItem} from "../model/types.ts";

export function newStar(): IFallingItem {
    return {
        id: Math.random().toString(36).substring(7),
        position: Math.random() * (85 - 10) + 10,
        duration: random(5, 6),
        width: random(40, 50),
    };
}

export function newBomb(): IFallingItem {
    return {
        id: Math.random().toString(36).substring(7),
        position: random(10, 85),
        duration: random(2, 3),
        width: random(40, 50),
    };
}

export function newIce(): IFallingItem {
    return {
        id: Math.random().toString(36).substring(7),
        position: random(10, 85),
        duration: random(2, 3),
        width: random(40, 50),
    };
}

export function secondsToTimer(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${twoDigitTime(minutes)}:${twoDigitTime(remainingSeconds)}`;
}

function twoDigitTime(time: number) {
    return time < 10 ? `0${time}` : time;
}

export function random(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}
