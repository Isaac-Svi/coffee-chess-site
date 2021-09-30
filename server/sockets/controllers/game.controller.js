const db = require('../../config/db')

const getGameInfo = async (gameId, cb) => {
    try {
        const [game] = await db('games').where({ game_id: Number(gameId) })
        cb(game)
    } catch (err) {
        console.log(err.message)
    }
}

const opponentTimerStart = (roomName, socket) => {
    socket.to(roomName).emit('opponent timer start')
}

module.exports = {
    getGameInfo,
    opponentTimerStart,
}
