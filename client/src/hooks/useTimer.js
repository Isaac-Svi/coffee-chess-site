import { useState } from 'react'

const useTimer = (initTime) => {
    if (!initTime && typeof initTime !== 'number')
        throw new Error('No initial time given to timer')

    const [intervalId, setIntervalId] = useState()
    const [timeLeft, setTimeLeft] = useState(initTime)

    const start = () => {
        const newId = setInterval(() => {
            setTimeLeft((x) => {
                if (--x <= 0) {
                    clearInterval(newId)
                    return 0
                }
                return x
            })
        }, 1000)
        setIntervalId(newId)
    }

    // doens't restart the timer
    const pause = () => {
        clearInterval(intervalId)
    }

    const restart = () => {
        setTimeLeft(initTime)
    }

    // also resets time
    const stop = () => {
        clearInterval(intervalId)
        setTimeLeft(initTime)
    }
    return {
        timeLeft,
        setTimeLeft,
        start,
        pause,
        restart,
        stop,
    }
}

export default useTimer
