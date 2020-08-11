const { Schema, model } = require('mongoose')

const HolidaysSchema = new Schema({
    year:String,
    holidays:Object
})

const Holidays = model('Holidays',HolidaysSchema)

module.exports = Holidays