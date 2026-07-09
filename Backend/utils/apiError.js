// extends is keyword use to inherit the inbuild function like Error
class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        error = [],
        stack = ""
    ) {
        super(message) // super is used to inherit the parents class
        this.statuscode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.error = error
        if (stack) {
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default ApiError