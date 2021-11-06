const jwt = require('jsonwebtoken');
const configs = require('../configs/config_server.json');

function generateToken(params) {
    return jwt.sign(params, configs['AUTH_SECRET'], {
        expiresIn: 86400
    });
}

module.exports = { generateToken }