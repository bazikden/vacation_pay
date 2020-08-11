const mongoose = require('mongoose')

const host = process.env.DB_HOST || 'localhost'
console.log("host",host)
const url =  `mongodb://${host}:${process.env.DB_PORT}/${process.env.DB_NAME}`
console.log("url",url)
mongoose.connect( url, { useNewUrlParser: true,useFindAndModify:false,useUnifiedTopology:true })

module.exports = mongoose.connection

