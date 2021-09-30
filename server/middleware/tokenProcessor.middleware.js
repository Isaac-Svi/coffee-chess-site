const jwt = require('jsonwebtoken')
const cookie = require('cookie')

class TokenProcessor {
    constructor({ accessToken, refreshToken, socketToken }) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.socketToken = socketToken

        return (req, res, next) => {
            this.req = req
            this.res = res

            req.tokens = this
            next()
        }
    }
    /**
     * @description Generates access token to send to client
     * @param {*} payload
     * @returns Access token
     */
    createAccessToken = (payload) => {
        const { secret, exp } = this.accessToken
        return jwt.sign(
            { ...payload, exp: Math.floor(Date.now() / 1000) + exp },
            secret
        )
    }
    /**
     * @description Generates access token to send to client
     * @param {*} payload
     * @returns Access token for socket.io
     */
    createSocketToken = (payload) => {
        const { secret, exp } = this.socketToken
        return jwt.sign(
            { ...payload, exp: Math.floor(Date.now() / 1000) + exp },
            secret
        )
    }
    /**
     * @description Generates new refresh token
     * @param {*} payload
     * @returns Refresh token
     */
    createRefreshToken = (payload) => {
        const { secret, exp } = this.refreshToken
        return jwt.sign(
            { ...payload, exp: Math.floor(Date.now() / 1000) + exp },
            secret
        )
    }
    /**
     * @description Sends refresh token as cookie. By not providing token to cookie, we're basically deleting it (logging out)
     * @param {*} token
     */
    sendRefreshToken = (token) => {
        const { cookieName, path, exp } = this.refreshToken
        this.res.setHeader(
            'Set-Cookie',
            cookie.serialize(cookieName, token, {
                path,
                httpOnly: true,
                expires: new Date(Date.now() + (!token ? 1 : exp * 1000)),
            })
        )
    }
}

module.exports = TokenProcessor
