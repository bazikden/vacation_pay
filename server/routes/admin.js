const { login, signup,authenticate } = require('../controllers/admin')
const { auth } = require('../middleware/auth')


const router =  require('express').Router()

router
    .route('/').get(auth,authenticate)

router.route('/login').post(login)    
router.route('/signup').post(auth,signup)

module.exports = router