const User = require('../models/User')
const WorkingDaysInfo = require('../models/WorkedDays')
const jwt = require('jsonwebtoken')

const sendMail = async (req, res) => {
    const { userId } = req.body
    const user = await User.findOne({ _id: userId })
    const token = await jwt.sign(req.body, process.env.JWT_SECRET)
    const re = /"/gi
    const link = process.env.BASE_URL.replace(re, "") + "/userinfo/" + token.toString()
    res.json({ link, user })

}

const sendMailStatus = async (req, res) => {
    try {
        const {status,id} = req.body
        await WorkingDaysInfo.updateOne({_id:id},{sent:status})
        res.json({success:true})
        
    } catch (error) {
        res.status(500).json({error})
    }
}

module.exports = { sendMail, sendMailStatus }
