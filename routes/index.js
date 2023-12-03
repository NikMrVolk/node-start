const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const bookRouter = require('./bookRouter')

router.use('/user', userRouter)
router.use('/book', bookRouter)

module.exports = router
