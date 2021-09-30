import React, { useEffect } from 'react'
import useTimer from '../hooks/useTimer'
import { useSocket } from '../providers/SocketProvider'
import { useChess } from './ChessBoard'
import formatTime from '../utils/formatTime'
import '../styles/Timer.css'

const Timer = ({ tracker, id }) => {
    const { currentSide } = useChess()
    const { timeLeft, start, pause } = useTimer(tracker.time)
    const { secureSocket, currentRoom } = useSocket()

    useEffect(() => {
        if (secureSocket) {
            if (tracker.side === currentSide) {
                secureSocket.emit('opponent timer start', currentRoom)
                start()
            }

            secureSocket.on('opponent timer start', pause)

            return () => {
                secureSocket.off('opponent timer start', pause)
            }
        }
    }, [secureSocket])

    useEffect(() => {
        secureSocket.emit('tick', currentSide, (time) => {})
    }, [timeLeft])

    return (
        <div id={id} className='timer'>
            <span className='name'>{tracker.username}</span>
            {' : '}
            <span className='time'>{formatTime(timeLeft)}</span>
        </div>
    )
}

export default Timer
