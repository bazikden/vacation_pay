const Admin = require('../models/Admin')

const auth = async (req, res, next) => {
    const token = req.headers.authorization
    if (token !== undefined) {
        try {
            const user = await Admin.getUserByToken(token)
            delete user.password
            req.user = user
            next()
            
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(400).json({error:"Unathorized"})
    }
}

module.exports = { auth }