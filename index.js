const http = require('http')
require('dotenv').config()
const getUsers = require('./modules/getUsers')

const PORT = process.env.PORT || 3003

const server = http.createServer((req, res) => {
	const url = new URL(req.url, 'http://127.0.0.1')
	const searchParams = url.searchParams

	if (!searchParams.toString().length) {
		res.writeHead(200, { 'Content-Type': 'text/plain' })
		res.end('Hello, World!')

		return
	}

	for (let [key, value] of searchParams.entries()) {
		switch (key) {
			case 'users':
				res.writeHead(200, { 'Content-Type': 'application/json' })
				res.end(getUsers())
				break
			case 'hello':
				if (value) {
					res.writeHead(200, { 'Content-Type': 'text/plain' })
					res.end(`Hello, ${value}.`)
				} else {
					res.statusCode = 400
					res.writeHead(200, { 'Content-Type': 'text/plain' })
					res.end('Enter name')
					res.end()
				}
				break
			default:
				res.writeHead(500, { 'Content-Type': 'text/plain' })
				res.end('Not Found')
				break
		}
	}
})

server.listen(PORT, () => {
	console.log(`Start on port ${PORT}`)
})
