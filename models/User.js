const { Schema, model } = require('mongoose')

const User = new Schema({
	username: { type: String, unique: true, require: true },
	password: { type: String, require: true },
	firstName: { type: String, require: true },
	lastName: { type: String, require: true },
	books: [{ type: 'ObjectId', ref: 'Book' }],
})

module.exports = model('User', User)
