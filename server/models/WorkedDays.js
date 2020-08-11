const { model, Schema } = require('mongoose')

const WorkedDaysInfoSchema = new Schema({
    jan: Number,
    feb: Number,
    mar: Number,
    apr: Number,
    may: Number,
    jun: Number,
    jul: Number,
    aug: Number,
    sep: Number,
    oct: Number,
    nov: Number,
    dec: Number,
    count: Number,
    startDate:String,
    endDate:String,
    vacationDays:String,
    vacationEndDate:String,
    userInfoId:{
        type: Schema.Types.ObjectId,
        ref: 'UserInfo'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    salaryItemId:{
        type:Schema.Types.ObjectId,
        ref: 'SalaryInfo'
    },
    sent:{
        type: Boolean,
        default: false
    }

})

module.exports = model('WorkedDaysInfo', WorkedDaysInfoSchema)