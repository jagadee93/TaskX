const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500;
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    return res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
}

module.exports = errorHandler;