const jwt = require('jsonwebtoken');
const configs = require('../../configs/config_server.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({
            code: 401,
            message: 'No token provided'
        });

    const parts = authHeader.split(' ');

    if (parts.length !== 2)
        return res.status(401).send({
            code: 401,
            message: 'Token error'
        });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({
            code: 401,
            message: 'Token malformatted'
        });

    jwt.verify(token, configs['AUTH_SECRET'], (err, decoded) => {
        if (err)
            return res.status(401).send({
                code: 401,
                message: 'Token invalid'
            });
        req.userId = decoded.id;
        req.userPermission = decoded.permission;

        return next();
    })

}