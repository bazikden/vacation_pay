const { getHolidays, postHolidays } = require('../controllers/holidays')

const router = require('express').Router()

router
    .route('/')
        .get(getHolidays)
        .post(postHolidays)


module.exports = router