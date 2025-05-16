const successResponse = (res, status = 200, data = null, message = '') => {
    const response = { success: true};
    if (message) response.message = message;
    if (data) response.data = data;
    return res.status(status).json(response);
};

const errorResponse = (res, status = 500, message = '', error = null) => {
    const response = { success: false, message};
    if(error && process.env.NODE_ENV === 'development') {
        response.error = error.message;
        response.stack = error.stack;
    }
    return res.status(status).json(response);
}

module.exports = { successResponse, errorResponse }