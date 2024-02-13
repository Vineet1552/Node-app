// Validator/Validation.js

const joi = require('joi');

const dataValidator = joi.object({
    firstName: joi.string().optional(),
    lastName: joi.string().optional(),
    studentEmail: joi.string().email().optional(),
    studentPhone: joi.number().optional(),
    dialCode: joi.number().optional(),
    password: joi.string().optional(),
})
  
function verifyLogintoken(req, res, next) {const bearerHeader = req.headers['authorization'];
if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
} else {
    res.status(403).json({ msg: 'Forbidden: Token not provided' });
}
}

module.exports = {
    dataValidator,
    verifyLogintoken,
}