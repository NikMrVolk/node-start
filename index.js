require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const login = require('./middlewares/logMiddleware')
const corsOptions = require('./utils/corsOptions')
const router = require('./routes/index')
const errorHandler = require('./middlewares/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 3005
const URL = process.env.URL

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(login())

app.use('/api', router)
// app.use("*", (req, res, next) => {
// 	res.status(404).json('non-existent route')
// })

// End!
app.use(errorHandler)
//

const start = async () => {
	try {
		await mongoose.connect(URL)
		app.listen(PORT, () => console.log(`App work on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()
