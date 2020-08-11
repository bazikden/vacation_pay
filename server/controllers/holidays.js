const Holidays = require("../models/Holidays")

const getHolidays = async(req, res) => {
    const {year} = req.query
    
    try {
        const data = await Holidays.findOne({year})
        res.json(data)
    } catch (error) {
        res.status(500).json({error})
    }

}

const postHolidays = async(req, res) => {
    const { year, data } = req.body
    try {
       await Holidays.create({
           year,
           holidays:data
       })
       res.status(201).json({success:true})
    } catch (error) {
        res.status(500).json({error})
    }

}

module.exports = { getHolidays, postHolidays }