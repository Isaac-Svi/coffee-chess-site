const { createChallenge } = require('../controllers/games.controller')

const router = require('express').Router()

router.route('/create-challenge').post(createChallenge)

module.exports = router
