import React, { useState, useEffect } from 'react'
import Chain from 'anilink'
import { useAuth } from '../providers/AuthProvider'
import GameConfigModal from './GameConfigModal'
import Loader from './Loader'
import { useHistory } from 'react-router-dom'
import { useSocket } from '../providers/SocketProvider'
import '../styles/GameLobby.css'

const fadeUp = {
    transform: 'translateY(0)',
    opacity: 1,
}

const GameLobby = ({ name }) => {
    const history = useHistory()
    const { socket, secureSocket } = useSocket()
    const { user, loading } = useAuth()
    const [challenges, setChallenges] = useState([])
    const [openModal, setOpenModal] = useState(false)

    const filterChallenges = (challenge_id) => {
        setChallenges((x) => x.filter((c) => c.challenge_id !== challenge_id))
    }

    const addChallenge = (challenge) => {
        setChallenges((x) => [...x, challenge])
        setOpenModal(false)
    }

    const removeChallenge = (challenge_id) =>
        secureSocket.emit('remove challenge', challenge_id)

    const acceptChallenge = (challenge) => {
        challenge.accepter_username = user.userInfo.username
        secureSocket.emit('accept challenge', challenge)
    }

    useEffect(() => {
        const animation = new Chain()
        animation
            .cb(() => {
                if (user.socketToken) {
                    animation.animate('.lobby-header', fadeUp, 300)
                }
                animation.animate('.game-lobby', fadeUp, 600)
            })
            .exec()
    }, [name, user.socketToken])

    useEffect(() => {
        socket.emit('get live challenges', (challenges) => {
            console.log(challenges)
            setChallenges(challenges)
        })

        socket.on('challenge removed', filterChallenges)
        socket.on('challenge created', addChallenge)

        return () => {
            socket.off('challenge removed', filterChallenges)
            socket.off('challenge created', addChallenge)
        }
    }, [socket, secureSocket])

    useEffect(() => {
        const handleChallengeAccepted = (gameId) => {
            history.push(`/game/${gameId}`)
        }

        if (secureSocket) {
            secureSocket.on('challenge accepted', handleChallengeAccepted)

            return () => {
                secureSocket.off('challenge accepted', handleChallengeAccepted)
            }
        }
    }, [secureSocket, history])

    return (
        <div id={name}>
            {openModal && <GameConfigModal close={() => setOpenModal(false)} />}
            {loading ? (
                <Loader />
            ) : (
                user.socketToken && (
                    <div className='lobby-header'>
                        <h1>Click on a game or start one!</h1>
                        <button
                            className='display-btn active'
                            onClick={() => setOpenModal(true)}
                        >
                            Create game
                        </button>
                    </div>
                )
            )}
            <div className='game-lobby'>
                {!challenges.length ? (
                    <div
                        style={{
                            minHeight: '400px',
                            display: 'grid',
                            placeItems: 'center',
                            color: 'black',
                        }}
                    >
                        No challenges yet
                    </div>
                ) : (
                    challenges.map((challenge) => {
                        const {
                            challenge_id,
                            challenger_username,
                            minutes,
                            seconds,
                            challenger_side,
                        } = challenge
                        return (
                            <div
                                key={`challenge-${challenge_id}`}
                                id={`challenge-${challenge_id}`}
                                className='challenge'
                            >
                                <div>{challenger_username}</div>
                                <div>
                                    {minutes}:{seconds}
                                </div>
                                <div>
                                    {challenger_side === 'w'
                                        ? 'Black'
                                        : 'White'}
                                </div>
                                {!user.socketToken ? null : user.userInfo
                                      .username === challenger_username ? (
                                    <button
                                        title='Withdraw challenge'
                                        onClick={() =>
                                            removeChallenge(challenge_id)
                                        }
                                    >
                                        <i className='fas fa-trash'></i>
                                    </button>
                                ) : (
                                    <button
                                        title='Accept challenge'
                                        onClick={() =>
                                            acceptChallenge(challenge)
                                        }
                                    >
                                        <i className='fas fa-check'></i>
                                    </button>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default GameLobby
