


function requireUser(req, res, next) {
    console.log('Checking if user is authenticated...'); // Debugging line
    if (!req.user) {
        return res.status(401).send({
            name: 'UnauthorizedError',
            message: 'Unauthorized access. Please log in.',
            success: false
        });
    }
    next();
}

module.exports = {requireUser};