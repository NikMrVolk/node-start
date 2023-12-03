const { Schema, model } = require('mongoose')

const Book = new Schema({
	title: { type: String, unique: true, require: true },
	author: { type: String, require: true },
	year: { type: Number, require: true },
	users: [{ type: 'ObjectId', ref: 'User' }],
})

module.exports = model('Book', Book)
