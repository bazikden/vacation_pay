const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const AdminSchema = new Schema({
    email: String,
    password: String,
    isAdmin: Boolean,
    isSuperAdmin: Boolean
})

AdminSchema.pre('save', async function (next) {
    const user = this
    console.log("user", user)
    try {
        const hash = await bcrypt.hash(user.password, 10)
        console.log("hash", hash)
        user.password = hash
        next()
    } catch (error) {
        next()
    }

})

AdminSchema.methods.comparePasswords = async function (password) {
    console.log("hashed", this.password)
    try {
        return await bcrypt.compare(password, this.password)

    } catch (error) {
        throw error
    }

}

AdminSchema.methods.generateToken = async function () {
    const user = this
    delete user.password

    try {
        return await jwt.sign({ ...user }, process.env.JWT_SECRET)
        
    }catch(error){
        throw error

    }
}

AdminSchema.statics.getUserByToken = async function (token) {
    try {
        return await jwt.verify(token, process.env.JWT_SECRET)._doc
    } 

    catch (error) {
        throw error
    }
}


module.exports = model('Admin', AdminSchema)