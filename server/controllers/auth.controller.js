const jwt = require('jsonwebtoken')
const db = require('../config/db')
const bcrypt = require('bcryptjs')
const asyncHandler = require('../utils/asyncHandler')

const fields = (desiredFields) => (_, res, next) => {
    res.locals.fields = desiredFields
    next()
}

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    const [user] = await db('users').where({ username }).orWhere({ email })

    if (user) {
        if (user.username === username)
            throw new Error(`User ${username} already exists.`)
        if (user.email === email)
            throw new Error(`Email ${email} already exists.`)
    }

    const hash = await bcrypt.hash(password, 10)

    await db('users').insert({
        username,
        email,
        password: hash,
    })

    res.status(201).json({ ok: 1, message: 'User inserted successfully' })
})

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const {
        createAccessToken,
        createRefreshToken,
        sendRefreshToken,
        createSocketToken,
    } = req.tokens

    const [user] = await db('users').where({ username })

    if (!user) {
        res.status(404)
        throw new Error("User doesn't exist")
    }

    if (!(await bcrypt.compare(password, user.password))) {
        res.status(401)
        throw new Error('Invalid credentials')
    }

    sendRefreshToken(
        createRefreshToken({
            id: user.user_id,
            email: user.email,
            tokenVersion: user.token_version,
        })
    )

    const userInfo = {}
    const fields = res.locals.fields ?? ['email']
    fields.forEach((field) => {
        userInfo[field] = user[field]
    })

    res.status(200).json({
        userInfo,
        accessToken: createAccessToken({
            id: user.user_id,
            username: user.username,
        }),
        socketToken: createSocketToken({
            id: user.user_id,
            username: user.username,
        }),
    })
})

const refresh = asyncHandler(async (req, res) => {
    const { cookieName, secret } = req.tokens.refreshToken
    const {
        createRefreshToken,
        createAccessToken,
        sendRefreshToken,
        createSocketToken,
    } = req.tokens

    if (!req.headers || !req.headers.cookie) {
        res.status(401)
        throw new Error('No token')
    }

    const cookies = req.headers.cookie
        .split('; ')
        .map((cookie) => Object.fromEntries([cookie.split('=')]))

    const token = cookies.find((cookie) => cookieName in cookie)[cookieName]

    // check if token exists
    if (!token) {
        return res.json({
            ok: 0,
            error: 'no cookie',
            userInfo: {},
            accessToken: '',
            socketToken: '',
        })
    }

    // check if token can be verified
    let payload = null
    try {
        payload = jwt.verify(token, secret)
    } catch (err) {
        console.log(err.message)
        return res.json({
            ok: 0,
            accessToken: '',
            socketToken: '',
            userInfo: {},
            error: err.message,
        })
    }

    const [user] = await db('users').where({ user_id: payload.id })

    // check if user referred to in token still exists
    if (!user)
        return res.json({
            ok: 0,
            accessToken: '',
            socketToken: '',
            userInfo: {},
            error: 'no user',
        })

    // check if token version of found user matches version in token
    if (user.token_version !== payload.tokenVersion)
        return res.json({
            ok: 0,
            socketToken: '',
            accessToken: '',
            userInfo: {},
            error: 'invalid token',
        })

    // if it does, first we update token version of user that refreshed
    const [updatedUser] = await db('users')
        .where({ user_id: user.user_id })
        .update({ token_version: user.token_version + 1 })
        .returning('*')

    // then we generate and set new refresh token
    sendRefreshToken(
        createRefreshToken({
            id: updatedUser.user_id,
            email: updatedUser.email,
            tokenVersion: updatedUser.token_version,
        })
    )

    // set fields for userInfo
    const userInfo = {}
    const fields = res.locals.fields ?? ['email']
    fields.forEach((field) => (userInfo[field] = updatedUser[field]))

    // and send new accessToken
    return res.json({
        ok: 1,
        userInfo,
        accessToken: createAccessToken({
            id: updatedUser.user_id,
            email: updatedUser.email,
        }),
        socketToken: createSocketToken({
            id: updatedUser.user_id,
            username: updatedUser.username,
        }),
    })
})

const protect = asyncHandler(async (req, res, next) => {
    if (!(req.headers && req.headers.authorization)) {
        res.status(401)
        throw new Error('Insufficient credentials')
    }

    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
        res.status(401)
        throw new Error('No token')
    }

    try {
        token = jwt.verify(token, req.tokens.accessToken.secret)
    } catch (err) {
        res.status(401)
        throw new Error(err)
    }

    if (!token || !token.id) {
        res.status(401)
        throw new Error('Insufficient credentials')
    }

    if (token.exp * 1000 < Date.now()) {
        res.status(401)
        throw new Error('Token expired')
    }

    const [user] = await db('users').where({ user_id: token.id })

    if (!user) {
        res.status(401)
        throw new Error("User doesn't exist")
    }

    next()
})

const logout = (req, res) => {
    req.tokens.sendRefreshToken()
    res.status(200).json('User logged out successfully')
}

module.exports = {
    fields,
    register,
    login,
    refresh,
    protect,
    logout,
}
