const router = require('express').Router()
const user = require('../controllers/auth.controller')

const fields = ['user_id', 'username', 'email']

router.route('/logout').get(user.logout)
router.route('/refresh').get(user.fields(fields), user.refresh)
router.route('/login').post(user.fields(fields), user.login)
router.route('/register').post(user.register)

// TODO: remove this route when done
router.route('/test').get(user.protect, (req, res) => res.send('howdy'))

module.exports = router
