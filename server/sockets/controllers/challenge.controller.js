const db = require('../../config/db')
const { randomEl } = require('../../utils/random')

const getChallenges = async (cb) => {
    try {
        const challenges = await db('challenges')

        cb(challenges)
    } catch (err) {
        console.log(err.message)
    }
}

const createChallenge = async (challenge, io) => {
    try {
        challenge.challenger_side =
            challenge.challenger_side === 'white'
                ? 'W'
                : challenge.challenger_side === 'black'
                ? 'B'
                : randomEl(['W', 'B'])
        challenge.accepter_side = challenge.challenger_side === 'W' ? 'B' : 'W'

        const [newChallenge] = await db('challenges')
            .insert(challenge)
            .returning('*')

        io.emit('challenge created', newChallenge)
    } catch (err) {
        console.log(err.message)
    }
}

const removeChallenge = async (challenge_id, io) => {
    try {
        await db('challenges').del().where({ challenge_id })

        io.emit('challenge removed', challenge_id)
    } catch (err) {
        console.log(err.message)
    }
}

const acceptChallenge = async (challenge, socketManager, io) => {
    const {
        challenge_id,
        challenger_username,
        accepter_username,
        challenger_side,
        minutes,
        seconds,
    } = challenge

    try {
        const gameFields = {}
        if (challenger_side === 'W') {
            gameFields.white_username = challenger_username
            gameFields.black_username = accepter_username
        } else {
            gameFields.black_username = challenger_username
            gameFields.white_username = accepter_username
        }

        // find id of challenger, delete challenge, create new game
        const [{ value: u1 }, { value: u2 }, , { value: game }] =
            await Promise.allSettled([
                db('users')
                    .select('user_id')
                    .where({ username: challenger_username }),
                db('users')
                    .select('user_id')
                    .where({ username: accepter_username }),
                db('challenges').del().where({ challenge_id }),
                db('games')
                    .insert({
                        ...gameFields,
                        minutes,
                        seconds,
                        white_time_left: minutes * 60 + seconds,
                        black_time_left: minutes * 60 + seconds,
                    })
                    .returning('*'),
            ])

        // make both users join game room
        const gameRoom = `game-${game[0].game_id}`

        // store room in room storage for challenger and accepter
        socketManager.addRoom(u1[0].user_id, gameRoom)
        socketManager.addRoom(u2[0].user_id, gameRoom)

        // join all sockets of the challenger and accepter to new room
        const challengerSockIds = [
            ...socketManager.getUserSockets(u1[0].user_id),
        ]
        const accepterSockIds = [...socketManager.getUserSockets(u2[0].user_id)]

        challengerSockIds
            .map((socketId) => io.sockets.get(socketId))
            .forEach((socket) => {
                socket.join(gameRoom)
            })
        accepterSockIds
            .map((socketId) => io.sockets.get(socketId))
            .forEach((socket) => {
                socket.join(gameRoom)
            })

        // send room name to clients, so clients will be able to send events to this room
        io.to(gameRoom).emit('challenge accepted', game[0].game_id)
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    getChallenges,
    createChallenge,
    removeChallenge,
    acceptChallenge,
}
