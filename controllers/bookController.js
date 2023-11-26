const ApiError = require('../error/ApiError')
const Book = require('../models/Book')

class UserController {
	async getAll(req, res, next) {
		try {
			const books = await Book.find()
			res.json(books)
		} catch (e) {
			return next(ApiError.internal('Get books error', e))
		}
	}
	async getOne(req, res, next) {
		try {
			const { id } = req.params
			const book = await Book.findById(id)
			res.json(book)
		} catch (e) {
			return next(ApiError.internal('Get book error', e))
		}
	}
	async addBook(req, res, next) {
		try {
			const { title, author, year } = req.body

			if (title.length < 3 || author.length < 3) {
				return next(ApiError.badRequest('Title or author mast be more than 2 symbols'))
			}
			if (!Number.isInteger(year)) {
				return next(ApiError.badRequest('Year is not a number'))
			}

			const candidate = await Book.findOne({ title })
			if (candidate) {
				return next(ApiError.badRequest('Book with this title already exist'))
			}

			if (year > new Date().getFullYear()) {
				return next(ApiError.badRequest('Are you guest from the future?'))
			}

			const book = new Book({ title, author, year })
			await book.save()
			res.status(200).json({ message: 'Book successfully added' })
		} catch (e) {
			return next(ApiError.internal('Add book error', e))
		}
	}
	async updateBook(req, res, next) {
		try {
			const { id } = req.params
			const { title, author, year } = req.body

			if (title.length < 3 || author.length < 3) {
				return next(ApiError.badRequest('Title or author mast be more than 2 symbols'))
			}
			if (!Number.isInteger(year)) {
				return next(ApiError.badRequest('Year is not a number'))
			}

			const curBook = await Book.findById(id)
			const isDataNoChanged = curBook.title === title && curBook.author === author && +curBook.year === +year

			if (isDataNoChanged) {
				return next(ApiError.badRequest('It is current book data'))
			}

			const isNewTitleAvailable = await Book.findOne({ title })
			if (isNewTitleAvailable) {
				return next(ApiError.badRequest('Book with this title already exist'))
			}

			if (+year > new Date().getFullYear()) {
				return next(ApiError.badRequest('Are you guest from the future?'))
			}

			await Book.findOneAndUpdate(curBook._id, { title, author, year })
			res.status(200).json({ message: 'Book successfully updated' })
		} catch (e) {
			return next(ApiError.internal('Update book error', e))
		}
	}

	async removeBook(req, res, next) {
		try {
			const { id } = req.params
			const currentBook = await Book.findById(id)

			await Book.findOneAndDelete(currentBook._id)
			res.status(200).json({ message: 'Book successfully removed' })
		} catch (e) {
			return next(ApiError.internal('Remove book error', e))
		}
	}
}

module.exports = new UserController()
