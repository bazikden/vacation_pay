const User = require('../models/User')
const UserInfo = require('../models/UserInfo')
const SalaryInfo = require('../models/SalaryInfo')
const WorkedDaysInfo = require('../models/WorkedDays')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const postUserInfo = async (req, res) => {
    const { user, days, salary, vacationPay, dates, vacationDays } = req.body
    try {
        let info = await UserInfo.findOne({ "userId": user._id })
        if (!info) {
            info = await UserInfo.create({ userId: user._id })
        }
        const newSalaryItem = await SalaryInfo.create({
            ...salary,
            vacationPay,
            userInfoId: info._id,
            userId: info.userId
        })

        const dateFormat = 'YYYY-MM-DD'
        const newWorkedDaysItem = await WorkedDaysInfo.create({
            ...days,
            startDate: dates.start,
            endDate: dates.startVacation,
            vacationDays,
            vacationEndDate: dates.endVacation,
            userId: info.userId,
            userInfoId: info._id,
            salaryItemId: newSalaryItem._id
        })
        const newInfo = {
            ...info._doc,
            salaryInfoId: [...info.salaryInfoId, newSalaryItem._id],
            workedDaysId: [...info.workedDaysId, newWorkedDaysItem._id],
        }

        await UserInfo.findOneAndUpdate({ "_id": info._id }, { ...newInfo })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }


}

const getUsersInfo = async (req, res) => {
    const _id = req.query.id

    try {
        if (_id !== undefined) {
            const salary = await SalaryInfo.find({ userId: _id })
            const workedDays = await WorkedDaysInfo.find({ userId: _id })
            const data = {
                salary, days: workedDays
            }
            res.json(data)
        }

    } catch (error) {
        res.status(500).json({ error })
    }
}

const updateInfo = async (req, res) => {
    const { id } = req.params
    const { workedDaysId, salaryInfoId } = req.body

    try {
        await WorkedDaysInfo.findByIdAndDelete({ "_id": workedDaysId })
        await SalaryInfo.findByIdAndDelete({ "_id": salaryInfoId })
        let userInfo = await UserInfo.findOne({ "_id": id })
        userInfo.salaryInfoId = userInfo.salaryInfoId.filter(salaryInfo => salaryInfo != salaryInfoId)
        userInfo.workedDaysId = userInfo.workedDaysId.filter(workedDay => workedDay != workedDaysId)

        await UserInfo.findOneAndUpdate({ "_id": id }, { salaryInfoId: userInfo.salaryInfoId, workedDaysId: userInfo.workedDaysId })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error })
    }
}

const getUserInfo = async (req, res) => {
    try {
        const token = req.params.id
        const data = await jwt.verify(token, process.env.JWT_SECRET)
        const days = await WorkedDaysInfo.findOne({ _id: data.workedDaysId }).populate('salaryItemId').populate("userId")
        const { endDate, vacationEndDate, vacationDays, userId: { name, surname }, salaryItemId } = days
    
        const respData = {
            startVacation: endDate,
            endVacation: vacationEndDate,
            name,
            surname,
            vacationDays,
            pay: salaryItemId.vacationPay
        }
        res.json(respData)
        
    } catch (error) {
        res.status(500).json({error})
    }
}

const updateDate = async(req,res) => {
    const {id,date} = req.body
    try {
        await User.updateOne({_id:id},{dateOfHiring:date})
        res.json({success:true})    
    } catch (error) {
        res.status(500).json({error})
    }
}




module.exports = { postUserInfo, getUsersInfo, updateInfo, getUserInfo, updateDate }