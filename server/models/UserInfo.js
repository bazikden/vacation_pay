const  {Schema,model} = require('mongoose')

const UserInfoSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    image:String,
    salaryInfoId:{
        type:[Schema.Types.ObjectId],
        ref:'SalaryInfo'
    },
    workedDaysId:{
        type:[Schema.Types.ObjectId],
        ref:'WorkedDays'
    }
})

module.exports = model('UserInfo',UserInfoSchema)