const jwt = require('jsonwebtoken')
const db = require('../config/db')

class SocketSessionStorage {
    constructor(secret) {
        this.sockets = new Map()
        this.rooms = new Map()
        this.secret = secret
    }

    protect = async (socket, next) => {
        // token can be stored in memory, so we don't need to worry too much about expiration or blacklisting
        let { token } = socket.handshake.auth
        let error

        try {
            token = jwt.verify(token, this.secret)
        } catch (err) {
            error = new Error(err)
            error.data = { content: 'Please retry later' }
            return next(error)
        }

        if (!token || !token.id) {
            error = new Error('Insufficient credentials')
            error.data = { content: 'Please retry later' }
            return next(error)
        }

        if (token.exp * 1000 < Date.now()) {
            error = new Error('Token expired')
            error.data = { content: 'Please retry later' }
            return next(new Error(error))
        }

        const [user] = await db('users').where({ user_id: token.id })

        if (!user) {
            error = new Error("User doesn't exist")
            error.data = { content: 'Please retry later' }
            return next(new Error(error))
        }

        next()
    }

    getUserSockets = (userId) => {
        for (const [uid, sockets] of this.sockets.entries()) {
            if (userId === uid) {
                return sockets
            }
        }
        return null
    }

    addSocket = (socketId, userId) => {
        if (!this.sockets.has(userId)) {
            this.sockets.set(userId, new Set([socketId]))
            return
        }

        // in case user has multiple tabs
        const socketSession = this.sockets.get(userId)
        socketSession.add(socketId)
    }

    removeSocket = (socketId) => {
        for (const [userId, socketSet] of this.sockets.entries()) {
            if (socketSet.has(socketId)) {
                socketSet.delete(socketId)
                if (!socketSet.size) {
                    this.sockets.delete(userId)
                }
                return
            }
        }
    }

    removeUser = (userId) => {
        if (this.sockets.has(userId)) {
            this.sockets.delete(userId)
        }
    }

    addRoom = (userId, roomName) => {
        if (!this.rooms.has(userId)) {
            return this.rooms.set(userId, new Set([roomName]))
        }
        this.rooms.get(userId).add(roomName)
    }
}

module.exports = SocketSessionStorage
