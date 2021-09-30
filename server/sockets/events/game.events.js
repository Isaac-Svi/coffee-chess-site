const {
    getGameInfo,
    opponentTimerStart,
} = require('../controllers/game.controller')

module.exports = {
    getGameInfo: { event: 'get game info', func: getGameInfo },
    opponentTimerStart: {
        event: 'opponent timer start',
        func: opponentTimerStart,
    },
}
