const asyncHandler = require('../utils/asyncHandler')
const db = require('../config/db')

const createChallenge = asyncHandler(async (req, res) => {
    const { side, minutes, seconds } = req.body
    await db('challenges').insert({
        challenger_side: side,
        minutes,
        seconds,
    })
})

module.exports = {
    createChallenge,
}
