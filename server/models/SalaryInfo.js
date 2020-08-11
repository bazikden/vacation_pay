const { Schema, model } = require('mongoose')

const SalaryInfoSchema = new Schema ({
    jan:Number,
    feb:Number,
    mar:Number,
    apr:Number,
    may:Number,
    jun:Number,
    jul:Number,
    aug:Number,
    sep:Number,
    oct:Number,
    nov:Number,
    dec:Number,
    year:Number,
    count:Number,
    vacationPay:Number,
    userInfoId:{
        type: Schema.Types.ObjectId,
        ref: 'UserInfo'
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = model('SalaryInfo',SalaryInfoSchema)


