const { sendMail, sendMailStatus } = require('../controllers/sendmail')

const router = require('express').Router()

router
    .route('/')  
        .put(sendMailStatus)    
        .post(sendMail)


module.exports = router