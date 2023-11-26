const Router = require('express')
const router = new Router()
const bookController = require('../controllers/bookController')

router.get('/all', bookController.getAll)
router.get('/:id', bookController.getOne)
router.post('/add', bookController.addBook)
router.patch('/:id', bookController.updateBook)
router.delete('/:id', bookController.removeBook)

module.exports = router
