const router = require('express').Router()
const authRoutes = require('./auth.route')
const gamesRoutes = require('./games.route')

router.use('/auth', authRoutes)
router.use('/games', gamesRoutes)

module.exports = router
