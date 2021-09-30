require('dotenv').config()
const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)
const { PORT, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SOCKET_TOKEN_SECRET } =
    process.env

const TokenProcessor = require('./middleware/tokenProcessor.middleware')
const tokenProcessor = new TokenProcessor({
    accessToken: {
        secret: ACCESS_TOKEN_SECRET,
        exp: 10, // 10 seconds
        // exp: 60, // 60 seconds
    },
    refreshToken: {
        secret: REFRESH_TOKEN_SECRET,
        exp: 60 * 60 * 24, // 1 day
        cookieName: 'chess-refresh',
        path: '/api/auth/refresh',
    },
    socketToken: {
        secret: SOCKET_TOKEN_SECRET,
        exp: 60 * 60 * 24, // 1 day
    },
})

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(tokenProcessor)

// routes
app.use('/api', require('./routes'))

// socket server
const setupSocketServers = require('./sockets/server')
const { Server } = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    },
})
setupSocketServers(io)

// error handlers
const {
    notFound,
    errorHandler,
} = require('./middleware/errorHandler.middleware')
app.use(notFound)
app.use(errorHandler)

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
