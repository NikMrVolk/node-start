class ApiError extends Error {
	constructor(status, message) {
		super()
		this.status = status
		this.message = message
	}

	static badRequest(message) {
		return new ApiError(400, message)
	}

	static internal(message, e) {
		console.log(e)
		return new ApiError(500, message)
	}
}

module.exports = ApiError
