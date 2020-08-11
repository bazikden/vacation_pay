const router = require('express').Router()
const { auth } = require('../middleware/auth')
const { getAllUsers, postUser, deleteUser } = require('../controllers/users')

router
    .route('/').get(auth,getAllUsers).post(auth, postUser)
router
    .route('/:id').delete(auth, deleteUser)

module.exports = router