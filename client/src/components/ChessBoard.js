import React, { useEffect, useState, useContext, createContext } from 'react'
import { useSocket } from '../providers/SocketProvider'
import { useAuth } from '../providers/AuthProvider'
import Timer from './Timer'
import Square from './Square'
import Piece from './chess/Piece'
import '../styles/ChessBoard.css'

const ChessBoardContext = createContext(null)

const useChess = () => {
    const context = useContext(ChessBoardContext)
    if (!context) throw new Error('Must be used in ChessBoardProvider')
    return context
}

const ChessBoardProvider = ({ children, gameId }) => {
    const { user } = useAuth()
    const { secureSocket } = useSocket()
    // array of valid moves for active piece
    const [validMoves, setValidMoves] = useState([])
    const [currentSide, setCurrentSide] = useState('W')
    const [currentPlayer, setCurrentPlayer] = useState('')
    const [tracker, setTracker] = useState({
        side: '',
        time: 0,
    })
    const [opponentTracker, setOpponentTracker] = useState({
        side: '',
        time: 0,
    })

    useEffect(() => {
        if (secureSocket && (!tracker.time || !opponentTracker.time)) {
            secureSocket.emit('get game info', Number(gameId), (game) => {
                console.log(game)
                let side =
                    user.userInfo.username === game.white_username ? 'W' : 'B'

                setTracker({
                    side,
                    time:
                        side === 'W'
                            ? game.white_time_left
                            : game.black_time_left,
                    username: user.userInfo.username,
                })

                side = side === 'B' ? 'W' : 'B'
                setOpponentTracker({
                    side,
                    time:
                        side === 'W'
                            ? game.white_time_left
                            : game.black_time_left,
                    username:
                        side === 'B'
                            ? game.black_username
                            : game.white_username,
                })

                setCurrentPlayer(game.white_username)
            })
        }
    }, [
        secureSocket,
        gameId,
        setOpponentTracker,
        setTracker,
        user.userInfo.username,
        tracker.time,
        opponentTracker.time,
    ])

    const value = {
        currentPlayer,
        validMoves,
        setValidMoves,
        currentSide,
        setCurrentSide,
        tracker,
        setTracker,
        opponentTracker,
        setOpponentTracker,
    }

    return (
        <ChessBoardContext.Provider value={value}>
            {children}
        </ChessBoardContext.Provider>
    )
}

const board = [
    [
        { type: 'rook', color: 'light' },
        { type: 'knight', color: 'light' },
        { type: 'bishop', color: 'light' },
        { type: 'queen', color: 'light' },
        { type: 'king', color: 'light' },
        { type: 'bishop', color: 'light' },
        { type: 'knight', color: 'light' },
        { type: 'rook', color: 'light' },
    ],
    [
        { type: 'pawn', color: 'light' },
        { type: 'pawn', color: 'light' },
        { type: 'pawn', color: 'light' },
        { type: 'pawn', color: 'light' },
        { type: 'pawn', color: 'light' },
        { type: 'pawn', color: 'light' },
        { type: 'pawn', color: 'light' },
        { type: 'pawn', color: 'light' },
    ],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    [
        { type: 'pawn', color: 'dark' },
        { type: 'pawn', color: 'dark' },
        { type: 'pawn', color: 'dark' },
        { type: 'pawn', color: 'dark' },
        { type: 'pawn', color: 'dark' },
        { type: 'pawn', color: 'dark' },
        { type: 'pawn', color: 'dark' },
        { type: 'pawn', color: 'dark' },
    ],
    [
        { type: 'rook', color: 'dark' },
        { type: 'knight', color: 'dark' },
        { type: 'bishop', color: 'dark' },
        { type: 'queen', color: 'dark' },
        { type: 'king', color: 'dark' },
        { type: 'bishop', color: 'dark' },
        { type: 'knight', color: 'dark' },
        { type: 'rook', color: 'dark' },
    ],
]

const ChessBoard = () => {
    const { tracker, opponentTracker } = useChess()
    let colMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    colMap = tracker.side === 'W' ? colMap : colMap.reverse()

    return (
        <div className='board-wrapper'>
            <div className='board'>
                {board.map((row, i) => {
                    return (
                        <div className='row' key={`row-${i}`}>
                            {row.map((piece, s) => {
                                const id = colMap[i] + (s + 1)
                                return (
                                    <Square key={id} _id={id}>
                                        <Piece
                                            type={piece.type}
                                            color={piece.color}
                                        />
                                    </Square>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <div className='timers'>
                <Timer id='timer1' tracker={tracker} />
                <Timer id='timer2' tracker={opponentTracker} />
            </div>
        </div>
    )
}

export default ChessBoard
export { ChessBoardProvider, useChess, ChessBoard }
