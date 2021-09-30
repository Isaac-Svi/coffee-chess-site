const {
    getChallenges,
    createChallenge,
    removeChallenge,
    acceptChallenge,
} = require('../controllers/challenge.controller')

module.exports = {
    getLiveChallenges: { event: 'get live challenges', func: getChallenges },
    createChallenge: { event: 'create challenge', func: createChallenge },
    removeChallenge: { event: 'remove challenge', func: removeChallenge },
    acceptChallenge: { event: 'accept challenge', func: acceptChallenge },
}
