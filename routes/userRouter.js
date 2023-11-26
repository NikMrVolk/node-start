const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.get('/all', userController.getAll)
router.get('/:id', userController.getOne)
router.post('/add', userController.addUser)
router.patch('/:id/name', userController.updateUsername)
router.patch('/:id/password', userController.updatePassword)
router.patch('/:userId/book/:bookId', userController.addBookToUser)
router.delete('/:id', userController.removeUser)

module.exports = router
