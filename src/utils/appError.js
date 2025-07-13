class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Operational errors are expected errors that can be handled gracefully
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
    }
}

module.exports = AppError;

// Error.captureStackTrace(this, this.constructor); 
// -> this line returns line number and file name where the error was created, which is useful for debugging.