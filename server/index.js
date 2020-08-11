
/********************************************************* */
// DB_HOST must be localhost or mongo for docker container
/****************************************************** */
require('dotenv').config()
const express = require('express')
const db = require('./config/database')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

// Routes inports
const users = require('./routes/users')
const userInfo = require('./routes/userInfo')
const admin = require('./routes/admin')
const mail = require('./routes/mail')
const holidays = require('./routes/holidays')

const app = express()
// Middleware
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())

// DB connection

db.on('error', () => console.log('Database connection Error...'))
db.once('open', () => console.log('Database connected...'))

// Routes
app.use('/users',users)
app.use('/user-info',userInfo)
app.use('/admin',admin)
app.use('/sendmail',mail)
app.use('/holidays',holidays)

// will redirect all the non-api routes to react frontend
app.use("/",(req, res) => {
    res.sendFile(path.join(__dirname, '../client','build','index.html'));
});

// For production

const CLIENT_BUILD_PATH = path.join(__dirname, "../client/build");

// Static files
app.use(express.static(CLIENT_BUILD_PATH));

// // Server React Client
// app.get("/", (req, res) => {
//   res.sendFile(path.join(CLIENT_BUILD_PATH , "index.html"));
// });

const PORT = process.env.PORT

app.listen(PORT,()=> console.log(`Server is listen on port ${PORT} ...`))