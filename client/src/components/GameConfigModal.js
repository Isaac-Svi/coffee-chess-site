import React, { useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import DropDownModal from './DropDownModal'
import Loader from './Loader'
import '../styles/GameConfigModal.css'
import { useSocket } from '../providers/SocketProvider'

const GameConfigModal = ({ close }) => {
    const { secureSocket } = useSocket()
    const { user, loading } = useAuth()
    const [side, setSide] = useState('random')
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault()

        const challenge = {
            challenger_side: side,
            challenger_username: user.userInfo.username,
            minutes,
            seconds,
        }

        secureSocket.emit('create challenge', challenge)
    }

    return (
        <DropDownModal close={close}>
            {loading ? (
                <Loader />
            ) : (
                <form onSubmit={handleSubmit} className='game-config-form'>
                    <div className='input-group'>
                        <small>Side: </small>
                        <select
                            onChange={(e) => setSide(e.target.value)}
                            value={side}
                        >
                            <option value='random'>random</option>
                            <option value='white'>white</option>
                            <option value='black'>black</option>
                        </select>
                    </div>
                    <div className='input-group'>
                        <small>Minutes: </small>
                        <input
                            type='number'
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            min={0}
                            max={120}
                        />
                    </div>
                    <div className='input-group'>
                        <small>Seconds: </small>
                        <input
                            type='number'
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value)}
                            min={0}
                            max={59}
                        />
                    </div>
                    <button className='simple-btn'>Create challenge</button>
                </form>
            )}
        </DropDownModal>
    )
}

export default GameConfigModal
