const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:String,
    surname:String,
    dateOfHiring:String,
    email:String,
    userInfo:{
        type:Schema.Types.ObjectId,
        ref:'UserInfo'
    }
},{timestamps:true})


// UserSchema.pre('save',async function(next){
//     const user = this
//     console.log(user)
//     try {
//         const hash = await bcrypt.hash(user.password,10)
//         user.password = hash
//         next()
//     } catch (error) {
//        throw error
//        next() 
//     }
    

// })

module.exports = mongoose.model('User',UserSchema)