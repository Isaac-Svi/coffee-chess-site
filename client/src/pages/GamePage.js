import React from 'react'
import { ChessBoard, ChessBoardProvider } from '../components/ChessBoard'

const GamePage = ({ match: { params } }) => {
    return (
        <ChessBoardProvider gameId={params.gameId}>
            <ChessBoard />
        </ChessBoardProvider>
    )
}

export default GamePage
