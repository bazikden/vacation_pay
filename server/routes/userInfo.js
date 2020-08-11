const router = require('express').Router()
const { auth } = require('../middleware/auth')
const { postUserInfo, getUsersInfo, updateInfo, getUserInfo, updateDate } = require('../controllers/userInfo')


router
    .route('/')
        .get(auth, getUsersInfo)
        .post(auth, postUserInfo)
        .put(auth,updateDate)

router
    .route('/:id')
        .get(getUserInfo)
        .put(auth, updateInfo)



module.exports = router