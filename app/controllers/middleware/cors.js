const jwt = require('jsonwebtoken');
const configs = require('../../configs/config_server.json');
var cors = require('cors');

module.exports = (req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS, PUT, DELETE");
    res.header("Access-Control-Expose-Headers", "X-Custom");
    res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");

    res.body = { authorization: "Beare asdiasdj" };

    app.use(cors({
        'allowedHeaders': ['sessionId', 'Content-Type'],
        'exposedHeaders': ['sessionId'],
        'Origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'preflightContinue': false,
    }));

    next();

}