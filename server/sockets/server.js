const SocketSessionStorage = require('./socketSessions')
const socketManager = new SocketSessionStorage(process.env.SOCKET_TOKEN_SECRET)

const {
    getLiveChallenges,
    createChallenge,
    removeChallenge,
    acceptChallenge,
} = require('./events/challenge.events')
const { getGameInfo, opponentTimerStart } = require('./events/game.events')

module.exports = (io) => {
    const regular = io.of('/socket')
    const secure = io.of('/secure-socket')

    const socketServer = () => {
        regular.on('connection', (socket) => {
            socket.on(getLiveChallenges.event, (cb) =>
                getLiveChallenges.func(cb)
            )
        })
    }

    const secureSocketServer = () => {
        secure.use(socketManager.protect)

        secure.on('connection', (socket) => {
            socket.on('joined server', (user) => {
                socketManager.addSocket(socket.id, user.userInfo.user_id)
            })

            socket.on(createChallenge.event, (challenge) =>
                createChallenge.func(challenge, regular)
            )

            socket.on(removeChallenge.event, (challenge_id) =>
                removeChallenge.func(challenge_id, regular)
            )

            socket.on(acceptChallenge.event, (challenge) => {
                // bring 2 players to separate room
                acceptChallenge.func(challenge, socketManager, secure)
                // remove challenge for all other connected users
                regular.emit('challenge removed', challenge.challenge_id)
            })

            socket.on(getGameInfo.event, (gameId, cb) =>
                getGameInfo.func(gameId, cb)
            )

            socket.on(opponentTimerStart.event, (roomName) =>
                opponentTimerStart.func(roomName, socket)
            )

            socket.on('disconnect', () => {
                socketManager.removeSocket(socket.id)
            })
        })
    }

    socketServer()
    secureSocketServer()
}
