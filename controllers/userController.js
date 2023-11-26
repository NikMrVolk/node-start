const ApiError = require('../error/ApiError')
const Book = require('../models/Book')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

class UserController {
	async getAll(req, res, next) {
		try {
			const users = await User.find()
			res.json(users)
		} catch (e) {
			return next(ApiError.internal('Get users error', e))
		}
	}
	async getOne(req, res, next) {
		try {
			const { id } = req.params
			const user = await User.findById(id)
			res.json(user)
		} catch (e) {
			return next(ApiError.internal('Get user error', e))
		}
	}
	async addUser(req, res, next) {
		try {
			const { username, password } = req.body

			if(username.length < 5 || password.length < 5) {
				next(ApiError.badRequest('Username or password must be more than 4 symbols'))
			}

			const candidate = await User.findOne({ username })
			if (candidate) {
				return next(ApiError.badRequest('User with this username exist'))
			}

			const hashPassword = bcrypt.hashSync(password, 7)
			const user = new User({ username, password: hashPassword })

			await user.save()
			res.status(200).json({ message: 'User successfully added' })
		} catch (e) {
			return next(ApiError.internal('Add user error', e))
		}
	}
	async updateUsername(req, res, next) {
		try {
			const { id } = req.params
			const { username } = req.body

			const currUser = await User.findById(id)
			const isNewUsernameAvailable = await User.findOne({ username })

			if (isNewUsernameAvailable) {
				return next(ApiError.badRequest('User with this username already exist'))
			}

			if(username.length < 5) {
				next(ApiError.badRequest('Username must be more than 4 symbols'))
			}

			await User.findOneAndUpdate(currUser._id, { username })
			res.status(200).json({ message: 'Username successfully updated' })
		} catch (e) {
			return next(ApiError.internal('Update username error', e))
		}
	}
	async updatePassword(req, res, next) {
		try {
			const { id } = req.params
			const { password } = req.body

			const currUser = await User.findById(id)
			const comparePassword = bcrypt.compareSync(password, currUser.password)

			if (comparePassword) {
				return next(ApiError.badRequest('It is your old password'))
			}

			if(password.length < 5) {
				next(ApiError.badRequest('P, nextassword must be more than 4 symbols'))
			}

			const hashPassword = bcrypt.hashSync(password, 7)

			await User.findOneAndUpdate(currUser._id, { password: hashPassword })
			res.status(200).json({ message: 'Password successfully updated' })
		} catch (e) {
			return next(ApiError.internal('Update password error', e))
		}
	}
	async removeUser(req, res, next) {
		try {
			const { id } = req.params
			const { password } = req.body

			const user = await User.findById(id)
			const comparePassword = bcrypt.compareSync(password, user.password)

			if (!comparePassword) {
				return next(ApiError.badRequest('It is not you and you can not remove this account'))
			}

			await User.findOneAndDelete(user._id)
			res.status(200).json({ message: 'User successfully removed' })
		} catch (e) {
			return next(ApiError.internal('Remove user error', e))
		}
	}
	async addBookToUser(req, res, next) {
		try {
			const { userId, bookId } = req.params
			const book = await Book.findById(bookId)
			const user = await User.findById(userId)

			const isThisBookChosen = user.books.filter((el) => el.toString() === book._id.toString())
			if (isThisBookChosen.length) {
				return next(ApiError.badRequest('This book has already chosen'))
			}

			user.books.push(bookId)
			book.users.push(userId)
			await user.save()
			await book.save()
			res.status(200).json({ message: 'Book successfully added' })
		} catch (e) {
			return next(ApiError.internal('Add book error', e))
		}
	}
}

module.exports = new UserController()
